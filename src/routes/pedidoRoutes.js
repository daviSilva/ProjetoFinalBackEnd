const express = require('express');
const pedidoRoutes = express.Router();
const  pedidoController  = require('../controllers/pedidoController');

// Rota para obter todos os pedidos
pedidoRoutes.get('/pedidos', pedidoController.selecionaTodosPedidos);

//rota para criar pedido
pedidoRoutes.post('/pedidos', pedidoController.criaPedido);

//rota para atualizar pedido 
pedidoRoutes.put('/pedidos/', pedidoController.atualizaPedido);

pedidoRoutes.delete('/pedidos/:id', pedidoController.deletaPedido);
module.exports = { pedidoRoutes };