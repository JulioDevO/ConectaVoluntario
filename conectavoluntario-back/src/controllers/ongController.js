const contaService = require('../services/contaService');

exports.listarOngs = async (req, res) => {
  res.status(200).json(await contaService.listarOngs());
};

exports.buscarOngPorId = async (req, res) => {
  res.status(200).json(await contaService.buscarOng(req.params.id));
};

exports.criarOng = async (req, res) => {
  const ong = await contaService.cadastrarOng(req.body);
  res.status(201).json({ mensagem: 'ONG cadastrada com sucesso!', ong });
};

exports.login = async (req, res) => {
  const { email, senha } = req.body || {};
  const sessao = await contaService.autenticar('ong', email, senha);
  res.status(200).json({
    mensagem: 'Login realizado com sucesso!',
    token: sessao.token,
    ong: { id: sessao.id, nomeFantasia: sessao.nome, email: sessao.email },
  });
};

exports.atualizarOng = async (req, res) => {
  const ong = await contaService.atualizarOng(req.params.id, req.body, req.usuario);
  res.status(200).json({ mensagem: 'ONG atualizada com sucesso!', ong });
};

exports.deletarOng = async (req, res) => {
  await contaService.removerOng(req.params.id, req.usuario);
  res.status(200).json({ mensagem: 'ONG removida com sucesso!' });
};
