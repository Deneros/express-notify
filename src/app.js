require('dotenv').config();
const express = require('express');
const reminderService = require('./services/reminder');

const app = express();
const port =  3000;

app.get('/', (req, res) => {
  res.send('¡Hola Mundo!');
});

reminderService.start();


app.listen(port, '0.0.0.0', () => {
  console.log(`La aplicación está escuchando en http://localhost:${port}`);
});