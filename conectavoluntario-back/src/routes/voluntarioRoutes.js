const express = require('express');
const router = express.Router();
const voluntarioController = require('../controllers/voluntarioController');

router.get('/', voluntarioController.listarVoluntarios);
router.post('/', voluntarioController.criarVoluntario);

module.exports = router;