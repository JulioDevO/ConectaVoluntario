// Regras de negócio de contas (ONG e Voluntário). Usado tanto pelo REST quanto pelo GraphQL.
const jwt = require('jsonwebtoken');
const { jwtSecret } = require('../config/env');
const Ong = require('../models/Ong');
const Voluntario = require('../models/Voluntario');
const Vaga = require('../models/Vaga');
const { conferirSenha } = require('../utils/senha');
const { ErroHttp } = require('../utils/erros');
const { exigirLogin, exigirDono } = require('../utils/permissoes');
const v = require('../utils/validacao');

const MODELS = { ong: Ong, voluntario: Voluntario };

// ---------- Auxiliares ----------

function nomeDaConta(tipo, conta) {
  return tipo === 'ong' ? conta.nomeFantasia : conta.nome;
}

function gerarSessao(tipo, conta) {
  const token = jwt.sign({ id: conta._id, tipo }, jwtSecret, { expiresIn: '1d' });
  return { token, tipo, id: String(conta._id), nome: nomeDaConta(tipo, conta), email: conta.email };
}

async function buscarOuFalhar(tipo, id) {
  const conta = await MODELS[tipo].findById(v.idValido(id)).select('-senha');
  if (!conta) throw new ErroHttp(404, tipo === 'ong' ? 'ONG não encontrada.' : 'Voluntário não encontrado.');
  return conta;
}

// Aplica só os campos permitidos (lista branca) e valida cada um.
function aplicarCampos(documento, campos) {
  Object.entries(campos).forEach(([campo, valor]) => {
    if (valor !== undefined) documento[campo] = valor;
  });
}

// ---------- Login ----------

async function autenticar(tipo, emailDigitado, senhaDigitada) {
  const emailLimpo = v.texto(emailDigitado, 'o e-mail', { max: 150 }).toLowerCase();
  if (typeof senhaDigitada !== 'string' || !senhaDigitada) throw new ErroHttp(400, 'Informe e-mail e senha.');

  // collation strength 2: ignora maiúsculas/minúsculas (contas antigas podem ter e-mail com maiúscula)
  const conta = await MODELS[tipo].findOne({ email: emailLimpo }).collation({ locale: 'en', strength: 2 });
  // Mesma resposta para "e-mail não existe" e "senha errada": ninguém descobre quais e-mails existem.
  if (!conta || !(await conferirSenha(conta, senhaDigitada))) {
    throw new ErroHttp(401, 'E-mail ou senha incorretos.');
  }
  return gerarSessao(tipo, conta);
}

// Login único: descobre sozinho se a conta é de ONG ou de voluntário.
async function autenticarQualquer(emailDigitado, senhaDigitada) {
  try {
    return await autenticar('ong', emailDigitado, senhaDigitada);
  } catch (error) {
    if (error.status !== 401) throw error;
    return autenticar('voluntario', emailDigitado, senhaDigitada);
  }
}

// ---------- Cadastro ----------

async function cadastrarVoluntario(dados = {}) {
  const voluntario = new Voluntario({
    nome: v.texto(dados.nome, 'o nome', { max: 120 }),
    email: v.email(dados.email),
    senha: v.senha(dados.senha),
    telefone: v.telefone(dados.telefone),
    causas: v.listaDeTextos(dados.causas, 'causas') || [],
  });
  await voluntario.save();
  return voluntario;
}

async function cadastrarOng(dados = {}) {
  const ong = new Ong({
    nomeFantasia: v.texto(dados.nomeFantasia, 'o nome fantasia', { max: 120 }),
    razaoSocial: v.texto(dados.razaoSocial, 'a razão social', { obrigatorio: false, max: 150 }),
    cnpj: v.cnpj(dados.cnpj),
    email: v.email(dados.email),
    senha: v.senha(dados.senha),
    cidade: v.texto(dados.cidade, 'a cidade', { obrigatorio: false, max: 100 }),
    descricao: v.texto(dados.descricao, 'a descrição', { obrigatorio: false, max: 1000 }),
  });
  await ong.save();
  return ong;
}

