const mongoose = require('mongoose');
const { criptografarSenhaAntesDeSalvar, removerSenhaDoJson } = require('../utils/senha');

const ongSchema = new mongoose.Schema({
  nomeFantasia: {
    type: String,
    required: [true, 'Informe o nome fantasia.'],
    trim: true,
  },
  razaoSocial: {
    type: String,
    trim: true,
  },
  cnpj: {
    type: String,
    required: [true, 'Informe o CNPJ.'],
    unique: true,
  },
  email: {
    type: String,
    required: [true, 'Informe o e-mail.'],
    unique: true,
    lowercase: true,
    trim: true,
  },
  senha: {
    type: String,
    required: [true, 'Informe a senha.'],
  },
  cidade: {
    type: String,
    trim: true,
  },
  descricao: {
    type: String,
    trim: true,
  },
  dataCriacao: {
    type: Date,
    default: Date.now,
  }
});

ongSchema.pre('save', criptografarSenhaAntesDeSalvar);
ongSchema.set('toJSON', { transform: removerSenhaDoJson });

module.exports = mongoose.model('Ong', ongSchema);
