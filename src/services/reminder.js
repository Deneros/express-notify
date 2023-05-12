const cron = require('node-cron');
const mailer = require('./mailer');
const db = require('../config/db');

function start() {
  // Configurar el cron job para que se ejecute cada día a las 9:00 AM.
  cron.schedule('42 9 * * *', async function() {
    console.log('hola soy cron job')
    // Realizar la consulta a la base de datos para obtener los documentos no firmados.
    // const unsignedDocuments = await db.query('SELECT * FROM documents WHERE signed = false');

    // for (let document of unsignedDocuments) {
    //   // Enviar un correo electrónico para cada documento no firmado.
    //   await mailer.sendMail(document.userEmail, 'Recordatorio de documento no firmado', `Por favor, firma el documento: ${document.name}`);
    // }
  });
}

module.exports = { start };