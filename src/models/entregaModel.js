const pool = require('../config/db');

const entregaModel = {

    //mostrar todas as entregas
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
    criarNovaEntrega : async (id_pedido_fk, valor_distancia, valor_peso, acrescimo, dnsPrefetchControl, taxa_extra, valor_final, status_entrega) => {
        const connection = await pool.getConnection();
        try {
        const sql = "INSERT INTO entregas (id_pedido_fk, valor_distancia, valor_peso, acrescimo, dnsPrefetchControl, taxa_extra, valor_final, status_entrega) VALUES (?, ?, ?, ?, ?, ?, ?, ?)";
        const values = [id_pedido_fk, ]        
        } catch (error) {
            
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