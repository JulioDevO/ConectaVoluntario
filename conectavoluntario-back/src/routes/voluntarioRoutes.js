const express = require('express');
const router = express.Router();
const voluntarioController = require('../controllers/voluntarioController');
const { exigirAutenticacao } = require('../middlewares/auth');
const { asyncHandler } = require('../middlewares/erros');
const { limitadorDeLogin } = require('../middlewares/limitadores');

// Públicas
router.post('/', asyncHandler(voluntarioController.criarVoluntario));
router.post('/login', limitadorDeLogin, asyncHandler(voluntarioController.loginVoluntario));

// Autenticadas (as regras de "quem pode o quê" ficam no service)
router.get('/', exigirAutenticacao('ong'), asyncHandler(voluntarioController.listarVoluntarios));
router.get('/:id', exigirAutenticacao(), asyncHandler(voluntarioController.buscarVoluntarioPorId));
router.put('/:id', exigirAutenticacao('voluntario'), asyncHandler(voluntarioController.atualizarVoluntario));
router.delete('/:id', exigirAutenticacao('voluntario'), asyncHandler(voluntarioController.deletarVoluntario));

module.exports = router;
