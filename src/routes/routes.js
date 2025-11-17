const express = require('express');
const router = express.Router();
//const { produtoRoutes } = require('./produtosRoutes');
const { clienteRoutes } = require('./clienteRoutes');

//router.use('/', produtoRoutes);
router.use('/', clienteRoutes);

module.exports = { router };