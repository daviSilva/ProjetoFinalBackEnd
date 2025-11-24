const { query } = require('../config/db');
const { telefoneModel } = require('../models/telefoneModel');

const telefoneController = {
    /**
     * função para criar um novo telefone
     * @param {Parameters} req 
     * @param {Parameters} res 
     * @returns <promise<object>} objeto com os dados do telefone criado
     * @example
     * entrada de dados via json
     * {
     *  "id_cliente_fk": 1,
     * "numero_telefone": "11999999999",
     * }
     * chamada da função
     * POST /telefones
     * // Output:
     * {
     *  "mensagem": "Telefone cadastrado com sucesso!",
     * "resultado": {
     *   "id_telefone": 1,
     *  "id_cliente_fk": 1,
     * }
     */
    criarTelefone: async (req, res) => {
        try {
            const { id_cliente_fk, numero_telefone,} = req.body;

            if (!id_cliente_fk || !numero_telefone ) {
                return res.status(400).json({ erro: "Todos os campos devem ser preenchidos." });
            }

            const resultado = await telefoneModel.adicionarTelefone(
                id_cliente_fk,
                numero_telefone,
    
            );

            return res.status(201).json({
                mensagem: "Telefone cadastrado com sucesso!",
                resultado
            });
        } catch (error) {
            return res.status(500).json({
                erro: "Erro ao cadastrar telefone.",
                detalhes: error.message
            });
        }
    },

    /**
     * função para atualizar um telefone
     * @param {Parameters} req parametro de requisição com os dados do telefone a ser atualizado
     * @param {Parameters} res parametro de resposta da requisição
     * @returns <promise<object>} objeto com os dados atualizados do telefone
     * @example
     * entrada de dados via json
     * {
     * "numero_telefone": "11988888888",
     * }
     * chamada da função para o telefone de id 1
     * PUT /telefones?id=1
     * // Output:
     * {
     * "mensagem": "Número de telefone atualizado com sucesso!",
     * "resultado": {
     *  "affectedRows": 1,
     * "changedRows": 1
     * }
     * 
     */
    atualizaTelefone: async (req, res) => {
        try {
            const { id } = req.query;
            const { numero_telefone } = req.body;
            if (!id || !numero_telefone) {
                return res.status(400).json({ erro: "ID do telefone e número  devem ser fornecidos." });
            }
            const resultado = await telefoneModel.atualizaTelefone(id, numero_telefone);
            return res.status(200).json({
                mensagem: "Número de telefone atualizado com sucesso!",
                resultado
            });



        } catch (error) {
            return res.status(500).json({
                erro: "Erro ao cadastrar telefone.",
                detalhes: error.message
            });
        }
    },
    /**
     * função para selecionar todos os telefones
     * @param {Parameters} req parametro de requisição 
     * @param {Parameters} res parametro de resposta da requisição
     * @returns /<promise<object[]>} array de objetos com os dados dos telefones
     * @example
     * chamada da função:
     * GET /telefones
     * // Output esperado:
     * [
     * {
     * "IDTelefone": 1,
     * "id_cliente_fk": 2,
     * "telefone": "11999999999"
     * },
     * {
     * "IDTelefone": 2,
     * "id_cliente_fk": 3,
     * "telefone": "11888888888"
     * }
     * ]
     * 
     */
    selecionaTodosTelefones: async (req, res) => {
        try {
            const telefones = await telefoneModel.selecionaTodosTelefones();
            if (telefones.length === 0) {
                return res.status(200).json({ mensagem: "Nenhum telefone listado." });
            }
            return res.status(200).json(telefones);
        } catch (error) {
            return res.status(500).json({
                erro: "Erro ao buscar telefones.",
                detalhes: error.message
            });
        }
    }
}
module.exports = { telefoneController };