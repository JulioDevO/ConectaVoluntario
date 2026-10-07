const express = require('express');
const router = express.Router();
const vagaController = require('../controllers/vagaController');
const authMiddleware = require('../middlewares/auth'); // importa segurança


router.get('/', vagaController.listarVagas);
router.post('/', authMiddleware, vagaController.criarVaga)

module.exports = router;