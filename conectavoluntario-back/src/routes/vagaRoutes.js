const express = require('express');
const router = express.Router();
const vagaController = require('../controllers/vagaController');
const { identificarUsuario, exigirAutenticacao } = require('../middlewares/auth');
const { asyncHandler } = require('../middlewares/erros');

// Públicas (se houver token, a resposta se adapta ao usuário: ex. "minhaCandidatura")
router.get('/', identificarUsuario, asyncHandler(vagaController.listarVagas));

// Precisa vir antes de '/:id'
router.get('/minhas-candidaturas', exigirAutenticacao('voluntario'), asyncHandler(vagaController.minhasCandidaturas));

router.get('/:id', identificarUsuario, asyncHandler(vagaController.buscarVagaPorId));

// Somente ONG (e dona da vaga, validado no service)
router.post('/', exigirAutenticacao('ong'), asyncHandler(vagaController.criarVaga));
router.put('/:id', exigirAutenticacao('ong'), asyncHandler(vagaController.atualizarVaga));
router.delete('/:id', exigirAutenticacao('ong'), asyncHandler(vagaController.deletarVaga));
router.get('/:id/candidaturas', exigirAutenticacao('ong'), asyncHandler(vagaController.listarCandidatos));
router.patch('/:id/candidaturas/:voluntarioId', exigirAutenticacao('ong'), asyncHandler(vagaController.atualizarStatusCandidatura));

// Somente voluntário
router.post('/:id/candidaturas', exigirAutenticacao('voluntario'), asyncHandler(vagaController.candidatar));
router.delete('/:id/candidaturas', exigirAutenticacao('voluntario'), asyncHandler(vagaController.cancelarCandidatura));

module.exports = router;
