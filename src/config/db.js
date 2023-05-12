var mysql = require('mysql');

const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
  });

pool.getConnection(function(err, connection) {
  if (err) {
    console.error('Error connecting: ' + err.stack);
    return;
  }

  connection.query('SELECT 1 + 1 AS solution', function(err, rows, fields) {
    connection.release(); // libera la conexión cuando hayas terminado

    if (err) {
      console.error('Error executing query: ' + err.stack);
      return;
    }

    console.log('The solution is: ', rows[0].solution);
  });
});
