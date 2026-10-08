const contaService = require('../services/contaService');

exports.loginVoluntario = async (req, res) => {
  const { email, senha } = req.body || {};
  const sessao = await contaService.autenticar('voluntario', email, senha);
  res.status(200).json({
    mensagem: 'Login realizado com sucesso!',
    token: sessao.token,
    voluntario: { id: sessao.id, nome: sessao.nome, email: sessao.email },
  });
};

exports.listarVoluntarios = async (req, res) => {
  res.status(200).json(await contaService.listarVoluntarios(req.usuario));
};

exports.buscarVoluntarioPorId = async (req, res) => {
  res.status(200).json(await contaService.buscarVoluntario(req.params.id, req.usuario));
};

exports.criarVoluntario = async (req, res) => {
  const voluntario = await contaService.cadastrarVoluntario(req.body);
  res.status(201).json({ mensagem: 'Voluntário cadastrado com sucesso!', voluntario });
};

exports.atualizarVoluntario = async (req, res) => {
  const voluntario = await contaService.atualizarVoluntario(req.params.id, req.body, req.usuario);
  res.status(200).json({ mensagem: 'Voluntário atualizado com sucesso!', voluntario });
};

exports.deletarVoluntario = async (req, res) => {
  await contaService.removerVoluntario(req.params.id, req.usuario);
  res.status(200).json({ mensagem: 'Voluntário removido com sucesso!' });
};
