const fs = require('fs').promises;
const path = require('path');
const { authenticate } = require('@google-cloud/local-auth');
const { google } = require('googleapis');
const { htmlToText } = require('html-to-text');
const axios = require('axios');
require('dotenv').config();

const { extractTextFromAttachment } = require('../utils/ocr');
const { jobProcesarEmailUnitario } = require('./procesar-emails');

const SCOPES = ['https://www.googleapis.com/auth/gmail.modify'];
const CREDENTIALS_PATH = path.join(process.cwd(), 'credentials.json');
const TOKEN_PATH = path.join(process.cwd(), 'token.json');

// OAuth helpers
async function loadSavedCredentialsIfExist() {
  try {
    const content = await fs.readFile(TOKEN_PATH);
    return JSON.parse(content);
  } catch (err) {
    return null;
  }
}
async function saveCredentials(client) {
  const content = await fs.readFile(CREDENTIALS_PATH);
  const keys = JSON.parse(content);
  const payload = JSON.stringify({
    type: 'authorized_user',
    client_id: keys.installed.client_id,
    client_secret: keys.installed.client_secret,
    refresh_token: client.credentials.refresh_token,
  });
  await fs.writeFile(TOKEN_PATH, payload);
}
async function authorize() {
  let client = await loadSavedCredentialsIfExist();
  if (client) return google.auth.fromJSON(client);
  client = await authenticate({ scopes: SCOPES, keyfilePath: CREDENTIALS_PATH });
  if (client.credentials) await saveCredentials(client);
  return client;
}

function findTextInParts(parts) {
  for (const part of parts) {
    if (part.mimeType === 'text/plain' && part.body && part.body.data) {
      return Buffer.from(part.body.data, 'base64').toString();
    }
  }
  for (const part of parts) {
    if (part.mimeType === 'text/html' && part.body && part.body.data) {
      const html = Buffer.from(part.body.data, 'base64').toString();
      return htmlToText(html);
    }
  }
  // Si hay más partes anidadas
  for (const part of parts) {
    if (part.parts && part.parts.length > 0) {
      const res = findTextInParts(part.parts);
      if (res) return res;
    }
  }
  return '';
}

function decodeBase64(data) {
  // Gmail puede usar URL-safe base64
  data = data.replace(/-/g, '+').replace(/_/g, '/');
  return Buffer.from(data, 'base64').toString('utf8');
}

function findTextRecursive(part) {
  if (!part) return '';

  // Si tiene partes hijas, recorre cada una
  if (part.parts && part.parts.length > 0) {
    for (const sub of part.parts) {
      const result = findTextRecursive(sub);
      if (result) return result;
    }
  }

  // Prefiere text/plain
  if (part.mimeType === 'text/plain' && part.body && part.body.data) {
    return decodeBase64(part.body.data);
  }

  // Si hay HTML, lo transforma a texto
  if (part.mimeType === 'text/html' && part.body && part.body.data) {
    const html = decodeBase64(part.body.data);
    return htmlToText(html);
  }

  // Si encuentra cualquier data, úsala
  if (part.body && part.body.data) {
    return decodeBase64(part.body.data);
  }

  return '';
}

// Extrae cuerpo robustamente (recursivo)
async function extractBody(payload) {
  const text = findTextRecursive(payload);
  return typeof text === 'string' ? text : '';
}

// Extrae adjuntos (robusto y recursivo)
// **NUEVA:** Extrae adjuntos y su contenido
async function extractAttachmentsAndText(gmail, userId, payload, messageId) {
  let files = [];
  const parts = payload.parts || [];
  for (const part of parts) {
    if (part.filename && part.filename.length > 0 && part.body && part.body.attachmentId) {
      // Descarga el archivo
      const att = await gmail.users.messages.attachments.get({
        userId,
        messageId,
        id: part.body.attachmentId
      });
      const buffer = Buffer.from(att.data.data, 'base64');
      const text = await extractTextFromAttachment(part.filename, buffer);
      files.push({
        filename: part.filename,
        mimeType: part.mimeType,
        buffer, // Puedes guardar el buffer si quieres guardarlo luego
        text
      });
    }
    // Anidados
    if (part.parts && part.parts.length > 0) {
      const nested = await extractAttachmentsAndText(gmail, userId, part, messageId);
      files = files.concat(nested);
    }
  }
  return files;
}

// Lee emails y procesa cada uno
async function listMessages(auth) {
  const gmail = google.gmail({ version: 'v1', auth });
  const res = await gmail.users.messages.list({
    userId: 'me',
    labelIds: ['INBOX'],
    maxResults: 5,
    q: 'is:unread',
  });
  const messages = res.data.messages || [];
  for (const msg of messages) {
    const msgRes = await gmail.users.messages.get({
      userId: 'me',
      id: msg.id,
      format: 'full'
    });
	const payload = msgRes.data.payload;
	if (payload.parts) {
  payload.parts.forEach((p, i) => {
    console.log(`Parte #${i}:`, p.mimeType, p.filename ? '(archivo adjunto)' : '');
    if (p.body && p.body.data) {
      console.log('DATA:', p.body.data.slice(0, 50) + '...');
    }
  });
}

    const headers = msgRes.data.payload.headers;
    const from = headers.find(h => h.name === 'From')?.value;
    const subject = headers.find(h => h.name === 'Subject')?.value;
    const body = await extractBody(msgRes.data.payload);
    const attachments = await extractAttachmentsAndText(gmail, 'me', msgRes.data.payload, msg.id);


    console.log('----');
    console.log('De:', from);
    console.log('Asunto:', subject);
    //console.log('Cuerpo:', body.substring(0, 400));
	console.log('Cuerpo:', typeof body === 'string' ? body.substring(0, 400) : JSON.stringify(body).substring(0, 400));
    console.log('Adjuntos:', attachments.map(a => a.filename));

    // Procesa usando tu lógica inteligente
    await jobProcesarEmailUnitario({
      from, subject, body, attachments
    });

    // Marca como leído
    await gmail.users.messages.modify({
      userId: 'me',
      id: msg.id,
      resource: { removeLabelIds: ['UNREAD'] }
    });
  }
}

// Punto de entrada para usar como script o módulo
async function leerGmail() {
  const auth = await authorize();
  await listMessages(auth);
}

module.exports = { leerGmail };

if (require.main === module) {
  leerGmail().catch(console.error);
}
