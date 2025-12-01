const express = require('express');
const clienteRoutes = express.Router();
const  clienteController  = require('../controllers/clienteController');


// Rota para obter todos os clientes
clienteRoutes.get('/clientes', clienteController.selecionaTodosClientes);


// Rota para incluir um novo cliente
clienteRoutes.post('/clientes', clienteController.criarCliente);
//rota para atualizar telefone
clienteRoutes.put('/clientes/atualizatelefone', clienteController.atualizaTelefone)
//rota para atualizar cliente
clienteRoutes.put('/clientes/atualizacliente/:id', clienteController.atualizaCliente)

clienteRoutes.delete('/clientes/deletarcliente/:id', clienteController.DeleteCliente)

module.exports = { clienteRoutes };