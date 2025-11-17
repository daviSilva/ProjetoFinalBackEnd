const pool = require('../config/db'); // ajuste o caminho conforme seu projeto

const PedidoModel = {

    // Criar novo pedido
    criarPedido: async (
        id_cliente,
        data_pedido,
        tipo_entrega,
        distancia_km,
        peso_kg,
        valor_km,
        valor_kg
    ) => {

        const connection = await pool.getConnection();

        try {
            await connection.beginTransaction();

            // Verificar se o cliente existe
            const sqlVerificaCliente = 'SELECT IDCliente FROM clientes WHERE IDCliente = ?';
            const [clienteExiste] = await connection.query(sqlVerificaCliente, [id_cliente]);

            if (clienteExiste.length === 0) {
                throw new Error("Cliente informado não existe.");
            }

            // Inserir pedido
            const sql = `
                INSERT INTO pedidos
                (id_cliente_fk, data_pedido, tipo_entrega, distancia_km, peso_kg, valor_km, valor_kg)
                VALUES (?, ?, ?, ?, ?, ?, ?)
            `;

            const values = [
                id_cliente,
                data_pedido,
                tipo_entrega,
                distancia_km,
                peso_kg,
                valor_km,
                valor_kg
            ];

            const [rowsPedido] = await connection.query(sql, values);

            await connection.commit();
            return rowsPedido;

        } catch (error) {
            await connection.rollback();
            throw error;

        }
    },


    // Seleciona todos os pedidos
    selecionaTodosPedidos: async () => {
        const connection = await pool.getConnection();

        try {
            const sql = 'SELECT * FROM pedidos';
            const [rows] = await connection.query(sql);
            return rows;

        } catch (error) {
            throw error;

        } finally {
            connection.release();
        }
    },

    // Selecionar pedido por ID
    selecionaPedidoPorId: async (id) => {
        const connection = await pool.getConnection();

        try {
            const sql = 'SELECT * FROM pedidos WHERE IDPedido = ?';
            const [rows] = await connection.query(sql, [id]);
            return rows.length > 0 ? rows[0] : null;

        } catch (error) {
            throw error;

        } finally {
            connection.release();
        }
    }

};

module.exports = PedidoModel;
