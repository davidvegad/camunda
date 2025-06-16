const express = require('express');
const router = express.Router();
const fs = require('fs/promises');
const path = require('path');
const pdf = require('pdf-parse');
const axios = require('axios');

const RUTA_POLITICAS = path.join(__dirname, '..', 'politicas');

router.post('/consultar-politicas', async (req, res) => {
  const pregunta = req.body.pregunta || '';
  try {
    const files = await fs.readdir(RUTA_POLITICAS);
    const pdfFiles = files.filter(f => f.endsWith('.pdf'));
    let politicasTexto = '';
    for (const file of pdfFiles) {
      const data = await fs.readFile(path.join(RUTA_POLITICAS, file));
      const texto = await pdf(data);
      politicasTexto += '\n---\n' + texto.text;
    }
    const fragmento = politicasTexto.substring(0, 8000);

    const prompt = [
      { role: "system", content: "Eres un asistente experto que SOLO puede responder usando la siguiente política de la empresa. Si la política no contiene la respuesta, indica claramente que no puedes responder." },
      { role: "system", content: `Política de la empresa extraída de PDFs:\n"""\n${fragmento}\n"""` },
      { role: "user", content: pregunta }
    ];

    const openaiResponse = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      {
        model: process.env.OPENAI_MODEL || "gpt-4o",
        messages: prompt,
        temperature: 0.1
      },
      { headers: { 'Authorization': `Bearer ${process.env.OPENAI_API_KEY}` } }
    );

    const respuesta = openaiResponse.data.choices[0].message.content;
    res.json({ respuesta });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Error procesando la consulta o leyendo los archivos PDF.' });
  }
});

module.exports = router;
