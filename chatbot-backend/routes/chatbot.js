const express = require('express');
const router = express.Router();
const axios = require('axios');

// Ajusta la URL de Camunda a la que tengas en tu backend Java personalizado
const CAMUNDA_API_URL = 'http://localhost:8080/api/proceso/iniciar-con-businesskey/Process_0v8e7t4';

//const BACKEND_URL = process.env.BACKEND_URL || "http://docker-backend:8080";


router.post('/chatbot-iniciar-proceso', async (req, res) => {
  const { usuario, fechaInicio, dias } = req.body;

  try {
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

router.post('/chatbot-iniciar-proceso-libre', async (req, res) => {
  console.log('BODY RECIBIDO:', req.body);
  const texto = req.body.texto || '';
  try {
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
    const respuesta = openaiResponse.data.choices[0].message.content;
    let variables = {};
    try {
      variables = JSON.parse(respuesta);
    } catch (err) {
      return res.status(400).json({ ok: false, error: 'No se pudieron extraer los datos del mensaje.' });
    }

    const camundaResponse = await axios.post(
      `${process.env.BACKEND_URL}/api/proceso/iniciar-con-businesskey/Process_1euowey`,
      variables
    );
    res.json({ ok: true, processInstanceId: camundaResponse.data.id, variables });
  } catch (e) {
    console.error(e.response?.data || e.message);
    res.status(500).json({ ok: false, error: e.message });
  }
});

module.exports = router;
