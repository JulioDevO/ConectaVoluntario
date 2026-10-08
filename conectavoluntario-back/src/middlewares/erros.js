const { ErroHttp, normalizarErro } = require('../utils/erros');

// Evita try/catch repetido: erros de funções async caem no middleware de erro.
const asyncHandler = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);

function rotaNaoEncontrada(req, res, next) {
  next(new ErroHttp(404, 'Rota não encontrada.'));
}

// eslint-disable-next-line no-unused-vars
function tratarErros(error, req, res, next) {
  // JSON malformado no corpo da requisição
  if (error.type === 'entity.parse.failed') {
    return res.status(400).json({ erro: 'JSON inválido no corpo da requisição.' });
  }
  const erro = normalizarErro(error);
  res.status(erro.status).json({ erro: erro.message });
}

module.exports = { asyncHandler, rotaNaoEncontrada, tratarErros };
