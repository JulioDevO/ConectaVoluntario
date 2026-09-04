const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

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


ongSchema.pre('save', async function () {
  if (!this.isModified('senha')) return;
  const salt = await bcrypt.genSalt(10);
  this.senha = await bcrypt.hash(this.senha, salt);
});

module.exports = mongoose.model('Ong', ongSchema);