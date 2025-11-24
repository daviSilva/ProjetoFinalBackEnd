const pool = require('../config/db');

const entregaModel = {

    //mostrar todas as entregas
    /**
     * 
     * @returns {Promise<Array>} uma lista contendo todas as entregas registradas
     * * @example
 * chamada da função:
 * const entregas = await entregaModel.mostraTodasEntregas();
 * 
 * // Output esperado:
 * [
 *   {
 *     "id_entrega": 1,
 *     "id_pedido_fk": 10,
 *     "valor_distancia": 20.50,
 *     "valor_peso": 12.30,
 *     "acrescimo": 10.15,
 *     "taxa_extra": 15.00,
 *     "valor_final": 57.95,
 *     "status_entrega": "pendente"
 *   },
 *   {
 *     "id_entrega": 2,
 *     "id_pedido_fk": 11,
 *     "valor_distancia": 35.00,
 *     "valor_peso": 20.00,
 *     "acrescimo": 0,
 *     "taxa_extra": 15.00,
 *     "valor_final": 70.00,
 *     "status_entrega": "entregue"
 *   }
 * ]
 * 
 * Exemplo de saída no Insomnia:
 * [
 *   {
 *     "id_entrega": 1,
 *     "id_pedido_fk": 10,
 *     "valor_distancia": 20.50,
 *     "valor_peso": 12.30,
 *     "acrescimo": 10.15,
 *     "taxa_extra": 15,
 *     "valor_final": 57.95,
 *     "status_entrega": "pendente"
 *   }
 * ]
     */
    mostraTodasEntregas: async () => {
        const connection = await pool.getConnection();
        try {
            const sql = 'SELECT * FROM entregas';
            const [rows] = await connection.query(sql);
            connection.commit();
            return rows;
        } catch (error) {
            connection.rollback();
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
    criarNovaEntrega : async (id_pedido_fk, valor_distancia, valor_peso, acrescimo, taxa_extra, valor_final, status_entrega) => {
        const connection = await pool.getConnection();
        try {
            await connection.beginTransaction(); // Inicia a transação
            
            // Note: Ajustei o SQL para remover 'dnsPrefetchControl' e incluí o 'acrescimo' e 'taxa_extra' na ordem correta.
            const sql = `
                INSERT INTO entregas 
                (id_pedido_fk, valor_distancia, valor_peso, acrescimo, taxa_extra, valor_final, status_entrega) 
                VALUES (?, ?, ?, ?, ?, ?, ?)
            `;

            const values = [
                id_pedido_fk, 
                valor_distancia, 
                valor_peso, 
                acrescimo, 
                taxa_extra, 
                valor_final, 
                status_entrega || 'pendente' // Define 'pendente' como status padrão se não for fornecido
            ];
            
            const [rows] = await connection.query(sql, values);
            
            await connection.commit();
            return rows;
        } catch (error) {
            await connection.rollback();
            throw error;
        } 
    },

    atualizaEntrega: async (IDEntrega, status_entrega) => {
        const connection = await pool.getConnection();
        try {
            const sql = 'UPDATE entregas SET status_entrega = ? WHERE id_entrega = ?';
            const values = [status_entrega, IDEntrega];
            const [rows] = await connection.query(sql, values);
            connection.commit();
            return [rows];
        } catch (error) {
            connection.rollback();
            throw error;
        }
    },
}

module.exports = {entregaModel}; // Adicionei a exportação para o modelo ser utilizável