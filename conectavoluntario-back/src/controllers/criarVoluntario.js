const Voluntario = require('../models/Voluntario');

exports.criarVoluntario = async (req, res) => {
  try {
    const { nome, email, senha, causas } = req.body;

    if (!nome || !email || !senha) {
      return res.status(400).json({ 
        erro: 'Por favor, preencha os campos obrigatórios: nome, email e senha.' 
      });
    }

    const novoVoluntario = new Voluntario({
      nome,
      email,
      senha,
      causas
    });

    await novoVoluntario.save();

    return res.status(201).json({
      mensagem: 'Voluntário cadastrado com sucesso!',
      voluntario: novoVoluntario
    });

  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ 
        erro: 'O e-mail informado já está cadastrado no sistema.' 
      });
    }

    return res.status(500).json({ 
      erro: 'Erro ao cadastrar voluntário', 
      detalhes: error.message 
    });
  }
};