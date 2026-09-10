const Vaga = require('../models/Vaga');

exports.listarVagas = async (req, res) => {
  try {
    const vagas = await Vaga.find();
    res.status(200).json(vagas);
  } catch (error) {
    res.status(500).json({ erro: 'Erro ao buscar vagas', detalhe: error.message });
  }
};

exports.criarVaga = async (req, res) => {
  try {
    const { titulo, descricao, formato, localizacao, horario, ongId } = req.body;

    const novaVaga = new Vaga({
      titulo,
      descricao,
      formato,
      localizacao,
      horario,
      ongId
    });

    await novaVaga.save();

    res.status(201).json({
      mensagem: 'Vaga publicada com sucesso no banco de dados!',
      vaga: novaVaga
    });
  } catch (error) {
    res.status(400).json({ erro: 'Erro ao criar vaga', detalhe: error.message });
  }
};