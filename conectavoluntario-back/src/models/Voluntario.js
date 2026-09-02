const mongoose = require('mongoose');

// Definimos o "molde" do voluntário usando o Mongoose
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

module.exports = mongoose.model('Voluntario', voluntarioSchema);