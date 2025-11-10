const express = require('express');
const clienteRoutes = express.Router();
const { clienteController } = require('../controllers/clienteController');


// Rota para obter todos os clientes
clienteRoutes.get('/clientes', clienteController.selecionaTodosClientesEID);
// Rota para obter um cliente por ID
//clienteRoutes.get('/clientes/id_cliente', clienteController.selecionaTodosClientesEID);

// Rota para incluir um novo cliente
clienteRoutes.post('/clientes', clienteController.inserirNovoCliente);
// Rota para alterar um cliente por ID
/*clienteRoutes.put('/clientes/:id_cliente', clienteController.alterarClientePorId);
// Rota para deletar um cliente por ID
clienteRoutes.delete('/clientes', clienteController.deletarClientePorId);
*/
module.exports = { clienteRoutes };