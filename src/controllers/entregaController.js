const { query } = require('../config/db');
const { entregaModel } = require('../models/entregaModel');


const entregaController = {

   mostraTodasEntregas: async (req, res) => {
    try {
        const entregas = await entregaModel.mostraTodasEntregas();

        if (entregas.length === 0) {
            return res.status(200).json({ mensagem: "Nenhuma entrega encontrada." });
        }

        return res.status(200).json(entregas);

    } catch (error) {
        return res.status(500).json({
            erro: "Erro ao listar entregas.",
            detalhes: error.message
        });
    }
},


criaNovaEntrega: async (req, res) => {
    try {
        const { id_pedido_fk, status_entrega } = req.body;

        if (!id_pedido_fk) {
            return res.status(400).json({
                erro: "O campo id_pedido_fk é obrigatório."
            });
        }

        const resultado = await entregaModel.criarNovaEntrega(
            id_pedido_fk,
            status_entrega || 'pendente'
        );

        return res.status(201).json({
            mensagem: "Entrega criada com sucesso!",
            entrega: resultado
        });

    } catch (error) {
        return res.status(500).json({
            erro: "Erro interno no servidor.",
            detalhes: error.message
        });
    }
},



    atualizaEntrega: async (req, res) => {
    try {
        const { id } = req.query;  // <-- CORRIGIDO
        const { status_entrega } = req.body;

        if (!id || !status_entrega) {
            return res.status(400).json({ erro: "ID da entrega e novo status devem ser fornecidos." });
        }

        const resultado = await entregaModel.atualizaEntrega(id, status_entrega);

        return res.status(200).json({
            mensagem: "Status da entrega atualizado com sucesso!",
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

    deletaEntrga : async (req,res) => {
        
        try {
            const { id } = req.query.id;
            if (!id || isNaN(id)){
                return res.status(400).json({ erro: "ID da entrega deve ser fornecido e ser um número válido." });
            }
            const resultado = await entregaModel.deletaEntrega(id);
            
        } catch (error) {
            console.error(error);
            return res.status(500).json({
                message: "Erro no servidor.",
                erro: error.message
            });
        }
    }
}

module.exports = { entregaController };