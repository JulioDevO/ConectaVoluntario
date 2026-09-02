// const Ong = require('../models/Ong');

exports.listarOngs = async (req, res) => {
  try {
    // FUTURO: const ongs = await Ong.find();
    
    const ongsMock = [
      { _id: '101', nomeFantasia: 'Instituto Educar', cnpj: '12.345.678/0001-90', email: 'contato@institutoeducar.org' }
    ];
    
    res.status(200).json(ongsMock);
  } catch (error) {
    res.status(500).json({ erro: 'Erro ao buscar ONGs' });
  }
};

exports.criarOng = async (req, res) => {
  try {
    const { nomeFantasia, cnpj, email, senha, descricao } = req.body;

    // FUTURO: 
    // const novaOng = new Ong({ nomeFantasia, cnpj, email, senha, descricao });
    // await novaOng.save();

    res.status(201).json({ 
      mensagem: 'ONG cadastrada com sucesso (Simulado)!',
      dadosRecebidos: { nomeFantasia, cnpj, email }
    });
  } catch (error) {
    res.status(500).json({ erro: 'Erro ao cadastrar ONG' });
  }
};