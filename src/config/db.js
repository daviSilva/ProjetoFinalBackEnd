const mysql = require('mysql2/promise');

const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: 'dcs@234',
  database: 'sistema_entregas',
   port: 3308,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

module.exports = pool;
(async () => {
    try {
        const connection = await pool.getConnection();
        console.log('Conectado ao MySQL')
        connection.release()
    } catch (error) {
        console.error(`Erro ao conectar ao MySQL: ${error}`);
    }
})();