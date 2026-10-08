const mongoose = require('mongoose');
const { criptografarSenhaAntesDeSalvar, removerSenhaDoJson } = require('../utils/senha');

const voluntarioSchema = new mongoose.Schema({
  nome: {
    type: String,
    required: true,
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
  telefone: {
    type: String,
    required: true, 
  },
  causas: [{
    type: String
  }],
  dataCriacao: {
    type: Date,
    default: Date.now,
  }
});

voluntarioSchema.pre('save', criptografarSenhaAntesDeSalvar);
voluntarioSchema.set('toJSON', { transform: removerSenhaDoJson });

module.exports = mongoose.model('Voluntario', voluntarioSchema);