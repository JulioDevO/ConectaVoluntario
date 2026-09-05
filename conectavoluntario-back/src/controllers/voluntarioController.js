const Voluntario = require('../models/Voluntario');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Login
exports.loginVoluntario = async (req, res) => {
  try {
    const { email, senha } = req.body;
    if (!email || !senha) return res.status(400).json({ erro: 'Informe e-mail e senha.' });

    const voluntario = await Voluntario.findOne({ email });
    if (!voluntario) return res.status(404).json({ erro: 'Usuário não encontrado.' });

    const senhaValida = await bcrypt.compare(senha, voluntario.senha);
    if (!senhaValida) return res.status(401).json({ erro: 'Credenciais inválidas.' });

    const token = jwt.sign(
      { id: voluntario._id, email: voluntario.email },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    return res.status(200).json({ mensagem: 'Login realizado com sucesso!', token });
  } catch (error) {
    return res.status(500).json({ erro: 'Erro ao realizar login', detalhes: error.message });
  }
};

// CRUD
exports.listarVoluntarios = async (req, res) => {
  const voluntarios = await Voluntario.find();
  res.status(200).json(voluntarios);
};

exports.buscarVoluntarioPorId = async (req, res) => {
  const voluntario = await Voluntario.findById(req.params.id);
  res.status(200).json(voluntario);
};

exports.criarVoluntario = async (req, res) => {
  const novoVoluntario = new Voluntario(req.body);
  await novoVoluntario.save();
  res.status(201).json(novoVoluntario);
};

exports.atualizarVoluntario = async (req, res) => {
  const voluntario = await Voluntario.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.status(200).json(voluntario);
};

exports.deletarVoluntario = async (req, res) => {
  await Voluntario.findByIdAndDelete(req.params.id);
  res.status(200).json({ mensagem: 'Removido com sucesso' });
};