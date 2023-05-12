const cron = require('node-cron');
const mailer = require('./mailer');
const documentController = require('../controllers/DocumentController');


function start() {
  cron.schedule('*/1 * * * *', function() {
    documentController.getPendingDocuments(function(documents) {
      let current_time = new Date().getTime();
      for (let document of documents) {
        // Si la cantidad de recordatorios es menor a 3, procedemos
        if (document.cantidad_recordatorios < 3) {
          // Verificamos que el último recordatorio no sea null
          if (document.ultimo_recordatorio !== null) {
            // Si ha pasado más de un día desde el último recordatorio, enviamos otro
            if (((current_time - new Date(document.ultimo_recordatorio).getTime()) / (1000 * 60 * 60)) >= 24) {
              // Código para enviar correo electrónico
              documentController.updateDocumentAfterReminder(document.doc_id, function(result) {
                console.log(result);
              });
            }
          } else {
            // Si el último recordatorio es null, asumimos que no se ha enviado ninguno y enviamos el primero
            // Código para enviar correo electrónico
            documentController.updateDocumentAfterReminder(document.doc_id, function(result) {
              console.log(result);
            });
          }
        }
      }
    });
  });
}

function test(){
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