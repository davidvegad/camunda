require('dotenv').config();
const express = require('express');
const axios = require('axios');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

// Ajusta la URL de Camunda a la que tengas en tu backend Java personalizado
const CAMUNDA_API_URL = 'http://localhost:8080/api/proceso/iniciar-con-businesskey/Process_0v8e7t4';

app.post('/api/chatbot-iniciar-proceso', async (req, res) => {
  const { usuario, fechaInicio, dias } = req.body;

  try {
    // Llama a la API de OpenAI (puedes personalizar el prompt)
    const openaiResponse = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      {
        model: process.env.OPENAI_MODEL || "gpt-4.1-nano",
        messages: [
          { role: "system", content: "Eres un asistente de recursos humanos." },
          { role: "user", content: `El usuario ${usuario} solicita vacaciones desde ${fechaInicio} por ${dias} días.` }
        ]
      },
      { headers: { 'Authorization': `Bearer ${process.env.OPENAI_API_KEY}` } }
    );
    // Puedes usar la respuesta de OpenAI si lo deseas.
    // const respuestaIA = openaiResponse.data.choices[0].message.content;

    // Inicia el proceso en Camunda
    // ENVÍA EL BODY PLANO (NO ANIDADO EN "variables")
    const camundaResponse = await axios.post(CAMUNDA_API_URL, {
      usuario: usuario,
      fechaInicio: fechaInicio,
      dias: dias
    });

    res.json({ ok: true, processInstanceId: camundaResponse.data.id });
  } catch (e) {
    console.error(e.response?.data || e.message);
    res.status(500).json({ ok: false, error: e.message });
  }
});

app.post('/api/chatbot-iniciar-proceso-libre', async (req, res) => {
  const texto = req.body.texto || '';
  try {
    // 1. Prompt a OpenAI para EXTRAER los datos
    const openaiResponse = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      {
        model: process.env.OPENAI_MODEL || "gpt-4.1-nano",
        messages: [
          { role: "system", content: "Eres un asistente de recursos humanos. Extrae los datos para iniciar una solicitud de vacaciones de un mensaje en lenguaje natural. Devuélvelos en JSON EXACTAMENTE así: { \"usuario\": \"...\", \"fechaInicio\": \"YYYY-MM-DD\", \"dias\": N }" },
          { role: "user", content: texto }
        ]
      },
      { headers: { 'Authorization': `Bearer ${process.env.OPENAI_API_KEY}` } }
    );
    // Extrae los datos de la respuesta
    const respuesta = openaiResponse.data.choices[0].message.content;
    // Intenta parsear el JSON de la respuesta
    let variables = {};
    try {
      variables = JSON.parse(respuesta);
    } catch (err) {
      // Si la IA devolvió un texto raro, manda error
      return res.status(400).json({ ok: false, error: 'No se pudieron extraer los datos del mensaje.' });
    }

    // 2. Llama a Camunda
    const camundaResponse = await axios.post(
      'http://localhost:8080/api/proceso/iniciar-con-businesskey/Process_1euowey',
      variables
    );
    res.json({ ok: true, processInstanceId: camundaResponse.data.id, variables });
  } catch (e) {
    console.error(e.response?.data || e.message);
    res.status(500).json({ ok: false, error: e.message });
  }
});


const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log('Servidor Node.js corriendo en puerto', PORT);
});
