const express = require('express');
const router = express.Router();
const vagaController = require('../controllers/vagaController');

router.get('/', vagaController.listarVagas);
router.post('/', vagaController.criarVaga);

module.exports = router;