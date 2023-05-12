require('dotenv').config();
const express = require('express');
const reminderService = require('./services/reminder');

const app = express();
const port = process.env.PORT || 3000;

// Iniciar el servicio de recordatorios.
reminderService.start();

app.listen(port, () => {
  console.log(`La aplicación está escuchando en http://localhost:${port}`);
});