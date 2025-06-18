// utils/ocr.js
const fs = require('fs');
const pdfParse = require('pdf-parse');
const Tesseract = require('tesseract.js');
const path = require('path');

// Extrae texto de PDF
async function extractTextFromPdf(buffer) {
  const data = await pdfParse(buffer);
  return data.text;
}

// Extrae texto de imagen (jpg, png, etc)
async function extractTextFromImage(buffer) {
  // Tesseract necesita un path, así que guardamos el archivo temporalmente
  const tmpPath = path.join(__dirname, `tmp_${Date.now()}.png`);
  fs.writeFileSync(tmpPath, buffer);
  const { data: { text } } = await Tesseract.recognize(tmpPath, 'spa');
  fs.unlinkSync(tmpPath); // Borra temporal
  return text;
}

// Detecta tipo y extrae texto
async function extractTextFromAttachment(filename, buffer) {
  const ext = filename.split('.').pop().toLowerCase();
  if (ext === 'pdf') {
    return extractTextFromPdf(buffer);
  } else if (['jpg', 'jpeg', 'png'].includes(ext)) {
    return extractTextFromImage(buffer);
  } else {
    return ''; // O puedes devolver null, según lógica
  }
}

module.exports = { extractTextFromAttachment };
