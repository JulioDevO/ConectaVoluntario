const rateLimit = require('express-rate-limit');

// Freia tentativa de adivinhar senha: 30 tentativas de login a cada 15 minutos por IP.
const limitadorDeLogin = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 30,
  standardHeaders: true,
  legacyHeaders: false,
  message: { erro: 'Muitas tentativas de login. Tente novamente em alguns minutos.' },
});

module.exports = { limitadorDeLogin };
