const { query } = require('../config/db');
const {ClienteModel} = require('../models/clienteModel');

const ClienteController = {

    // Criar cliente
    criarCliente: async (req, res) => {
        try {
            const {
                nome_completo,
                cpf,
                email,
                logradouro,
                numero,
                bairro,
                cidade,
                estado,
                cep,
                telefones
            } = req.body;

            if (!nome_completo || !cpf || !email || !logradouro || !numero || !bairro || !cidade || !estado || !cep ||! telefones) {
                return res.status(400).json({ erro: "Todos os campos principais devem ser preenchidos." });};
 
            
            const cpfExistente = await ClienteModel.selecionarClientePorCpf(cpf);

            if (cpf == cpfExistente) {
                return res.status(409).json({ erro: "CPF já cadastrado no sistema." });}

            const resultado = await ClienteModel.criarCliente(
                nome_completo,
                cpf,
                email,
                logradouro,
                numero,
                bairro,
                cidade,
                estado,
                cep,
                telefones
            );

            return res.status(201).json({
                mensagem: "Cliente cadastrado com sucesso!",
                resultado
            });

        } catch (error) {
            return res.status(500).json({ erro: error.message });
        }
    },


    // Selecionar todos os clientes
    selecionaTodosClientes: async (req, res) => {
        try {
            const clientes = await ClienteModel.selecionaTodosClientes();
            if (clientes.length === 0) {
                return res.status(200).json({ mensagem: "lista de clientes vazia" });
            }
            return res.status(200).json(clientes);

        } catch (error) {
            return res.status(500).json({ erro: error.message });
        }
    },


    // Atualizar cliente
    atualizaCliente: async (req, res) => {
        try {
            const { id } = req.params;

            const {
                nome_completo,
                cpf,
                email,
                logradouro,
                numero,
                bairro,
                cidade,
                estado,
                cep
            } = req.body;

            if (!id) {
                return res.status(400).json({ erro: "ID do cliente é obrigatório." });
            }

            const resultado = await ClienteModel.atualizaCliente(
                id,
                nome_completo,
                cpf,
                email,
                logradouro,
                numero,
                bairro,
                cidade,
                estado,
                cep
            );

            return res.status(200).json({
                mensagem: "Cliente atualizado com sucesso!",
                resultado
            });

        } catch (error) {
            return res.status(500).json({ erro: error.message });
        }
    },

};

module.exports = ClienteController;
