const express = require('express');
const router = express.Router();
const ongController = require('../controllers/ongController');

router.get('/', ongController.listarOngs);         
router.get('/:id', ongController.buscarOngPorId);   
router.post('/', ongController.criarOng);   
router.post('/login', ongController.login);       
router.put('/:id', ongController.atualizarOng);   
router.delete('/:id', ongController.deletarOng);

module.exports = router;