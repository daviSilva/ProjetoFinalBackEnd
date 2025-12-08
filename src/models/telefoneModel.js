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
            const sql = 'INSERT INTO telefones (id_cliente_fk, telefone) VALUES (?, ?)';
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
            const sql = 'UPDATE telefones SET telefone = ? WHERE IDTelefone = ?';
            const values = [novo_numero, id_telefone];
            const [rows] = await connection.query(sql, values);
            connection.commit();
            return [rows];
        } catch (error) {
            connection.rollback();
            throw error;

        }
    },
    /**
     * função para selecionar todos os telefones
     * @returns <promise<object[]>} array de objetos com os dados dos telefones
     * @example
     * chamada da função:
     * const telefones = await telefoneModel.selecionaTodosTelefones();
     * // Output esperado:
     * [
     * {
     * "IDTelefone": 1,
     * "id_cliente_fk": 2,
     * "telefone": "11999999999"
     * },
     * {
     * "IDTelefone": 2,
     * "id_cliente_fk": 3,
     * "telefone": "11888888888"
     * }
     * ]
     * 
     */

    selecionaTodosTelefones: async () => {
        try {
            const connection = await pool.getConnection();
            const sql = 'SELECT * FROM telefones';
            const [rows] = await connection.query(sql);
            return rows;

        } catch (error) {
            connection.rollback();
            throw error;

        }
    },
    // Deletar Telefone
    /**
 /**
     * @function deleteTelefone
     *
     * @description
     * Remove um telefone do banco de dados com base no ID informado.
     * Se o ID não existir, o resultado retornará `affectedRows = 0`.
     *
     * @param {number} id_telefone - ID do telefone que será excluído.
     *
     * @returns {Promise<object>} Retorno contendo o resultado da exclusão,
     * incluindo a quantidade de linhas afetadas.
     *
     * @throws {Error} Caso ocorra falha no processo de exclusão.
     */
    deleteTelefone: async (id_telefone) => {
        const connection = await pool.getConnection();
        try {
            const sql = 'DELETE FROM telefones WHERE IDTelefone = ?';
            const values = [id_telefone];
            const [result] = await connection.query(sql, values);
            connection.commit();
            return result;
        } catch (error) {
            connection.rollback();
            throw error;
        }
    },
    // Selecionar Telefone por ID
    /**
     * @function selecionaTelefonePorId
     *
     * @description
     * Busca um único telefone no banco de dados usando seu ID como parâmetro.
     * Se nenhum telefone for encontrado, retorna um array vazio.
     *
     * @param {number} id_telefone - ID do telefone que será pesquisado.
     *
     * @returns {Promise<object[]>} Array contendo o telefone encontrado,
     * ou array vazio caso não exista.
     *
     * @throws {Error} Caso ocorra falha na consulta ao banco.
     */

    selecionaTelefonePorId: async (id_telefone) => {
        const connection = await pool.getConnection();
        try {
            const sql = 'SELECT * FROM telefones WHERE IDTelefone = ?';
            const values = [id_telefone];
            const [rows] = await connection.query(sql, values);
            connection.commit();
            return rows;
        } catch (error) {
            connection.rollback();
            throw error;
        }
    }
};

module.exports = { telefoneModel };
