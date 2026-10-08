const mongoose = require('mongoose');
const { ErroHttp } = require('./erros');

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Garante que o valor é texto (barra objetos do tipo { $ne: null }) e devolve já aparado.
function texto(valor, rotulo, { obrigatorio = true, max = 500 } = {}) {
  if (valor === undefined || valor === null || valor === '') {
    if (obrigatorio) throw new ErroHttp(400, `Informe ${rotulo}.`);
    return undefined;
  }
  if (typeof valor !== 'string') throw new ErroHttp(400, `Valor inválido para ${rotulo}.`);
  const limpo = valor.trim();
  if (obrigatorio && !limpo) throw new ErroHttp(400, `Informe ${rotulo}.`);
  if (limpo.length > max) throw new ErroHttp(400, `${rotulo} deve ter no máximo ${max} caracteres.`);
  return limpo;
}

function email(valor) {
  const limpo = texto(valor, 'o e-mail', { max: 150 }).toLowerCase();
  if (!EMAIL_REGEX.test(limpo)) throw new ErroHttp(400, 'E-mail inválido.');
  return limpo;
}

function senha(valor) {
  if (typeof valor !== 'string' || valor.length < 6) {
    throw new ErroHttp(400, 'A senha deve ter pelo menos 6 caracteres.');
  }
  if (valor.length > 100) throw new ErroHttp(400, 'A senha deve ter no máximo 100 caracteres.');
  return valor;
}

function telefone(valor) {
  const limpo = texto(valor, 'o telefone', { max: 30 });
  const digitos = limpo.replace(/\D/g, '');
  if (digitos.length < 10 || digitos.length > 13) {
    throw new ErroHttp(400, 'Telefone inválido. Use DDD + número.');
  }
  return limpo;
}

function cnpj(valor) {
  const digitos = texto(valor, 'o CNPJ', { max: 30 }).replace(/\D/g, '');
  if (digitos.length !== 14) throw new ErroHttp(400, 'CNPJ inválido. Deve ter 14 dígitos.');
  return digitos;
}

function listaDeTextos(valor, rotulo) {
  if (valor === undefined || valor === null) return undefined;
  if (!Array.isArray(valor)) throw new ErroHttp(400, `Valor inválido para ${rotulo}.`);
  return valor.map((item) => texto(item, rotulo, { max: 60 }));
}

function opcao(valor, permitidos, rotulo) {
  if (!permitidos.includes(valor)) {
    throw new ErroHttp(400, `${rotulo} inválido. Use: ${permitidos.join(', ')}.`);
  }
  return valor;
}

function idValido(id) {
  if (!mongoose.isValidObjectId(id)) throw new ErroHttp(400, 'Identificador inválido.');
  return String(id);
}

module.exports = { texto, email, senha, telefone, cnpj, listaDeTextos, opcao, idValido };
