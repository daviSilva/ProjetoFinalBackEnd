const { query } = require('../config/db');
const { entregaModel } = require('../models/clienteModel');


const entrgaController = {

    mostraTodasEntregas: async (req, res) => {
        try {
            const entregas = await entregaModel.mostraTodasEntregas();
            if (entregas.length === 0) {
                return res.status(200).json({ mensagem: "Nenhuma entrega listada." });
            }
        } catch (error) {
            return res.status(500).json({ erro: error.message });

        }

    },

    criaNovaEntrega: async (req, res) => {
        try {
            const {
                id_pedido_fk,
                valor_distancia,
                valor_peso,
                acrescimo,
                taxa_extra,
                valor_final,
                status_entrega
            } = req.body;
            if (!id_pedido_fk || valor_distancia == null || valor_peso == null || acrescimo == null || taxa_extra == null || valor_final == null) {
                return res.status(400).json({ erro: "Todos os campos principais devem ser preenchidos." });
            }
            const resultado = await entregaModel.criarNovaEntrega(
                id_pedido_fk,
                valor_distancia,
                valor_peso,
                acrescimo,
                taxa_extra,
                valor_final,
                status_entrega
            );
            return res.status(201).json({
                mensagem: "Entrega criada com sucesso!",
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
}

