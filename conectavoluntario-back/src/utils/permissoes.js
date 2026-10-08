const { ErroHttp } = require('./erros');

// Exige usuário autenticado e, opcionalmente, de um dos tipos informados ('ong' | 'voluntario').
function exigirLogin(usuario, ...tipos) {
  if (!usuario) throw new ErroHttp(401, 'Acesso negado. Faça login para continuar.');
  if (tipos.length > 0 && !tipos.includes(usuario.tipo)) {
    throw new ErroHttp(403, 'Seu perfil não tem permissão para esta ação.');
  }
  return usuario;
}

// Exige que o usuário logado seja o próprio dono da conta.
function exigirDono(usuario, tipo, id) {
  exigirLogin(usuario, tipo);
  if (String(usuario.id) !== String(id)) {
    throw new ErroHttp(403, 'Você só pode alterar a sua própria conta.');
  }
  return usuario;
}

module.exports = { exigirLogin, exigirDono };
