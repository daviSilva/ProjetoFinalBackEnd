const { ClienteModel } = require('../models/clienteModel');
const pedidoModel = require('../models/pedidoModel');

const pedidoController = {

   /**
    * 
    * Criar um novo pedido no sistema.
     * Valida os dados enviados, verifica duplicidade e salva no banco
    */
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
    /**
     * 
     * @param {*} req 
     * @param {*} res 
     * @returns <promise<object>> lista de todos os pedidos cadastrados no sistema
     * @example
     * chamada da função
     * GET /pedidos
     * // Output:
     * [
     *   {
     *    "id_pedido": 1,
     *   "id_cliente_fk": 1,
     *   "data_pedido": "2024-06-15",
     *   "tipo_entrega": "urgente",
     *   "distancia_km": 50,
     *   "peso_kg": 10,
     *   "valor_km": 100,
     *  "valor_kg": 50,
     *  "valor_total": 195
     *  },
     *  {
     *   "id_pedido": 2,
     *  "id_cliente_fk": 2,
     *  "data_pedido": "2024-06-16",
     *  "tipo_entrega": "normal",
     *  "distancia_km": 30,
     *  "peso_kg": 5,
     *  "valor_km": 60,
     *  "valor_kg": 25,
     *  "valor_total": 85
     * }
     * ]
     */
    selecionaTodosPedidos: async (req, res) => {
        try {
            const pedidos = await pedidoModel.selecionaTodosPedidos();
            // puxar o nome do cliente junto
            const pedidosComCliente = await Promise.all(pedidos.map(async (pedido) => {
                const cliente = await ClienteModel.selecionerClientePorId(pedido.id_cliente_fk);
                return {
                    ...pedido,
                    cliente_nome: cliente ? cliente.nome : null
                };
            }));
            return res.status(200).json(pedidosComCliente);
        } catch (erro) {
            return res.status(500).json({
                erro: erro.message || "Erro ao buscar pedidos."
            });
        }
    },

    //atualizar pedido
    /**
     * função para atualizar um pedido existente
     * @param {Request} req Parametro de requisição com os dados do pedido a ser atualizado
     * @param {Response} res Paramerto de resposta da requisição 
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
        const { id_pedido } = req.query;

        const {
            tipo_entrega,
            distancia_km,
            peso_kg
        } = req.body;

        if (!id_pedido) {
            return res.status(400).json({ erro: "ID do pedido é obrigatório." });
        }

        if (!tipo_entrega || distancia_km == null || peso_kg == null) {
            return res.status(400).json({ erro: "Todos os campos devem ser preenchidos." });
        }

        const resultado = await pedidoModel.atualizaPedido(
            id_pedido,
            tipo_entrega,
            distancia_km,
            peso_kg
        );

        return res.status(200).json({
            mensagem: "Pedido atualizado com sucesso!",
            resultado
        });

    } catch (error) {
        return res.status(500).json({
            message: "Erro no servidor.",
            erro: error.message
        });
    }
},
/**
 * Deleta um pedido com base no ID recebido pela URL.
 * Antes de deletar, verifica se o pedido realmente existe.
 *
 * @param {*} req  Objeto da requisição contendo os parâmetros da rota
 * @param {*} res  Objeto de resposta HTTP
 * @returns Resposta JSON informando sucesso ou erro
 */
    deletarPedido: async (req, res) => {
        try {
            const { id } = req.params;

            if (!id) {
                return res.status(400).json({ erro: "ID do pedido é obrigatório." });
            }
            const pedidoExistente = await pedidoModel.selecionaPedidoPorId(id);
            if (!pedidoExistente) {
                return res.status(404).json({ erro: "Pedido não encontrado." });
            }
        
            const resultado = await pedidoModel.DeletaPedido(id);
            return res.status(200).json({
                mensagem: "Pedido deletado com sucesso!",
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
