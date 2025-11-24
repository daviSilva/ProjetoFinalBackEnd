const pool = require('../config/db');

const telefoneModel = {

    // Função para adicionar um novo telefone
    /**
     * * @function adicionarTelefone
     * 
     * @description
     * Registra um novo número de telefone vinculado a um cliente específico.
     * A função insere o telefone na tabela "telefones", relacionando o número
     * ao cliente através do ID fornecido.
     * 
     * @param {number} id_cliente - ID do cliente ao qual o telefone será associado.
     * @param {string} numero_telefone - Número de telefone que será cadastrado.
     * 
     * @returns {Promise<number>} Retorna o ID do telefone inserido na tabela.
     * 
     * @throws {Error} Caso ocorra algum erro durante a inserção no banco de dados.
     */
    
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

    /**
     * @function atualizaTelefone
     * 
     * @description
     * Atualiza o número de telefone de um registro existente na tabela "telefones".
     * A função localiza o telefone pelo ID e substitui o número antigo pelo novo
     * fornecido como parâmetro.
     * 
     * @param {number} id_telefone - ID do telefone que será atualizado.
     * @param {string} novo_numero - Novo número que substituirá o atual.
     * 
     * @returns {Promise<object>} Retorna o resultado da operação de atualização.
     * 
     * @throws {Error} Caso ocorra algum problema durante a atualização no banco de dados.
     */
    
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