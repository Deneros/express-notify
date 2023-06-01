const cron = require('node-cron');
const mailer = require('./mailer');
const documentController = require('../controllers/DocumentController');
const createHtmlTemplate = require('./template');


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
    // text: `Por favor, firma el documento: ${document.doc_nombre}`,
    html:createHtmlTemplate(document.doc_nombre, document.det_cordes)
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


module.exports = { start, test }
