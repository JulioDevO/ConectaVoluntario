const mongoose = require('mongoose');
const { criptografarSenhaAntesDeSalvar, removerSenhaDoJson } = require('../utils/senha');

const voluntarioSchema = new mongoose.Schema({
  nome: {
    type: String,
    required: [true, 'Informe o nome.'],
    trim: true,
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
  telefone: {
    type: String,
    required: [true, 'Informe o telefone.'],
    trim: true,
  },
  causas: [{
    type: String,
    trim: true,
  }],
  dataCriacao: {
    type: Date,
    default: Date.now,
  }
});

voluntarioSchema.pre('save', criptografarSenhaAntesDeSalvar);
voluntarioSchema.set('toJSON', { transform: removerSenhaDoJson });

module.exports = mongoose.model('Voluntario', voluntarioSchema);
