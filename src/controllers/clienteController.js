const {query} =  require('../config/db');
const {clienteModel} = require('../models/clienteModel');
const clienteController = {
    selecionaTodosClienteseID: async (req, res) => {
    try {
        const id_cliente = req.query.id_cliente; // vem da query string
        // Se não tiver ID → busca todos os clientes
        if (!id_cliente) {
            const resultado = await clienteModel.selecionaTodosClientes();

            if (!resultado || resultado.length === 0) {
                return res.status(200).json({ message: 'A lista de clientes está vazia' });
            }

            return res.status(200).json({ message: 'Resultado dos dados listados', resultado });
        }
        // Se tiver ID → valida e busca cliente específico
        const id = Number(id_cliente);
        if (isNaN(id) || id <= 0) {
            return res.status(400).json({ message: 'Parâmetro id_cliente inválido' });
        }
        const resultado = await clienteModel.SelectionaClientePorId(id);
        if (!resultado) {
            return res.status(404).json({ message: 'Cliente não encontrado' });
        }
        return res.status(200).json({ message: 'Cliente encontrado', resultado });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Erro no servidor', messageError: error });
    }
},
}

module.exports = {clienteController}