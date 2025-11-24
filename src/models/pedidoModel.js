const pool = require('../config/db');



/*Caso o tipo de entrega seja "urgente", aplica-se um acréscimo de 20% sobre o valor base. Se o tipo de entrega for "normal", nenhum acréscimo é aplicado.
• O valor final da entrega é o resultado da soma entre o valor base e o acréscimo (caso aplicável).
• Caso o valor final seja superior a R$ 500,00, aplicar um desconto de 10% sobre o valor final.
• Caso o peso da carga ultrapasse 50 kg, adicionar uma taxa fixa adicional de R$ 15,00 ao valor final.*/
// Valores base fixos para calculos
const VALOR_BASE_KM = 10;
const VALOR_BASE_KG = 20;
const VALOR_PESO_TAXA = 15; // taxa fixa adicional para peso acima de 50kg

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
            // Taxa adicional para peso acima de 50kg
            if (peso_kg > 50) {
                valor_kg += VALOR_PESO_TAXA;
            }
            if (valor_total > 500) {
                valor_total *= 0.9; // Aplica desconto de 10%
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

    // valores fixos
    const VALOR_BASE_KM = 10;
    const VALOR_BASE_KG = 20;
    const VALOR_PESO_TAXA = 15;

    try {
        await connection.beginTransaction();

        // cálculos
        let valor_km = distancia_km * VALOR_BASE_KM;
        let valor_kg = peso_kg * VALOR_BASE_KG;

        let valor_total = valor_km + valor_kg;
        let taxa_extra = 0;

        // urgente → +20%
        if (tipo_entrega === "urgente") {
            valor_total *= 1.20;
        }

        // peso > 50kg → taxa extra
        if (peso_kg > 50) {
            taxa_extra = VALOR_PESO_TAXA;
            valor_total += taxa_extra;
        }

        // se valor_total > 500 → desconto
        let desconto = 0;
        if (valor_total > 500) {
            desconto = valor_total * 0.10;
            valor_total -= desconto;
        }

        const sql = `
            UPDATE pedidos
            SET tipo_entrega = ?, distancia_km = ?, peso_kg = ?, valor_km = ?, valor_kg = ?  , valor_total = ?
            WHERE IDPedido = ?
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


