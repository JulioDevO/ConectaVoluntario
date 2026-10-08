const vagaService = require('../services/vagaService');

exports.listarVagas = async (req, res) => {
  res.status(200).json(await vagaService.listarVagas(req.usuario));
};

exports.buscarVagaPorId = async (req, res) => {
  res.status(200).json(await vagaService.buscarVaga(req.params.id, req.usuario));
};

exports.minhasCandidaturas = async (req, res) => {
  res.status(200).json(await vagaService.minhasCandidaturas(req.usuario));
};

exports.criarVaga = async (req, res) => {
  const vaga = await vagaService.criarVaga(req.body, req.usuario);
  res.status(201).json({ mensagem: 'Vaga publicada com sucesso!', vaga });
};

exports.atualizarVaga = async (req, res) => {
  const vaga = await vagaService.atualizarVaga(req.params.id, req.body, req.usuario);
  res.status(200).json({ mensagem: 'Vaga atualizada com sucesso!', vaga });
};

exports.deletarVaga = async (req, res) => {
  await vagaService.removerVaga(req.params.id, req.usuario);
  res.status(200).json({ mensagem: 'Vaga removida com sucesso!' });
};

exports.candidatar = async (req, res) => {
  const vaga = await vagaService.candidatar(req.params.id, req.usuario);
  res.status(201).json({ mensagem: 'Candidatura enviada com sucesso!', vaga });
};

exports.cancelarCandidatura = async (req, res) => {
  const vaga = await vagaService.cancelarCandidatura(req.params.id, req.usuario);
  res.status(200).json({ mensagem: 'Candidatura cancelada.', vaga });
};

exports.listarCandidatos = async (req, res) => {
  res.status(200).json(await vagaService.listarCandidatos(req.params.id, req.usuario));
};

exports.atualizarStatusCandidatura = async (req, res) => {
  const { status } = req.body || {};
  const vaga = await vagaService.atualizarStatusCandidatura(
    req.params.id, req.params.voluntarioId, status, req.usuario
  );
  res.status(200).json({ mensagem: 'Status da candidatura atualizado.', vaga });
};
