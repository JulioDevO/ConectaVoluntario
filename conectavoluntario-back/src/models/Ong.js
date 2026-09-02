const mongoose = require('mongoose');

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

module.exports = mongoose.model('Ong', ongSchema);