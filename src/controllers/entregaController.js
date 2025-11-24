const { query } = require('../config/db');
const { entregaModel } = require('../models/entregaModel');

/**
 * /**
     * @function mostraTodasEntregas
     * 
     * @description
     * Controlador responsável por listar todas as entregas cadastradas no sistema.
     * - Chama o model para consultar todos os registros.
     * - Retorna uma mensagem caso não existam entregas cadastradas.
     * 
     * @param {Object} req - Requisição HTTP.
     * @param {Object} res - Resposta HTTP enviada ao cliente.
     * 
     * @returns {JSON} Lista de entregas ou mensagem informativa.
     */
 
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

/**
 * 
 *  @function criaNovaEntrega
     * 
     * @description
     * Controlador para criar uma nova entrega vinculada a um pedido.
     * - Valida se o ID do pedido foi enviado.
     * - Define status padrão como 'pendente' caso não seja informado.
     * - Chama o model responsável pela inserção da entrega no banco.
     * 
     * @param {Object} req - Requisição contendo id_pedido_fk e status_entrega.
     * @param {Object} res - Resposta enviada ao cliente.
     * 
     * @returns {JSON} Mensagem de sucesso e dados da entrega criada.
     */
 
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


/**
 *  * @function atualizaEntrega
     * 
     * @description
     * Controlador responsável por atualizar o status de uma entrega específica.
     * - Valida se o ID da entrega e o novo status foram enviados.
     * - Chama o model para atualizar o registro.
     * 
     * @param {Object} req - Requisição contendo ID da entrega via query e novo status via body.
     * @param {Object} res - Resposta enviada ao cliente.
     * 
     * @returns {JSON} Mensagem de sucesso e resultado da atualização.
     */
 
    atualizaEntrega: async (req, res) => {
    try {
        const { id } = req.query;

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

    /**
     * @function deletaEntrga
     * 
     * @description
     * Controlador responsável por excluir uma entrega do sistema.
     * - Valida se o ID foi informado e se é numérico.
     * - Chama o model para remover o registro.
     * 
     * @param {Object} req - Requisição contendo o ID da entrega a ser apagada.
     * @param {Object} res - Resposta enviada ao cliente.
     * 
     * @returns {JSON} Mensagem de sucesso ou erro.
     */
     
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