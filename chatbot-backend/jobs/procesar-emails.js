const axios = require('axios');

const BASE_URL = process.env.BACKEND_URL || 'http://localhost:8080';

// Obtiene la lista de procesos y sus campos desde el backend
async function obtenerProcesos() {
  const resp = await axios.get(`${BASE_URL}/api/reglaprocesos`);
  return resp.data;
}

// Extrae a qué campo corresponde cada adjunto usando IA
async function clasificarAdjuntosConIA(attachments, camposEsperados) {
  // camposEsperados: array de { nombre, etiqueta, descripcion }
  const result = {};
  for (const adj of attachments) {
    // Prepara prompt para la IA
    const prompt = `
A continuación tienes el texto extraído de un documento adjunto de email. 
Debes decidir cuál de los siguientes tipos de documento es más probable que sea este archivo. 
Opciones: 
${camposEsperados.map(c => `- ${c.nombre}: ${c.etiqueta || ''} - ${c.descripcion || ''}`).join('\n')}
Texto extraído del documento:
---
${adj.text}
---
Devuelve SOLO el nombre del campo que corresponde (o null si no corresponde a ninguno).
`;
    const resp = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      {
        model: process.env.OPENAI_MODEL || "gpt-4o",
        messages: [
          { role: "system", content: "Eres un clasificador de documentos para automatización. SOLO responde el nombre del campo (o null)." },
          { role: "user", content: prompt }
        ]
      },
      { headers: { 'Authorization': `Bearer ${process.env.OPENAI_API_KEY}` } }
    );
    const campoDetectado = resp.data.choices[0].message.content.trim();
    if (campoDetectado && campoDetectado !== "null") {
      result[campoDetectado] = adj.filename;
    }
  }
  return result;
}

// Extrae campos de texto usando OpenAI
async function extraerCamposConOpenAI(email, proceso) {
  const nombresCampos = proceso.campos.filter(c => !c.esDocumento).map(c => c.nombre);

  const prompt = `
Extrae del mensaje SOLO los siguientes campos obligatorios y responde SOLO el JSON exacto con los nombres de campo (si falta alguno, pon null):

${nombresCampos.map(n => `- ${n}: campo obligatorio`).join('\n')}
Asunto: ${email.subject}
Cuerpo: ${email.body}
Adjuntos: ${(email.attachments || []).map(a => a.filename).join(', ') || 'ninguno'}
---
`;

  const openaiResponse = await axios.post(
    'https://api.openai.com/v1/chat/completions',
    {
      model: process.env.OPENAI_MODEL || "gpt-4o",
      messages: [
        { role: "system", content: "Eres un extractor de datos para automatización de procesos. SOLO responde el JSON." },
        { role: "user", content: prompt }
      ]
    },
    { headers: { 'Authorization': `Bearer ${process.env.OPENAI_API_KEY}` } }
  );

  const respuesta = openaiResponse.data.choices[0].message.content;
  console.log('Respuesta OpenAI:', respuesta);
  let variables = {};
  try {
    variables = JSON.parse(respuesta);
  } catch (err) {
    console.error("No se pudo parsear JSON IA:", respuesta);
  }
  return variables;
}

// Extrae adjuntos y los asigna a campos de documento según extensión
function extraerAdjuntos(email, proceso) {
  const camposDocs = proceso.campos.filter(c => c.esDocumento);
  const result = {};
  for (const campo of camposDocs) {
    if (!campo.docExtensiones) continue;
    const found = (email.attachments || []).find(att =>
      campo.docExtensiones.split(',').some(ext => att.filename.toLowerCase().endsWith(ext.trim().toLowerCase()))
    );
    if (found) result[campo.nombre] = found.filename;
    else result[campo.nombre] = null;
  }
  return result;
}

// Clasifica email por palabras clave (nombre de proceso)
function clasificarEmail(email, procesos) {
  const texto = `${email.subject || ''} ${email.body || ''} ${(email.attachments || []).map(a => a.filename).join(' ')}`.toLowerCase();
  for (const proceso of procesos) {
    if (
      proceso.palabrasClave &&
      proceso.palabrasClave.some(palabra => texto.includes(palabra.toLowerCase()))
    ) {
      return proceso;
    }
  }
  return null;
}

async function iniciarProceso(processKey, variables) {
  const resp = await axios.post(
    `${BASE_URL}/api/proceso/iniciar-con-businesskey/${processKey}`,
    variables
  );
  return resp.data;
}

// Procesa un solo email
async function jobProcesarEmailUnitario(email) {
  const procesos = await obtenerProcesos();
  const proceso = clasificarEmail(email, procesos);

  if (!proceso) {
    console.log('Email no clasificado:', email.subject);
    return;
  }

  const camposTexto = await extraerCamposConOpenAI(email, proceso);
  const camposDocumentoEsperados = proceso.campos.filter(c => c.esDocumento);
  const camposAdjuntosIA = await clasificarAdjuntosConIA(email.attachments || [], camposDocumentoEsperados);

  const campos = { ...camposTexto, ...camposAdjuntosIA, email: email.from, asunto: email.subject };

  // Imprime campos encontrados
  console.log('Campos extraídos:', campos);

  // Chequea qué falta
  const camposFaltantes = proceso.campos.filter(campo => !campos[campo.nombre]).map(c => c.nombre);
  if (camposFaltantes.length === 0) {
    const resp = await iniciarProceso(proceso.processKey, campos);
    console.log(`✓ Proceso iniciado: ${proceso.nombre} para ${email.from}. ID: ${resp.id || "?"}`);
  } else {
    console.log(`✗ Faltan los campos: ${camposFaltantes.join(', ')} para el proceso ${proceso.nombre} en email de ${email.from}`);
  }
}

module.exports = { jobProcesarEmailUnitario };
