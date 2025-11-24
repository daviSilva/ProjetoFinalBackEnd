const express = require('express');
const telefoneRoutes = express.Router();
const { telefoneController } = require('../controllers/telefoneController');

// Rota para criar um novo telefone
telefoneRoutes.post('/telefones', telefoneController.criarTelefone);
// Rota para atualizar um telefone existente
telefoneRoutes.put('/telefones', telefoneController.atualizaTelefone);
//rota para selecionar telefones cadastrados
telefoneRoutes.get('/telefones', telefoneController.selecionaTodosTelefones);
module.exports = { telefoneRoutes };