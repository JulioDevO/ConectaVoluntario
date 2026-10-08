const mongoose = require('mongoose');
const { criptografarSenhaAntesDeSalvar, removerSenhaDoJson } = require('../utils/senha');

const ongSchema = new mongoose.Schema({
  nomeFantasia: {
    type: String,
    required: true,
  },
  cnpj: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  senha: {
    type: String,
    required: true,
  },
  descricao: {
    type: String,
  },
  dataCriacao: {
    type: Date,
    default: Date.now,
  }
});

ongSchema.pre('save', criptografarSenhaAntesDeSalvar);
ongSchema.set('toJSON', { transform: removerSenhaDoJson });

module.exports = mongoose.model('Ong', ongSchema);