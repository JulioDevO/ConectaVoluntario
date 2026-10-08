// Erro "esperado" da aplicação: carrega o status HTTP e uma mensagem segura para o cliente.
class ErroHttp extends Error {
  constructor(status, mensagem) {
    super(mensagem);
    this.status = status;
  }
}

// Converte qualquer erro (Mongoose, bug inesperado) em um ErroHttp.
// Assim REST e GraphQL respondem do mesmo jeito e nunca vazam detalhes internos.
function normalizarErro(error) {
  if (error instanceof ErroHttp) return error;

  if (error.name === 'ValidationError') {
    const mensagens = Object.values(error.errors).map((e) => e.message);
    return new ErroHttp(400, mensagens.join(' '));
  }

  if (error.name === 'CastError') {
    return new ErroHttp(400, 'Identificador inválido.');
  }

  if (error.code === 11000) {
    const campo = Object.keys(error.keyValue || {})[0] || 'registro';
    return new ErroHttp(409, `Já existe um cadastro com este ${campo}.`);
  }

  console.error('Erro inesperado:', error);
  return new ErroHttp(500, 'Erro interno no servidor.');
}

module.exports = { ErroHttp, normalizarErro };
