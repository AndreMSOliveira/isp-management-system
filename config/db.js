const mysql = require('mysql2');

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'pietro01',
  database: 'provedor_db'
});

connection.connect((err) => {
  if (err) {
    console.error('Erro ao conectar:', err);
    return;
  }

  console.log('Conectado ao MySQL!');
});

module.exports = connection;