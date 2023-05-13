const connection = require('../config/db');

const getPendingDocuments = (callback) => {
  let sql = `
    SELECT 
      documento.doc_id,
      documento.doc_nombre,
      documento.doc_fechac,
      documento.doc_horac,
      documento.doc_fecha_f,
      documento.doc_hora_f,
      detalledocumento.det_id,
      documento.doc_estado,
      detalledocumento.codigo_verificacion,
      detalledocumento.det_docume,
      detalledocumento.det_nomdes,
      detalledocumento.det_cordes,
      detalledocumento.det_firma,
      usuario.usu_id,
      usuario.usu_nombre,
      usuario.usu_apelli,
      documento.ultimo_recordatorio,
      documento.cantidad_recordatorios
    FROM 
      detalledocumento
    JOIN 
      documento ON documento.doc_id = detalledocumento.det_docume
    JOIN 
      usuario ON usuario.usu_id = documento.doc_usuari
    WHERE
      documento.doc_estado = 'Pendiente' AND detalledocumento.det_firma = 0
  `;

  connection.query(sql, function (error, results) {
    if (error) throw error;
    callback(results);
  });
}

const updateDocumentAfterReminder = (docId, callback) => {
  let sql = `
    UPDATE documento
    SET 
      ultimo_recordatorio = NOW(),
      cantidad_recordatorios = COALESCE(cantidad_recordatorios, 0) + 1
    WHERE doc_id = ?
  `;

  connection.query(sql, [docId], function (error, results) {
    if (error) throw error;
    callback(results);
  });
}
  
  module.exports = {
    getPendingDocuments,
    updateDocumentAfterReminder
  };