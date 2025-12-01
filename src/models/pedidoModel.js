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
    /*** @param {number} id_cliente - ID do cliente relacionado ao pedido.
     * @param {string} data_pedido - Data em que o pedido foi realizado.
     * @param {string} tipo_entrega - "normal" ou "urgente".
     * @param {number} distancia_km - Distância percorrida em quilômetros.
     * @param {number} peso_kg - Peso da carga em quilos.
     * @returns {Promise<object>} retorna o ID do pedido e os valores calculados.
     * @example
     * entrada via JSON:
     * {
     *   "id_cliente": 1,
     *   "data_pedido": "2025-01-20",
     *   "tipo_entrega": "urgente",
     *   "distancia_km": 12,
     *   "peso_kg": 30
     * }
     *
     * chamada:
     * const novo = await PedidoModel.criarPedido(1, "2025-01-20", "urgente", 12, 30);
     * 
     * // Output esperado:
     * {
     *   "id_pedido": 15,
     *   "valor_total": 468,
     *   "valor_km": 120,
     *   "valor_kg": 600
     * }
     * 
     * Exemplo saída Insomnia:
     * {
     *   "id_pedido": 15,
     *   "valor_total": 468,
     *   "valor_km": 120,
     *   "valor_kg": 600
     * }
     */
     
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
            let valor_kg = peso_kg * VALOR_BASE_KG;
            
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
    /**
     * 
     * @returns  {Promise<Array>} lista contendo todos os pedidos.
     * 
     * @example
     * chamada:
     * const pedidos = await PedidoModel.selecionaTodosPedidos();
     * 
     * // Saída esperada:
     * [
     *   {
     *     "IDPedido": 1,
     *     "id_cliente_fk": 3,
     *     "data_pedido": "2025-01-20",
     *     "tipo_entrega": "normal",
     *     "distancia_km": 15,
     *     "peso_kg": 40,
     *     "valor_total": 350
     *   }
     * ]
     * 
     * Exemplo saída Insomnia:
     * [
     *   {
     *     "IDPedido": 1,
     *     "id_cliente_fk": 3,
     *     "data_pedido": "2025-01-20"
     *   }
     * ]
     */
     
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
    /**
     * 
     * @param {*} id - ID do pedido
     * {Promise<object|null>} retorna o pedido encontrado ou null.
     * 
     * @returns {Promise<object|null>} retorna o pedido encontrado ou null.
     * 
     * @example
     * chamada:
     * const pedido = await PedidoModel.selecionaPedidoPorId(5);
     * 
     * // Output esperado:
     * {
     *   "IDPedido": 5,
     *   "tipo_entrega": "urgente",
     *   "valor_total": 780
     * }
     * 
     * Saída Insomnia:
     * {
     *   "IDPedido": 5,
     *   "valor_total": 780
     * }
     */
   
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
    /**
     * @param {number} id_pedido - ID do pedido a ser atualizado.
     * @param {string} tipo_entrega - Tipo de entrega ("normal" ou "urgente").
     * @param {number} distancia_km - Nova distância percorrida.
     * @param {number} peso_kg - Novo peso da carga.
     * 
     * @returns {Promise<object>} resultado da atualização.
     * 
     * @example
     * chamada:
     * const atualizado = await PedidoModel.atualizaPedido(3, "urgente", 40, 70);
     *
     * // Output esperado:
     * {
     *   "affectedRows": 1,
     *   "changedRows": 1
     * }
     *
     * Exemplo saída Insomnia:
     * {
     *   "message": "Pedido atualizado com sucesso!",
     *   "resultado": { "affectedRows": 1 }
     * }
     */
    
    atualizaPedido : async (id_pedido, tipo_entrega, distancia_km, peso_kg) => {
    const connection = await pool.getConnection();

    // Constantes fixas
    const VALOR_BASE_KM = 10;
    const VALOR_BASE_KG = 20;
    const TAXA_PESO_EXTRA = 15;

    try {
        await connection.beginTransaction();

        // ---- CÁLCULOS ----
        const valor_km = distancia_km * VALOR_BASE_KM;
        let valor_kg = peso_kg * VALOR_BASE_KG;
        let valor_total = valor_km + valor_kg;

        // acréscimo para urgente
        if (tipo_entrega === "urgente") {
            valor_total *= 1.30;
        }

        // taxa extra se peso > 50 (aplica ao valor_kg e ao total)
        let taxa_extra = 0;
        if (peso_kg > 50) {
            taxa_extra = TAXA_PESO_EXTRA;
            valor_kg += taxa_extra;
            valor_total += taxa_extra;
        }

        // desconto se > 500 (10%)
        let desconto = 0;
        if (valor_total > 500) {
            desconto = valor_total * 0.10;
            valor_total -= desconto;
        }
 
        const sql = `
            UPDATE pedidos
            SET tipo_entrega = ?, 
                distancia_km = ?, 
                peso_kg = ?, 
                valor_km = ?, 
                valor_kg = ?,  
                valor_total = ?
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
    } finally {
        connection.release();
    }
},
/**
 * Deleta um pedido do banco de dados usando o ID informado.
 *
 * @param {number} id_pedido  ID do pedido que será deletado
 * @returns Retorna o resultado da operação do MySQL (ex: affectedRows)
 */
    DeletaPedido: async (id_pedido) => {
        const connection = await pool.getConnection();
        try {
            const sql = 'DELETE FROM pedidos WHERE IDPedido = ?';
            const values = [id_pedido];
            const [result] = await connection.query(sql, values);
            connection.commit();
            return result;
        } catch (error) {
            connection.rollback();
            throw error;
        }
    }
 
};

module.exports = PedidoModel;


