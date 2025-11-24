const pool = require('../config/db');

const telefoneModel = {

    // Função para adicionar um novo telefone
    adicionarTelefone: async (id_cliente, numero_telefone) => {
        const connection = await pool.getConnection();
        try {
            const sql = 'INSERT INTO telefones (id_cliente_fk, numero_telefone) VALUES (?, ?)';
            const values = [id_cliente, numero_telefone];
            const [result] = await connection.query(sql, values);
            connection.commit();
            return result.insertId;
        } catch (error) {
            connection.rollback();
            throw error;
        }

    },
    atualizaTelefone: async (id_telefone, novo_numero) => {
        const connection = await pool.getConnection();
        try {
            const sql = 'UPDATE telefones SET numero_telefone = ? WHERE id_telefone = ?';
            const values = [novo_numero, id_telefone];
            const [rows] = await connection.query(sql, values);
            connection.commit();
            return [rows];
        } catch (error) {
            connection.rollback();
            throw error;

        }
    }

};

module.exports = { telefoneModel };