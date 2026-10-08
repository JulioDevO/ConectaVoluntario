// Regras de negócio de vagas e candidaturas. Usado tanto pelo REST quanto pelo GraphQL.
const Vaga = require('../models/Vaga');
const { FORMATOS, STATUS_VAGA, STATUS_INSCRICAO } = require('../models/Vaga');
const { ErroHttp } = require('../utils/erros');
const { exigirLogin } = require('../utils/permissoes');
const v = require('../utils/validacao');

const mesmoId = (a, b) => String(a) === String(b);

// ---------- Auxiliares ----------

// Monta a resposta de acordo com quem está olhando:
//  - todos veem o total de candidatos;
//  - a ONG dona da vaga vê a lista completa de candidatos;
//  - o voluntário vê apenas a própria candidatura (minhaCandidatura).
function paraResposta(vaga, usuario) {
  const dados = vaga.toObject ? vaga.toObject() : { ...vaga };
  const candidatos = dados.candidatos || [];
  const ehDona = usuario?.tipo === 'ong' && mesmoId(dados.ongId, usuario.id);

  delete dados.__v;
  delete dados.candidatos;
  dados.totalCandidatos = candidatos.length;
  if (ehDona) dados.candidatos = candidatos;
  if (usuario?.tipo === 'voluntario') {
    dados.minhaCandidatura = candidatos.find((c) => mesmoId(c.voluntarioId, usuario.id)) || null;
  }
  return dados;
}

async function buscarDocumento(id) {
  const vaga = await Vaga.findById(v.idValido(id));
  if (!vaga) throw new ErroHttp(404, 'Vaga não encontrada.');
  return vaga;
}

// Garante que a vaga pertence à ONG logada.
async function buscarVagaDaOng(id, usuario) {
  exigirLogin(usuario, 'ong');
  const vaga = await buscarDocumento(id);
  if (!mesmoId(vaga.ongId, usuario.id)) {
    throw new ErroHttp(403, 'Esta vaga pertence a outra instituição.');
  }
  return vaga;
}

function camposDaVaga(dados, { parcial }) {
  const obrigatorio = !parcial;
  const campos = {
    titulo: v.texto(dados.titulo, 'o título', { obrigatorio, max: 120 }),
    descricao: v.texto(dados.descricao, 'a descrição', { obrigatorio, max: 2000 }),
    localizacao: v.texto(dados.localizacao, 'a localização', { obrigatorio, max: 120 }),
    horario: v.texto(dados.horario, 'o horário', { obrigatorio, max: 120 }),
    formato: dados.formato === undefined && parcial ? undefined : v.opcao(dados.formato, FORMATOS, 'Formato'),
    status: dados.status === undefined ? undefined : v.opcao(dados.status, STATUS_VAGA, 'Status'),
  };
  return campos;
}

// ---------- Consulta ----------

async function listarVagas(usuario) {
  const vagas = await Vaga.find().sort({ dataCriacao: -1 }).lean();
  return vagas.map((vaga) => paraResposta(vaga, usuario));
}

async function buscarVaga(id, usuario) {
  return paraResposta(await buscarDocumento(id), usuario);
}

// Vagas nas quais o voluntário logado se candidatou
async function minhasCandidaturas(usuario) {
  exigirLogin(usuario, 'voluntario');
  const vagas = await Vaga.find({ 'candidatos.voluntarioId': usuario.id }).sort({ dataCriacao: -1 }).lean();
  return vagas.map((vaga) => paraResposta(vaga, usuario));
}

// ---------- CRUD da vaga (somente ONG dona) ----------

async function criarVaga(dados = {}, usuario) {
  exigirLogin(usuario, 'ong');
  // O dono da vaga vem do token, nunca do corpo da requisição.
  const vaga = new Vaga({ ...camposDaVaga(dados, { parcial: false }), ongId: usuario.id });
  await vaga.save();
  return paraResposta(vaga, usuario);
}

async function atualizarVaga(id, dados = {}, usuario) {
  const vaga = await buscarVagaDaOng(id, usuario);
  Object.entries(camposDaVaga(dados, { parcial: true })).forEach(([campo, valor]) => {
    if (valor !== undefined) vaga[campo] = valor;
  });
  await vaga.save();
  return paraResposta(vaga, usuario);
}

async function removerVaga(id, usuario) {
  const vaga = await buscarVagaDaOng(id, usuario);
  await vaga.deleteOne();
  return paraResposta(vaga, usuario);
}

// ---------- Candidaturas ----------

async function candidatar(vagaId, usuario) {
  exigirLogin(usuario, 'voluntario');
  v.idValido(vagaId);

  // Operação atômica: só entra se a vaga estiver aberta e o voluntário ainda não estiver na lista.
  const vaga = await Vaga.findOneAndUpdate(
    { _id: vagaId, status: 'Aberta', 'candidatos.voluntarioId': { $ne: usuario.id } },
    { $push: { candidatos: { voluntarioId: usuario.id } } },
    { new: true }
  );
  if (vaga) return paraResposta(vaga, usuario);

  // Não entrou: descobre o motivo para responder com clareza.
  const existente = await buscarDocumento(vagaId);
  if (existente.status !== 'Aberta') throw new ErroHttp(409, 'Esta vaga não está recebendo inscrições.');
  throw new ErroHttp(409, 'Você já se candidatou a esta vaga.');
}

async function cancelarCandidatura(vagaId, usuario) {
  exigirLogin(usuario, 'voluntario');
  const vaga = await Vaga.findOneAndUpdate(
    { _id: v.idValido(vagaId), 'candidatos.voluntarioId': usuario.id },
    { $pull: { candidatos: { voluntarioId: usuario.id } } },
    { new: true }
  );
  if (!vaga) {
    await buscarDocumento(vagaId); // 404 se a vaga não existe
    throw new ErroHttp(404, 'Você não possui candidatura nesta vaga.');
  }
  return paraResposta(vaga, usuario);
}

// Lista de candidatos com os dados de contato (somente a ONG dona da vaga).
async function listarCandidatos(vagaId, usuario) {
  const vaga = await buscarVagaDaOng(vagaId, usuario);
  await vaga.populate('candidatos.voluntarioId', 'nome email telefone causas');
  return vaga.candidatos.map((c) => ({
    voluntario: c.voluntarioId,
    voluntarioId: c.voluntarioId?._id,
    statusInscricao: c.statusInscricao,
    dataAplicacao: c.dataAplicacao,
  }));
}

// ONG dona aprova ou recusa um candidato.
async function atualizarStatusCandidatura(vagaId, voluntarioId, status, usuario) {
  const vaga = await buscarVagaDaOng(vagaId, usuario);
  v.opcao(status, STATUS_INSCRICAO, 'Status da inscrição');

  const candidato = vaga.candidatos.find((c) => mesmoId(c.voluntarioId, v.idValido(voluntarioId)));
  if (!candidato) throw new ErroHttp(404, 'Candidatura não encontrada nesta vaga.');

  candidato.statusInscricao = status;
  await vaga.save();
  return paraResposta(vaga, usuario);
}

module.exports = {
  listarVagas,
  buscarVaga,
  minhasCandidaturas,
  criarVaga,
  atualizarVaga,
  removerVaga,
  candidatar,
  cancelarCandidatura,
  listarCandidatos,
  atualizarStatusCandidatura,
};
