const jwt = require('jsonwebtoken');
const { jwtSecret } = require('../config/env');
const { ErroHttp } = require('../utils/erros');
const { exigirLogin } = require('../utils/permissoes');

// Lê o header "Authorization: Bearer <token>" e devolve { id, tipo } ou null.
// Não lança erro: quem decide se o login é obrigatório é a rota/resolver.
function lerUsuario(req) {
  const header = req.headers.authorization || '';
  if (!header.startsWith('Bearer ')) return null;

  try {
    const { id, tipo } = jwt.verify(header.slice(7), jwtSecret);
    return { id, tipo };
  } catch {
    return null;
  }
}

// Middleware: carrega req.usuario quando há token válido (rotas públicas que se adaptam ao usuário).
function identificarUsuario(req, res, next) {
  req.usuario = lerUsuario(req);
  next();
}

// Middleware: exige login (e, opcionalmente, o tipo da conta).
// Uso: router.post('/', exigirAutenticacao('ong'), controller)
const exigirAutenticacao = (...tipos) => (req, res, next) => {
  const temToken = (req.headers.authorization || '').startsWith('Bearer ');
  req.usuario = lerUsuario(req);

  try {
    if (!req.usuario && temToken) throw new ErroHttp(401, 'Token inválido ou expirado.');
    exigirLogin(req.usuario, ...tipos);
    next();
  } catch (error) {
    next(error);
  }
};

module.exports = { lerUsuario, identificarUsuario, exigirAutenticacao };
