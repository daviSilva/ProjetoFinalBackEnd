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

    atualizaPedido: async (req, res) => {
        try {
            // Pega o ID do pedido na rota
            const { id_pedido } = req.params;
    
            // Dados enviados no corpo
            const {
                data_pedido,
                tipo_entrega,
                distancia_km,
                peso_kg
            } = req.body;
    
            // Validações básicas
            if (!data_pedido || !tipo_entrega || !distancia_km || !peso_kg) {
                return res.status(400).json({ erro: "Todos os campos devem ser preenchidos." });
            }
    
            if (!id_pedido || !Number.isInteger(Number(id_pedido))) {
                return res.status(400).json({ erro: "ID do pedido inválido." });
            }
    
            // Recalcular valores
            const valor_km = distancia_km * 10; // base 10
            const valor_kg = peso_kg * 20;      // base 20
            const valor_total = valor_km + valor_kg;
    
            // Atualizar no banco
            const resultado = await pedidoModel.atualizaPedido(
                id_pedido,
                data_pedido,
                tipo_entrega,
                distancia_km,
                peso_kg,
                valor_km,
                valor_kg,
                valor_total
            );
    
            return res.status(200).json({
                mensagem: "Pedido atualizado com sucesso!",
                resultado
            });
    
        } catch (error) {
            return res.status(500).json({
                erro: error.message || "Erro ao atualizar pedido."
            });
        }
    }
    
};

module.exports = pedidoController;
