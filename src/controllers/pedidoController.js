const pedidoModel = require('../models/pedidoModel');

const pedidoController = {

    // Criar pedido
    criaPedido: async (req, res) => {
        try {
            const {
                id_cliente,
                data_pedido,
                tipo_entrega,
                distancia_km,
                peso_kg
            } = req.body;

            // validação
            if (!id_cliente || !data_pedido || !tipo_entrega || !distancia_km || !peso_kg) {
                return res.status(400).json({ erro: "Todos os campos devem ser preenchidos." });
            }

            if (tipo_entrega !== "normal" && tipo_entrega !== "urgente") {
                return res.status(400).json({ erro: "O tipo de entrega deve ser 'normal' ou 'urgente'." });
            }

            // verificar se o pedido já existe para este cliente
            const pedidoExistente = await pedidoModel.selecionaPedidoPorId(id_cliente);
            if (pedidoExistente) {
                return res.status(409).json({ erro: "Pedido já cadastrado para este cliente." });
            }

            // salvar
            const resultado = await pedidoModel.criarPedido(
                id_cliente,
                data_pedido,
                tipo_entrega,
                distancia_km,
                peso_kg
            );

            return res.status(201).json({
                mensagem: "Pedido cadastrado com sucesso!",
                resultado
            });

        } catch (error) {
            console.error(error);
            return res.status(500).json({
                message: "Erro no servidor.",
                erro: error.message
            });
        }
    },

    // Selecionar todos
    selecionaTodosPedidos: async (req, res) => {
        try {
            const pedidos = await pedidoModel.selecionaTodosPedidos();
            return res.status(200).json(pedidos);

        } catch (erro) {
            return res.status(500).json({
                erro: erro.message || "Erro ao buscar pedidos."
            });
        }
    },

    //atualizar pedido
    /**
     * função para atualizar um pedido existente
     * @param {*} req 
     * @param {*} res 
     * @returns <promise<object>} objeto com os dados atualizados do pedido
     * @example
     * entrada de dados via json
     * {
     *   "id_cliente": 1,
     *  "data_pedido": "2024-06-15",
     *  "tipo_entrega": "urgente",
     *  "distancia_km": 50,
     *  "peso_kg": 10
     * }
     * chamada da função para o pedido de id 1
     * PUT /pedidos/1
     * // Output:
     * {
     *   "mensagem": "Pedido atualizado com sucesso!",
     *  "resultado": {
     *    "id_pedido": 1,
     *   "id_cliente": 1,
     *   "data_pedido": "2024-06-15",
     *   "tipo_entrega": "urgente",
     *  "distancia_km": 50,
     *  "peso_kg": 10,
     *   "valor_km": 100,
     *  "valor_kg": 50,
     *  "valor_total": 195
     * }
     */
    atualizaPedido: async (req, res) => {
        try {
            const { id } = req.query.id_pedido;
            const {
                id_cliente,
                data_pedido,
                tipo_entrega,
                distancia_km,
                peso_kg
            } = req.body;

            if (!id) {
                return res.status(400).json({ erro: "ID do pedido é obrigatório." });
            }
            if (!id_cliente || !data_pedido || !tipo_entrega || !distancia_km || !peso_kg) {
                return res.status(400).json({ erro: "Todos os campos devem ser preenchidos." });
            }
            const resultado = await pedidoModel.atualizaPedido(
                id,
                id_cliente,
                data_pedido,
                tipo_entrega,
                distancia_km,
                peso_kg
            );
            return res.status(200).json({
                mensagem: "Pedido atualizado com sucesso!",
                resultado
            });
        } catch (error) {
            console.error(error);
            return res.status(500).json({
                message: "Erro no servidor.",
                erro: error.message
            });
        }
    }

};

module.exports = pedidoController;
