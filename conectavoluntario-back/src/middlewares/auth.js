// src/middlewares/auth.js
const jwt = require('jsonwebtoken');
const { jwtSecret } = require('../config/env'); // Usa o secret validado

function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ erro: 'Acesso negado. Token não fornecido.' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const payload = jwt.verify(token, jwtSecret);
    req.usuario = payload; // Salva os dados do usuário para o Controller poder usar
    next(); // Passa pela catraca e vai para a rota
  } catch (err) {
    return res.status(401).json({ erro: 'Token inválido ou expirado.' });
  }
}

module.exports = authMiddleware;