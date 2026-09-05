// Criar uma nova ONG no MongoDB
exports.criarOng = async (req, res) => {
  try {
    const { nomeFantasia, cnpj, email, senha, descricao } = req.body;

    if (!nomeFantasia || !cnpj || !email || !senha) {
      return res.status(400).json({ 
        erro: 'Por favor, preencha todos os campos obrigatórios: nomeFantasia, cnpj, email e senha.' 
      });
    }

    const novaOng = new Ong({
      nomeFantasia,
      cnpj,
      email,
      senha,
      descricao
    });

    await novaOng.save();

    return res.status(201).json({
      mensagem: 'ONG cadastrada com sucesso!',
      ong: novaOng
    });

  } catch (error) {
    if (error.code === 11000) {
      const campoDuplicado = Object.keys(error.keyValue)[0];
      return res.status(400).json({ 
        erro: `O ${campoDuplicado} informado já está cadastrado no sistema.` 
      });
    }

    return res.status(500).json({ 
      erro: 'Erro ao cadastrar ONG', 
      detalhes: error.message 
    });
  }
};