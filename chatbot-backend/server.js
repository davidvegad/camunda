require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { leerGmail } = require('./jobs/read-gmail');
const { jobProcesarEmails  } = require('./jobs/procesar-emails');
const cron = require('node-cron');

const app = express();

//app.use(cors());
app.use(cors({
  origin: 'http://localhost:4200', // Cambia el puerto si usas otro en tu front
  credentials: true
}));

app.use(express.json());

// Modulariza tus rutas:
app.use('/api', require('./routes/politicas'));
app.use('/api', require('./routes/chatbot'));

// PROGRAMADOR: ejecuta leerGmail cada 5 minutos

//cron.schedule('*/5 * * * *', async () => {
//  console.log('Ejecutando lectura de Gmail:', new Date().toISOString());
//  try {
//    await leerGmail();
//  } catch (e) {
//    console.error('Error al leer Gmail:', e);
//  }
//});

// Ejecuta una vez al iniciar (opcional)

leerGmail();
/*
jobProcesarEmails()
  .then(() => console.log('Primer job de procesamiento de emails ejecutado.'))
  .catch(console.error);
  */
// (Opcional) Expón un endpoint para ejecutarlo manualmente desde Postman, curl, etc.
/*
app.post('/api/ejecutar-job-emails', async (req, res) => {
  try {
    await jobProcesarEmails();
    res.json({ ok: true, msg: "Job de emails ejecutado correctamente." });
  } catch (err) {
    console.error(err);
    res.status(500).json({ ok: false, error: err.message });
  }
});
*/
// Si en el futuro tienes más rutas, agrégalas aquí igual

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log('Servidor Node.js corriendo en puerto', PORT);
});


