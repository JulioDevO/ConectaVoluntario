// Valida as variáveis de ambiente logo na inicialização.
// Se alguma obrigatória faltar, o servidor nem sobe (melhor do que quebrar no meio da apresentação).
const obrigatorias = ['MONGO_URI', 'JWT_SECRET'];
const faltando = obrigatorias.filter((nome) => !process.env[nome]);

if (faltando.length > 0) {
  throw new Error(`❌ Variáveis ausentes no .env: ${faltando.join(', ')} (veja o arquivo .env.example)`);
}

module.exports = {
  mongoUri: process.env.MONGO_URI,
  jwtSecret: process.env.JWT_SECRET,
  port: process.env.PORT || 3000,
  // Origens permitidas no CORS, separadas por vírgula. Vazio = qualquer origem (apenas para desenvolvimento).
  corsOrigins: (process.env.CORS_ORIGIN || '').split(',').map((o) => o.trim()).filter(Boolean),
};
