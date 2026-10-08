const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { asyncHandler } = require('../middlewares/erros');
const { limitadorDeLogin } = require('../middlewares/limitadores');

router.post('/login', limitadorDeLogin, asyncHandler(authController.login));

module.exports = router;
