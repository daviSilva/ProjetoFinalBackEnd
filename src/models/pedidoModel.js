const pool = require('../config/db'); // ajuste o caminho conforme seu projeto
const { atualizaCliente } = require('../controllers/clienteController');
const { atualizaPedido } = require('../controllers/pedidoController');

// Valores base fixos
const VALOR_BASE_KM = 10;
const VALOR_BASE_KG = 20;

const PedidoModel = {

    // Criar novo pedido
    criarPedido: async (
        id_cliente,
        data_pedido,
        tipo_entrega,
        distancia_km,
        peso_kg
    ) => {

        const connection = await pool.getConnection();

        try {
            await connection.beginTransaction();

            // Verifica se o cliente existe
            const sqlVerificaCliente = 'SELECT IDCliente FROM clientes WHERE IDCliente = ?';
            const [clienteExiste] = await connection.query(sqlVerificaCliente, [id_cliente]);

            if (clienteExiste.length === 0) {
                throw new Error("Cliente informado não existe.");
            }

            // -- CÁLCULOS DO PEDIDO 
            const valor_km = distancia_km * VALOR_BASE_KM;
            const valor_kg = peso_kg * VALOR_BASE_KG;

            let valor_total = valor_km + valor_kg;

            // Entrega urgente aumenta 30%
            if (tipo_entrega === "urgente") {
                valor_total *= 1.3;
            }
            // Inserir pedido
            const sql = `
                INSERT INTO pedidos
                (id_cliente_fk, data_pedido, tipo_entrega, distancia_km, peso_kg, valor_km, valor_kg, valor_total)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?)
            `;

            const values = [
                id_cliente,
                data_pedido,
                tipo_entrega,
                distancia_km,
                peso_kg,
                valor_km,
                valor_kg,
                valor_total
            ];

            const [rowsPedido] = await connection.query(sql, values);

            await connection.commit();

            return {
                id_pedido: rowsPedido.insertId,
                valor_total,
                valor_km,
                valor_kg
            };

        } catch (error) {
            await connection.rollback();
            throw error;

        } finally {
            connection.release();
        }
    },



    // Selecionar todos os pedidos
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
    },

    atualizaPedido : async (id_pedido, tipo_entrega, distancia_km, peso_kg) => {
        const connection = await pool.getConnection();

        try {
            await connection.beginTransaction();

            // -- CÁLCULOS DO PEDIDO 
            const valor_km = distancia_km * VALOR_BASE_KM;
            const valor_kg = peso_kg * VALOR_BASE_KG;

            let valor_total = valor_km + valor_kg;

            // Entrega urgente aumenta 30%
            if (tipo_entrega === "urgente") {
                valor_total *= 1.3;
            }

            const sql = `
                UPDATE pedidos
                SET tipo_entrega = ?, distancia_km = ?, peso_kg = ?, valor_km = ?, valor_kg = ?,  valor_total = ?
                WHERE IDpedido = ?
            `;

            const values = [
                tipo_entrega,
                distancia_km,
                peso_kg,
                valor_km,
                valor_kg,
                valor_total,
                id_pedido
            ];

            const [rows] = await connection.query(sql, values);
            await connection.commit();
            return rows;

        } catch (error) {
            await connection.rollback();
            throw error;
        }
    },

};

module.exports = PedidoModel;


