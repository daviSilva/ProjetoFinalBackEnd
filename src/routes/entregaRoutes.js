const express = require('express');
const entregaRoutes = express.Router();
const { entregaController } = require('../controllers/entregaController');

// Rota listar todas as entregas
entregaRoutes.get('/entregas', entregaController.mostraTodasEntregas);

// Rota para criar uma entrega
entregaRoutes.post('/entregas', entregaController.criaNovaEntrega);

//ROTA PARA ATUALIZAR O STATUS DA ENTREGA
entregaRoutes.put('/entregas', entregaController.atualizaEntrega);

module.exports = { entregaRoutes };
