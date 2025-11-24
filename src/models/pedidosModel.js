const pool = require ('../config/db')

const pedidosModel  = {

    /**
     * Criar um novo pedido no banco de dados.
     * 
     * @param {Object} param0 Objeto contendo os dados do pedido.
     * @param {string} param0.dataPedido - Data em que o pedido foi realizado.
     * @param {string} param0.entrega - Tipo ou status da entrega.
     * @param {number} param0.distancia - Distância percorrida em KM.
     * @param {number} param0.peso_carga - Peso da carga transportada.
     * @param {number} param0.valor_km - Valor calculado por KM.
     * @param {number} param0.valor_por_kg - Valor calculado por KG.
     * 
     * @returns {Promise<Object>} Resultado da operação INSERT.
     */
    criarPedido: async ({ dataPedido, entrega, distancia, peso_carga, valor_km, valor_por_kg }) => {

        // SQL corrigido — antes estava salvando na tabela "clientes"
        const sql = `
            INSERT INTO pedidos 
            (dataPedido, entrega, distancia, peso_carga, valor_km, valor_por_kg) 
            VALUES (?, ?, ?, ?, ?, ?)
        `;

        const values = [dataPedido, entrega, distancia, peso_carga, valor_km, valor_por_kg];

        // Executa a query no banco de dados
        const [rows] = await pool.query(sql, values);

        return rows; // retorna informações do INSERT, como insertId
    },


    /**
     * Buscar todos os pedidos cadastrados no sistema.
     * 
     * @returns {Promise<Array>} Lista de pedidos encontrados.
     */
    buscarTodosPedidos: async () => {

        // SQL corrigido — antes estava totalmente inválido
        const sql = "SELECT * FROM pedidos";

        const [rows] = await pool.query(sql);

        return rows; // retorna array com todos os pedidos
    },


    /**
     * Excluir um pedido baseado no ID.
     * 
     * @param {number} idPedido - ID do pedido a ser excluído.
     * @returns {Promise<Object>} Resultado da operação DELETE.
     */
    excluirPedido: async (idPedido) => {

        // SQL estava ausente
        const sql = "DELETE FROM pedidos WHERE idPedido = ?";

        const [result] = await pool.query(sql, [idPedido]);

        return result; // retorna quantidade de linhas afetadas
    },

};


    module.exports = { pedidosModel}