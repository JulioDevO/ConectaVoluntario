// const Voluntario = require('../models/Voluntario');

exports.listarVoluntarios = async (req, res) => {
  try {
    // FUTURO: const voluntarios = await Voluntario.find();
    
    // POR ENQUANTO (Simulando a resposta do Mongoose):
    const voluntariosMock = [
      { _id: '1', nome: 'Voluntariado', email: 'voluntario@exemplo.com', causas: ['Educação'] }
    ];
    
    res.status(200).json(voluntariosMock);
  } catch (error) {
    res.status(500).json({ erro: 'Erro ao buscar voluntários' });
  }
};

exports.criarVoluntario = async (req, res) => {""
  try {
    const { nome, email, senha, causas } = req.body;

    // FUTURO: 
    // const novoVoluntario = new Voluntario({ nome, email, senha, causas });
    // await novoVoluntario.save();

    // POR ENQUANTO: Apenas confirmamos que a rota recebeu os dados
    res.status(201).json({ 
      mensagem: 'Voluntário criado com sucesso (Simulado)!',
      dadosRecebidos: { nome, email, causas }
    });
  } catch (error) {
    res.status(500).json({ erro: 'Erro ao criar voluntário' });
  }
};