// ---------- Consulta ----------

async function listarOngs() {
  return Ong.find().select('-senha').sort({ nomeFantasia: 1 }).lean();
}

function buscarOng(id) {
  return buscarOuFalhar('ong', id);
}

// Dados de contato dos voluntários só interessam às ONGs.
async function listarVoluntarios(usuario) {
  exigirLogin(usuario, 'ong');
  return Voluntario.find().select('-senha').sort({ nome: 1 }).lean();
}

// Um voluntário vê o próprio perfil; ONGs podem consultar voluntários.
async function buscarVoluntario(id, usuario) {
  exigirLogin(usuario);
  if (usuario.tipo === 'voluntario') exigirDono(usuario, 'voluntario', id);
  return buscarOuFalhar('voluntario', id);
}

// ---------- Atualização ----------

async function atualizarVoluntario(id, dados = {}, usuario) {
  exigirDono(usuario, 'voluntario', v.idValido(id));
  const voluntario = await Voluntario.findById(id);
  if (!voluntario) throw new ErroHttp(404, 'Voluntário não encontrado.');

  aplicarCampos(voluntario, {
    nome: dados.nome !== undefined ? v.texto(dados.nome, 'o nome', { max: 120 }) : undefined,
    email: dados.email !== undefined ? v.email(dados.email) : undefined,
    senha: dados.senha !== undefined ? v.senha(dados.senha) : undefined,
    telefone: dados.telefone !== undefined ? v.telefone(dados.telefone) : undefined,
    causas: v.listaDeTextos(dados.causas, 'causas'),
  });
  await voluntario.save(); // o hook do model criptografa a senha se ela mudou
  return voluntario;
}

async function atualizarOng(id, dados = {}, usuario) {
  exigirDono(usuario, 'ong', v.idValido(id));
  const ong = await Ong.findById(id);
  if (!ong) throw new ErroHttp(404, 'ONG não encontrada.');

  aplicarCampos(ong, {
    nomeFantasia: dados.nomeFantasia !== undefined ? v.texto(dados.nomeFantasia, 'o nome fantasia', { max: 120 }) : undefined,
    razaoSocial: v.texto(dados.razaoSocial, 'a razão social', { obrigatorio: false, max: 150 }),
    email: dados.email !== undefined ? v.email(dados.email) : undefined,
    senha: dados.senha !== undefined ? v.senha(dados.senha) : undefined,
    cidade: v.texto(dados.cidade, 'a cidade', { obrigatorio: false, max: 100 }),
    descricao: v.texto(dados.descricao, 'a descrição', { obrigatorio: false, max: 1000 }),
  });
  await ong.save();
  return ong;
}

// ---------- Remoção ----------

async function removerVoluntario(id, usuario) {
  exigirDono(usuario, 'voluntario', v.idValido(id));
  const removido = await Voluntario.findByIdAndDelete(id).select('-senha');
  if (!removido) throw new ErroHttp(404, 'Voluntário não encontrado.');
  // Limpa as candidaturas dele nas vagas
  await Vaga.updateMany({ 'candidatos.voluntarioId': id }, { $pull: { candidatos: { voluntarioId: id } } });
  return removido;
}

async function removerOng(id, usuario) {
  exigirDono(usuario, 'ong', v.idValido(id));
  const removida = await Ong.findByIdAndDelete(id).select('-senha');
  if (!removida) throw new ErroHttp(404, 'ONG não encontrada.');
  // Uma ONG excluída não pode deixar vagas órfãs
  await Vaga.deleteMany({ ongId: id });
  return removida;
}

module.exports = {
  autenticar,
  autenticarQualquer,
  cadastrarVoluntario,
  cadastrarOng,
  listarOngs,
  buscarOng,
  listarVoluntarios,
  buscarVoluntario,
  atualizarVoluntario,
  atualizarOng,
  removerVoluntario,
  removerOng,
};
