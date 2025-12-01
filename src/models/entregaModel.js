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
    criarNovaEntrega: async (
        id_cliente,
        data_pedido,
        tipo_entrega,
        distancia_km,
        peso_kg,
        valor_base_km,
        valor_base_kg
    ) => {
        const connection = await pool.getConnection();

        try {
            await connection.beginTransaction();

            // Inserir pedido
            const sqlPedido = `
            INSERT INTO pedidos (id_cliente_fk, data_pedido, tipo_entrega, distancia_km, peso_kg)
            VALUES (?, ?, ?, ?, ?)
        `;
            const [pedidoResult] = await connection.execute(sqlPedido, [
                id_cliente,
                data_pedido,
                tipo_entrega,
                distancia_km,
                peso_kg
            ]);

            const id_pedido = pedidoResult.insertId;

            // -----------------------------
            // CALCULOS
            // -----------------------------
            const valorDistancia = distancia_km * valor_base_km;
            const valorPeso = peso_kg * valor_base_kg;

            let acrescimo = 0;
            let desconto = 0;
            let taxaExtra = 0;

            if (tipo_entrega === "urgente") {
                acrescimo = (valorDistancia + valorPeso) * 0.20; // +20% se urgente
            }

            if (peso_kg > 100) {
                taxaExtra = 50; // carga pesada
            }

            if (distancia_km > 200) {
                desconto = (valorDistancia + valorPeso) * 0.10; // desconto longo percurso
            }

            const valorFinal = valorDistancia + valorPeso + acrescimo + taxaExtra - desconto;

            // Inserir valores calculados na tabela de entregas
            const sqlEntrega = `
            INSERT INTO entregas 
            (id_pedido_fk, valor_distancia, valor_peso, acrescimo, desconto, taxa_extra, valor_final, status_entrega)
            VALUES (?, ?, ?, ?, ?, ?, ?, 'calculado')
        `;

            await connection.execute(sqlEntrega, [
                id_pedido,
                valorDistancia,
                valorPeso,
                acrescimo,
                desconto,
                taxaExtra,
                valorFinal
            ]);

            await connection.commit();

            return {
                mensagem: "Entrega cadastrada com sucesso!",
                id_pedido,
                valores_base: {
                    valor_base_km,
                    valor_base_kg
                },
                calculos: {
                    valorDistancia,
                    valorPeso,
                    acrescimo,
                    desconto,
                    taxaExtra,
                    valorFinal
                }
            };

        } catch (error) {
            await connection.rollback();
            console.error(error);
            throw error;
        } finally {
            connection.release();
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

    selecionaClientePorId : async (id_cliente) => {
        const connection = await pool.getConnection();
        try {
            const sql = 'SELECT * FROM entregas WHERE id_cliente_fk = ?';
            const [rows] = await connection.query(sql, [id_cliente]);
            return rows;
        } catch (error) {
            throw error;
        }
    },

    selecionaEntregasPorCliente: async (id_cliente) => {
        const connection = await pool.getConnection();
        try {
            const sql = `
                SELECT e.*
                FROM entregas e
                JOIN pedidos p ON e.id_pedido_fk = p.IDPedido
                WHERE p.id_cliente_fk = ?
            `;
            const [rows] = await connection.query(sql, [id_cliente]);
            return rows;
        } catch (error) {
            throw error;
        }}
}

module.exports = { entregaModel };
