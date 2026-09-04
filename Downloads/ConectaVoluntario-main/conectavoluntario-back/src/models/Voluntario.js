const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

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
  causas: [{
    type: String
  }],
  dataCriacao: {
    type: Date,
    default: Date.now,
  }
});

// Criptografa a senha automaticamente antes de salvar (sem 'next')
voluntarioSchema.pre('save', async function () {
  if (!this.isModified('senha')) return;
  
  const salt = await bcrypt.genSalt(10);
  this.senha = await bcrypt.hash(this.senha, salt);
});

module.exports = mongoose.model('Voluntario', voluntarioSchema);