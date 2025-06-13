const fs = require('fs').promises;
const path = require('path');
const { authenticate } = require('@google-cloud/local-auth');
const { google } = require('googleapis');
const axios = require('axios');
require('dotenv').config();



const SCOPES = ['https://www.googleapis.com/auth/gmail.modify'];
const CREDENTIALS_PATH = path.join(process.cwd(), 'credentials.json');
const TOKEN_PATH = path.join(process.cwd(), 'token.json');

// Carga o pide credenciales
async function loadSavedCredentialsIfExist() {
  try {
    const content = await fs.readFile(TOKEN_PATH);
    return JSON.parse(content);
  } catch (err) {
    return null;
  }
}

// Guarda token OAuth2
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

// Autenticación OAuth2
async function authorize() {
  let client = await loadSavedCredentialsIfExist();
  if (client) {
    return google.auth.fromJSON(client);
  }
  client = await authenticate({
    scopes: SCOPES,
    keyfilePath: CREDENTIALS_PATH,
  });
  if (client.credentials) {
    await saveCredentials(client);
  }
  return client;
}

// Leer emails nuevos
async function listMessages(auth) {
  const gmail = google.gmail({ version: 'v1', auth });
  // Lee los 5 últimos emails en la bandeja principal (inbox)
  const res = await gmail.users.messages.list({
    userId: 'me',
    labelIds: ['INBOX'],
    maxResults: 5,
    q: 'is:unread', // Solo no leídos
  });

  const messages = res.data.messages || [];
  for (const msg of messages) {
    const msgRes = await gmail.users.messages.get({
      userId: 'me',
      id: msg.id,
      format: 'full'
    });
    const headers = msgRes.data.payload.headers;
    const from = headers.find(h => h.name === 'From')?.value;
    const subject = headers.find(h => h.name === 'Subject')?.value;
    const bodyPart = msgRes.data.payload.parts?.find(p => p.mimeType === 'text/plain');
    const body = bodyPart ? Buffer.from(bodyPart.body.data, 'base64').toString() : '';

    console.log('----');
    console.log('De:', from);
    console.log('Asunto:', subject);
    console.log('Cuerpo:', body.substring(0, 400));
    // Aquí puedes integrar con tu función para procesar e iniciar el proceso en Camunda
	await procesarEmail({ remitente: from, asunto: subject, cuerpo: body });


	// (Opcional) Marca el email como leído
    await gmail.users.messages.modify({
      userId: 'me',
      id: msg.id,
      resource: { removeLabelIds: ['UNREAD'] }
    });
  }
}

async function procesarEmail({ remitente, asunto, cuerpo }) {
  try {
    // 1. Llama a OpenAI para extraer datos
    const prompt = [
      { role: "system", content: "Eres un asistente para atención al cliente. Extrae del email los siguientes datos y devuelve SOLO el JSON: { \"email\": \"\", \"asunto\": \"\", \"necesidad\": \"\", \"sentimiento\": \"\", \"documento\": \"\" }. Si no hay documento, pon null. Si no identificas el sentimiento pon neutral" },
      { role: "user", content: `Remitente: ${remitente}\nAsunto: ${asunto}\nCuerpo: ${cuerpo}` }
    ];

    const openaiResponse = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      {
        model: process.env.OPENAI_MODEL || "gpt-4.1-nano",
        messages: prompt
      },
      { headers: { 'Authorization': `Bearer ${process.env.OPENAI_API_KEY}` } }
    );

    let datos;
    try {
      datos = JSON.parse(openaiResponse.data.choices[0].message.content);
    } catch (err) {
      console.error('No se pudieron extraer los datos del email:', err);
      return;
    }

    // 2. Si falta documento, responde al cliente (opcional)
    if (!datos.documento || datos.documento === 'null') {
      await enviarEmail(
        remitente,
        datos.asunto,
        "Por favor, responde a este email indicando tu número de documento para poder continuar con tu solicitud." + cuerpo
      );
      console.log("Email enviado solicitando número de documento.");
      return;
    }

    // 3. Inicia el proceso en Camunda
    const camundaResponse = await axios.post(
      'http://localhost:8080/api/proceso/iniciar-con-businesskey/Process_0v8e7t4', // Ajusta process key
      {
        email: datos.email,
        asunto: datos.asunto,
        necesidad: datos.necesidad,
        sentimiento: datos.sentimiento,
        documento: datos.documento
      }
    );
    console.log("Proceso iniciado en Camunda. ID:", camundaResponse.data);

  } catch (e) {
    console.error('Error al procesar el email:', e);
  }
}

const nodemailer = require('nodemailer');

async function enviarEmail(destino, asunto, cuerpo) {
  let transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: 587,
    secure: false,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS
    }
  });

  await transporter.sendMail({
    from: '"Atención Cliente" <corusconsultinglatam@gmail.com>',
    to: destino,
    subject: asunto,
    text: cuerpo
  });
}


// Ejecuta la lectura
authorize().then(listMessages).catch(console.error);
