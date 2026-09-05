const Ong = require('../models/Ong');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.listarOngs = async (req, res) => {
  try {
    const ongs = await Ong.find();
    res.status(200).json(ongs);
  } catch (error) {
    res.status(500).json({ 
      erro: 'Erro ao buscar ONGs', 
      detalhes: error.message 
    });
  }
};

exports.buscarOngPorId = async (req, res) => {
  try {
    const ong = await Ong.findById(req.params.id);
    
    if (!ong) {
      return res.status(404).json({ erro: 'ONG não encontrada' });
    }

    res.status(200).json(ong);
  } catch (error) {
    res.status(500).json({ 
      erro: 'Erro ao buscar a ONG', 
      detalhes: error.message 
    });
  }
};

exports.criarOng = async (req, res) => {
  try {
    const { nomeFantasia, cnpj, email, senha, descricao } = req.body;

    const novaOng = new Ong({
      nomeFantasia,
      cnpj,
      email,
      senha,
      descricao
    });

    await novaOng.save();

    res.status(201).json({
      mensagem: 'ONG cadastrada com sucesso!',
      ong: novaOng
    });
  } catch (error) {
    res.status(500).json({ 
      erro: 'Erro ao cadastrar ONG', 
      detalhes: error.message 
    });
  }
};

exports.atualizarOng = async (req, res) => {
  try {
    // 1. Busca a ONG pelo ID
    const ong = await Ong.findById(req.params.id);

    if (!ong) {
      return res.status(404).json({ erro: 'ONG não encontrada para atualização' });
    }

    // 2. Mapeia as chaves que chegaram na requisição (req.body) 
    // e atualiza os valores correspondentes na ONG encontrada
    const camposAtualizados = Object.keys(req.body);
    camposAtualizados.forEach(campo => {
      ong[campo] = req.body[campo];
    });

    // 3. Salva usando o método do Mongoose (Isso ativa o hook de hash se a senha foi enviada)
    await ong.save();

    res.status(200).json({
      mensagem: 'ONG atualizada com sucesso!',
      ong: {
        id: ong._id,
        nomeFantasia: ong.nomeFantasia,
        email: ong.email
        // evitamos devolver a senha, mesmo criptografada, por segurança
      }
    });
  } catch (error) {
    res.status(500).json({ 
      erro: 'Erro ao atualizar ONG', 
      detalhes: error.message 
    });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, senha } = req.body;

    // 1. Verifica se a ONG existe no banco
    const ong = await Ong.findOne({ email });
    if (!ong) {
      return res.status(401).json({ erro: 'Credenciais inválidas' });
    }

    // 2. Compara a senha digitada com o hash salvo
    const senhaValida = await bcrypt.compare(senha, ong.senha);
    if (!senhaValida) {
      return res.status(401).json({ erro: 'Credenciais inválidas' });
    }

    // 3. Gera o Token de Segurança (JWT)
    const token = jwt.sign(
      { id: ong._id, tipo: 'ong' }, // Informações guardadas no token
      process.env.JWT_SECRET || 'chave_secreta_padrao',
      { expiresIn: '1d' } // O token expira em 1 dia
    );

    res.status(200).json({
      mensagem: 'Login realizado com sucesso!',
      token,
      ong: {
        id: ong._id,
        nomeFantasia: ong.nomeFantasia,
        email: ong.email
      }
    });
  } catch (error) {
    res.status(500).json({ erro: 'Erro interno no servidor', detalhes: error.message });
  }
};

exports.deletarOng = async (req, res) => {
  try {
    const ongDeletada = await Ong.findByIdAndDelete(req.params.id);

    if (!ongDeletada) {
      return res.status(404).json({ erro: 'ONG não encontrada para deleção' });
    }

    res.status(200).json({ mensagem: 'ONG removida com sucesso!' });
  } catch (error) {
    res.status(500).json({ 
      erro: 'Erro ao deletar ONG', 
      detalhes: error.message 
    });
  }
};