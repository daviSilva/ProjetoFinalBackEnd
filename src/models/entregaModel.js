const pool = require('../config/db');

const entregaModel = {
    // Valores base fixos para calculos


    // Mostrar todas as entregas
    mostraTodasEntregas: async () => {
        const connection = await pool.getConnection();
        try {
            const sql = 'SELECT * FROM entregas';
            const [rows] = await connection.query(sql);
            return rows;
        } catch (error) {
            throw error;
        } 
    },


    //criar uma nova entrega, pegando informações como valores do pedido
    /**
     * Cria uma nova entrada na tabela 'entregas' com base nos valores calculados do pedido.
     * @param {number} id_pedido_fk - ID do pedido.
     * @param {number} valor_distancia - Valor calculado baseado na distância (valor_km do pedido).
     * @param {number} valor_peso - Valor calculado baseado no peso (valor_kg do pedido).
     * @param {number} acrescimo - O acréscimo de 30% se a entrega for "urgente" (ou 0 se for "normal").
     * @param {number} taxa_extra - Taxa adicional fixa por peso excedente (R$ 15,00).
     * @param {number} valor_final - O valor final total da entrega (valor_total do pedido).
     * @param {string} status_entrega - Status inicial da entrega (e.g., "pendente").
     */
    criarNovaEntrega: async (id_pedido_fk, status_entrega = 'pendente') => {
        const connection = await pool.getConnection();

        const VALOR_KM = 10;
        const VALOR_KG = 20;
        const TAXA_PESO_EXTRA = 15;

        try {
            await connection.beginTransaction();

            // BUSCA OS DADOS DO PEDIDO
            const sqlBuscaPedido = `
            SELECT distancia_km, peso_kg, tipo_entrega 
            FROM pedidos 
            WHERE IdPedido = ?
        `;

            const [pedido] = await connection.query(sqlBuscaPedido, [id_pedido_fk]);

            if (pedido.length === 0) {
                throw new Error("Pedido informado não existe.");
            }

            const { distancia_km, peso_kg, tipo_entrega } = pedido[0];

            // contas
            const valor_distancia = distancia_km * VALOR_KM;
            const valor_peso = peso_kg * VALOR_KG;
            const valor_base = valor_distancia + valor_peso;

            const acrescimo = tipo_entrega === "urgente" ? valor_base * 0.20 : 0;

            let valor_final = valor_base + acrescimo;

            // desconto
            const desconto = valor_final > 500 ? valor_final * 0.10 : 0;

            valor_final -= desconto;

            // taxa extra
            const taxa_extra = peso_kg > 50 ? TAXA_PESO_EXTRA : 0;
            
            valor_final += taxa_extra;

            // INSERT
            const sqlInsert = `
            INSERT INTO entregas 
            (id_pedido_fk, valor_distancia, valor_peso, acrescimo, desconto, taxa_extra, valor_final, status_entrega)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `;

            const values = [
                id_pedido_fk,
                valor_distancia,
                valor_peso,
                acrescimo,
                desconto,
                taxa_extra,
                valor_final,
                status_entrega
            ];

            const [result] = await connection.query(sqlInsert, values);

            await connection.commit();

            return {
                id_entrega: result.insertId,
                id_pedido_fk,
                valor_distancia,
                valor_peso,
                acrescimo,
                desconto,
                taxa_extra,
                valor_final,
                status_entrega
            };

        } catch (error) {
            await connection.rollback();
            throw error;
        }
    },



    atualizaEntrega: async (idEntrega, status_entrega) => {
        const connection = await pool.getConnection();
        try {
            const sql = 'UPDATE entregas SET status_entrega = ? WHERE IDEntrega = ?';
            const values = [status_entrega, idEntrega];

            const [result] = await connection.query(sql, values);

            return {
                affectedRows: result.affectedRows,
                changedRows: result.changedRows
            };
        } catch (error) {
            throw error;
        } 
    },
/**
     * Remove uma entrega do banco de dados com base no ID informado.
     *
     * @async
     * @param {number} idEntrega - ID da entrega que será deletada.
     * 
     * @returns {Promise<object>} Retorna um objeto contendo:
     *  - affectedRows: número de registros excluídos (0 caso ID não exista).
     *
     * @throws Lança um erro caso a exclusão falhe no banco de dados.
     *
     * @example
     * const resultado = await entregaModel.deletaEntrega(3);
     * // retorno:
     * {
     *   affectedRows: 1
     * }
     *
     * // Caso a entrega não exista:
     * {
     *   affectedRows: 0
     * }
     */
    deletaEntrega: async (idEntrega) => {
        const connection = await pool.getConnection();
        try {
            const sql = 'DELETE FROM entregas WHERE IDEntrega = ?';
            const values = [idEntrega];
            const [result] = await connection.query(sql, values);

            return {
                affectedRows: result.affectedRows
            };
        } catch (error) {
            throw error;
        } 
    },
}

module.exports = { entregaModel };
