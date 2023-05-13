const cron = require('node-cron');
const mailer = require('./mailer');
const documentController = require('../controllers/DocumentController');


function start() {
  cron.schedule('*/1 * * * *', function () {
    documentController.getPendingDocuments(function (documents) {
      let current_time = new Date().getTime();
      for (let document of documents) {

        if (document.cantidad_recordatorios < 3) {

          if (document.ultimo_recordatorio !== null) {

            if (((current_time - new Date(document.ultimo_recordatorio).getTime()) / (1000 * 60 * 60)) >= 24) {
              sendReminderEmail(document);
            }
          } else {

            sendReminderEmail(document);
          }
        }
      }
    });
  });
}

console.log(mailer);

function sendReminderEmail(document) {
  let mailOptions = {
    from: '"Firmadoc Notification" <notificaciones@firmadoc.co>',
    to: document.det_cordes,
    subject: 'Recordatorio de documento no firmado',
    text: `Por favor, firma el documento: ${document.doc_nombre}`,
  };

  mailer.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error(error);
    } else {

      documentController.updateDocumentAfterReminder(document.doc_id, function (result) {
        console.log(result);
      });
    }
  });
}

function test() {
  documentController.getPendingDocuments(function (results) {
    console.log(results); // Este código se ejecutará cuando se llame al callback
  });
}

module.exports = { start, test }


          // let mailOptions = {
          //   from: '"Firmadoc Notification" <your-email@example.com>',
          //   to: document.det_cordes,
          //   subject: 'Recordatorio de documento no firmado',
          //   text: `Por favor, firma el documento: ${document.doc_nombre}`,
          // };

          // mailer.sendMail(mailOptions, (error, info) => {
          //   if (error) {
          //     console.error(error);
          //   } else {
          //     // Actualizar el documento después de enviar el correo electrónico
          //   }
          // });