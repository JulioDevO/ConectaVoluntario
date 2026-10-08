const contaService = require('../services/contaService');

// POST /api/auth/login — serve para ONG e voluntário (descobre o tipo sozinho)
exports.login = async (req, res) => {
  const { email, senha } = req.body || {};
  const sessao = await contaService.autenticarQualquer(email, senha);
  res.status(200).json({ mensagem: 'Login realizado com sucesso!', ...sessao });
};
