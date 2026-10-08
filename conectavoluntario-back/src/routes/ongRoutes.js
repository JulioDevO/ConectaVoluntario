const express = require('express');
const router = express.Router();
const ongController = require('../controllers/ongController');
const { exigirAutenticacao } = require('../middlewares/auth');
const { asyncHandler } = require('../middlewares/erros');
const { limitadorDeLogin } = require('../middlewares/limitadores');

// Públicas
router.post('/', asyncHandler(ongController.criarOng));
router.post('/login', limitadorDeLogin, asyncHandler(ongController.login));
router.get('/', asyncHandler(ongController.listarOngs));
router.get('/:id', asyncHandler(ongController.buscarOngPorId));

// Somente a própria ONG
router.put('/:id', exigirAutenticacao('ong'), asyncHandler(ongController.atualizarOng));
router.delete('/:id', exigirAutenticacao('ong'), asyncHandler(ongController.deletarOng));

module.exports = router;
