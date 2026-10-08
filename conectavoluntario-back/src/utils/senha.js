const bcrypt = require('bcryptjs');

const SALT_ROUNDS = 10;

// Um hash bcrypt sempre começa com $2a$, $2b$ ou $2y$
const jaEstaCriptografada = (senha) => /^\$2[aby]\$\d{2}\$/.test(senha || '');

// Hook de "pre save": criptografa a senha sempre que ela for criada ou alterada.
// Vale para qualquer caminho de cadastro (REST ou GraphQL), pois fica no model.
async function criptografarSenhaAntesDeSalvar() {
  if (!this.isModified('senha')) return;
  if (jaEstaCriptografada(this.senha)) return;
  this.senha = await bcrypt.hash(this.senha, SALT_ROUNDS);
}

// Confere a senha digitada com a senha salva no documento.
// Contas antigas, cadastradas antes da criptografia (senha em texto puro),
// são convertidas para hash no primeiro login correto.
async function conferirSenha(documento, senhaDigitada) {
  if (!documento || !documento.senha || typeof senhaDigitada !== 'string') return false;

  if (jaEstaCriptografada(documento.senha)) {
    return bcrypt.compare(senhaDigitada, documento.senha);
  }

  if (documento.senha !== senhaDigitada) return false;

  documento.senha = senhaDigitada;
  documento.markModified('senha');
  await documento.save({ validateModifiedOnly: true });
  return true;
}

// Nunca devolve a senha (nem o hash) nas respostas JSON da API.
function removerSenhaDoJson(doc, ret) {
  delete ret.senha;
  return ret;
}

module.exports = { criptografarSenhaAntesDeSalvar, conferirSenha, removerSenhaDoJson };
