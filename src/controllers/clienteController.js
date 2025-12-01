const { query } = require('../config/db');
const {ClienteModel} = require('../models/clienteModel');
const { telefoneModel } = require('../models/telefoneModel');

const ClienteController = {

    // Criar cliente
    /**
     * 
     *   * Controller responsável por criar um novo cliente no sistema.
     * 
     * - Valida se todos os campos obrigatórios foram enviados.
     * - Verifica se o CPF já está cadastrado.
     * - Chama o Model para inserir o cliente e seus telefones.
     *
     * @param {Object} req - Objeto da requisição HTTP contendo os dados do cliente.
     * @param {Object} res - Objeto de resposta para retornar o status e mensagens.
     */

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
    /**
     * Controller responsável por buscar todos os clientes cadastrados no sistema.
     *
     * - Caso não haja clientes, retorna mensagem informativa.
     * - Caso existam, retorna a lista completa.
     * 
     * @param {Object} req - Requisição enviada pelo cliente.
     * @param {Object} res - Resposta enviada pelo servidor.
     */
     
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
    /**
     * Controller responsável por atualizar os dados de um cliente existente.
     *
     * - Valida se o ID foi enviado.
     * - Atualiza todos os dados recebidos.
     *
     * @param {Object} req - Requisição contendo os dados e o ID do cliente.
     * @param {Object} res - Resposta com o status da operação.
     */
    
    atualizaCliente: async (req, res) => {
    try {
        const id = req.params.id; // ← CORRETO

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


    //ATUALIZAR TELEFONE
    /**
     *  Controller responsável por atualizar o número de telefone de um cliente.
     *
     * - Valida se o ID do telefone foi enviado.
     * - Verifica formato do número.
     * - Chama o Model para realizar atualização.
     *
     * @param {Object} req - Requisição contendo id do telefone e novo número.
     * @param {Object} res - Resposta com o status e dados atualizados.
     */
    
    atualizaTelefone: async (req, res) => {
        try {
            const {id_telefone} = req.query.id_telefone;
            const {novo_numero} = req.body;

            if (!id_telefone || !novo_numero || novo_numero.trim() === '' || novo_numero.length < 8 || novo_numero.length > 15) {
                return res.status(400).json({ erro: "ID do telefone e novo número são obrigatórios. O número deve ter entre 8 e 15 caracteres." });
            }
            const resultado = await telefoneModel.atualizaTelefone(id_telefone, novo_numero);
            
            return res.status(200).json({
                message : "Telefone atualizado com sucesso!",
                data : resultado
            })
            
        } catch (error) {
            console.error ("Erro ao atualizar telefone:", error)
            return res.status(500).json({ erro: error.message });
        }
    },

   // Deletar Cliente
    /**
     * Função responsável por deletar um cliente do sistema.
     * 
     * @param {Request} req  Objeto da requisição contendo o ID do cliente nos parâmetros da rota.
     * @param {Response} res Objeto de resposta usado para retornar mensagens e status HTTP.
     * 
     * @returns {Promise<Response>} Retorna uma resposta JSON informando o sucesso ou erro da operação.
     * 
     * @example
     * // Chamada da rota:
     * DELETE /clientes/5
     * 
     * // Resposta esperada:
     * {
     *   "message": "Cliente deletado com sucesso!",
     *   "data": { ... }
     * }
     */
     
    DeleteCliente: async (req,res) => {
        try {
            const id_cliente = req.params.id;
            if (!id_cliente || id_cliente.trim() === '') {
                return res.status(400).json({ erro: "ID do cliente é obrigatório." });
            }
            //se o cliente ja foi deletado, dar mensagem de erro.
            const clienteExistente = await ClienteModel.selecionerClientePorId(id_cliente);
            if (!clienteExistente) {
                return res.status(404).json({ erro: "Cliente não encontrado ou já deletado." });
            }
            //se o status da entrega nao estiver em entregue, nao deixar deletar o cliente
            if (clienteExistente.status_entrega !== 'entregue') {
                return res.status(400).json({ erro: "Não é possível deletar o cliente. Existem entregas pendentes ou em andamento." });
            }
            const resultado = await ClienteModel.deleteCliente(id_cliente);
            return res.status(200).json({
                message: "Cliente deletado com sucesso!",
                data: resultado
            });
        } catch (error) {
            console.error("Erro ao deletar cliente:", error);
            return res.status(500).json({ erro: error.message });
        }
        
    }

};

module.exports = ClienteController;
