const axios = require('axios');

/**
 * Clasifica un email utilizando el modelo local de LM Studio.
 * @param {Object} email - Objeto con subject, body y attachments.
 * @param {Array} procesos - Lista de procesos con nombre, processKey y palabrasClave.
 * @returns {Promise<Object|null>} - El proceso que coincide o null si no hay match.
 */
async function clasificarEmailLocal(email, procesos) {
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

  try {
    const response = await axios.post(process.env.LOCAL_AI_URL || 'http://host.docker.internal:1234/v1/chat/completions', {
      model: "local-model",
      messages: [
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.1,
      max_tokens: 16
    }, {
      headers: {
        'Content-Type': 'application/json'
      }
    });

	console.log("prompt IA LOCAL: ",prompt);
    const salida = response.data.choices[0].message.content.trim().toLowerCase();

	console.log("Salida IA LOCAL: ",salida);
    const match = procesos.find(
      p => salida.includes(p.nombre.toLowerCase()) || salida.includes(p.processKey.toLowerCase())
    );

    return match || null;

  } catch (err) {
    console.error("❌ Error al clasificar email con modelo local:", err.response?.data || err.message);
    return null;
  }
}

module.exports = { clasificarEmailLocal };

