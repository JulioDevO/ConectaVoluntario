// src/config/env.js
if (!process.env.JWT_SECRET) {
  throw new Error('❌ JWT_SECRET não definida no .env — configure antes de iniciar a aplicação');
}

module.exports = {
  jwtSecret: process.env.JWT_SECRET,
};