const mysql = require('mysql2/promise')
//Limitar as conexoes e quando estão cheias ele vai aguardar uma conexão ficar livre para colocar outra.
const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: '1234',
    database: 'sistema_entregas',
    port: 3308,
    waitForConnections: true, //Aguarda conexoes livres
    connectionLimit: 10, //Limita o numero de conexoes
    queueLimit: 0 //Sem limite para a fila de espera
});

(async () => {
    try {
        const connection = await pool.getConnection();
        console.log('Conectado ao MySQL')
        connection.release()
    } catch (error) {
        console.error(`Erro ao conectar ao MySQL: ${error}`);
    }
})();