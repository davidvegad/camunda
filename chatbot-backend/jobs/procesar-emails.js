const axios = require('axios');
const { clasificarEmailLocal } = require('./clasificarEmailLocal');

const BASE_URL = process.env.BACKEND_URL || 'http://docker-backend:8080';

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
Opciones disponibles: 
${camposEsperados.map(c => `- ${c.nombre}: ${c.etiqueta || ''} - ${c.descripcion || ''}`).join('\n')}
Texto extraído del documento:
---
${adj.text}
---
Instrucciones finales:
- Devuelve solo el nombre del campo más adecuado entre los disponibles.
- Si el documento no coincide con ninguno, responde exactamente: null
- No agregues explicaciones ni comillas.
`;
	console.log("Promt clasificarAdjuntosConIA",prompt);
    const resp = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      {
        model: process.env.OPENAI_MODEL || "gpt-4o",
        messages: [
          { role: "system", content: "Eres un clasificador inteligente de documentos para automatización de procesos empresariales. SOLO responde el nombre del campo (o null)." },
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

  console.log('nombresCampos: ',nombresCampos);
  const openaiResponse = await axios.post(
    'https://api.openai.com/v1/chat/completions',
    {
      model: process.env.OPENAI_MODEL || "gpt-4.1-nano",
      messages: [
        { role: "system", content: "Eres un extractor de datos para automatización de procesos. SOLO responde el JSON." },
        { role: "user", content: prompt }
      ]
    },
    { headers: { 'Authorization': `Bearer ${process.env.OPENAI_API_KEY}` } }
  );

  const respuesta = openaiResponse.data.choices[0].message.content;
  console.log('Respuesta extraerCamposConOpenAI:', respuesta);
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

async function clasificarEmailIA(email, procesos) {
  const prompt = `
    Procesos disponibles:
    ${procesos.map((p, i) =>
      `${i + 1}. ${p.nombre} (palabras clave: ${p.palabrasClave.join(', ')})`).join('\n')
    }
    
    Dado el siguiente email, ¿a cuál de los procesos corresponde?
    
    Email:
    Asunto: ${email.subject}
    Cuerpo: ${email.body}
    Archivos adjuntos: ${(email.attachments || []).map(a => a.filename).join(', ')}
    
    Responde sólo el nombre o key del proceso más adecuado, o "ninguno" si no corresponde a ninguno.
    `;


  // Llamada a OpenAI API (ejemplo con fetch, puede variar)
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`
    },
    body: JSON.stringify({
      model: process.env.OPENAI_MODEL || "gpt-4.1-nano",
      messages: [{ role: "user", content: prompt }],
      max_tokens: 16
    })
  });
  const data = await response.json();
  const salida = data.choices[0].message.content.trim().toLowerCase();

  // Busca el proceso por nombre o key devuelto por la IA
  const match = procesos.find(
    p => salida.includes(p.nombre.toLowerCase()) || salida.includes(p.processKey.toLowerCase())
  );
  return match || null;
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
  //Prepara datos para buscar en emails
  const procesos = await obtenerProcesos();
  //const proceso = clasificarEmail(email, procesos);
  //Inicia la clasificacion del email para asignarlo a un proceso con la IA, el servicio temrina cuando no encuentra resultados
  //const proceso = await clasificarEmailIA(email, procesos);
  const proceso = await clasificarEmailLocal(email, procesos);

  console.log('Proceso: ',proceso.nombre);

  if (!proceso) {
    console.log('Email no clasificado:', email.subject);
    return;
  }

  const camposTexto = await extraerCamposConOpenAI(email, proceso);
  const camposDocumentoEsperados = proceso.campos.filter(c => c.esDocumento);
  const camposAdjuntosIA = await clasificarAdjuntosConIA(email.attachments || [], camposDocumentoEsperados);
  console.log('camposAdjuntosIA:', camposAdjuntosIA);
  
  // Chequea los campos faltantes de texto (no documentos)
  let campos = { ...camposTexto, ...camposAdjuntosIA, email: email.from, asunto: email.subject };
  let camposFaltantes = proceso.campos.filter(
    campo => !campo.esDocumento && !campos[campo.nombre]
  ).map(c => c.nombre);

  // 3. Si faltan campos de texto, busca en los adjuntos usando IA
  if (camposFaltantes.length && email.attachments && email.attachments.length) {
    for (const campoFaltante of camposFaltantes) {
      for (const adj of email.attachments) {
        if (!adj.text) continue; // Solo si hay texto extraído
        // Crea un "pseudo-email" con el texto del adjunto como cuerpo
        const pseudoEmail = {
          subject: email.subject,
          body: adj.text,
          attachments: []
        };
        const camposExtraAdjunto = await extraerCamposConOpenAI(pseudoEmail, proceso);
        if (camposExtraAdjunto[campoFaltante]) {
          campos[campoFaltante] = camposExtraAdjunto[campoFaltante];
          break; // Si lo encuentras en algún adjunto, deja de buscar ese campo
        }
      }
    }
  }

  // Chequea qué falta
  camposFaltantes = proceso.campos.filter(campo => !campos[campo.nombre]).map(c => c.nombre);
  console.log('Cambios enviados al proceso: ',campos);
  if (camposFaltantes.length === 0) {
    const resp = await iniciarProceso(proceso.processKey, campos);
    console.log(`✓ Proceso iniciado: ${proceso.nombre} para ${email.from}. ID: ${resp.id || "?"}`);
  } else {
    console.log(`✗ Faltan los campos: ${camposFaltantes.join(', ')} para el proceso ${proceso.nombre} en email de ${email.from}`);
  }
}

module.exports = { jobProcesarEmailUnitario };
