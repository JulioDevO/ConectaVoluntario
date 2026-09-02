// const Vaga = require('../models/Vaga');

exports.listarVagas = async (req, res) => {
  try {
    const vagasMock = [
      { 
        _id: '501', 
        titulo: 'Professor(a) de Matemática', 
        formato: 'Presencial',
        localizacao: 'São Paulo, SP',
        ongId: '101' // ID do Instituto Educar
      },
      { 
        _id: '502', 
        titulo: 'Mentor(a) de Carreira', 
        formato: 'Remoto',
        localizacao: 'Online',
        ongId: '101'
      }
    ];
    
    res.status(200).json(vagasMock);
  } catch (error) {
    res.status(500).json({ erro: 'Erro ao buscar vagas' });
  }
};

exports.criarVaga = async (req, res) => {
  try {
    const { titulo, descricao, formato, localizacao, horario, ongId } = req.body;

    res.status(201).json({ 
      mensagem: 'Vaga publicada com sucesso (Simulado)!',
      dadosRecebidos: { titulo, formato, ongId }
    });
  } catch (error) {
    res.status(500).json({ erro: 'Erro ao criar vaga' });
  }
};