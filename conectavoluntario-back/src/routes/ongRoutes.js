const express = require('express');
const router = express.Router();
const ongController = require('../controllers/ongController');

router.get('/', ongController.listarOngs);
router.post('/', ongController.criarOng);

module.exports = router;