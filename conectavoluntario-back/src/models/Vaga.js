const mongoose = require('mongoose');

const vagaSchema = new mongoose.Schema({
  titulo: {
    type: String,
    required: true,
  },
  descricao: {
    type: String,
    required: true,
  },
  formato: {
    type: String,
    enum: ['Presencial', 'Remoto', 'Híbrido'], 
    required: true,
  },
  localizacao: {
    type: String, 
  },
  horario: {
    type: String, 
  },
  status: {
    type: String,
    enum: ['Aberta', 'Fechada'],
    default: 'Aberta',
  },
  ongId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Ong',
    required: true,
  },
  candidatos: [{
    voluntarioId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Voluntario'
    },
    statusInscricao: {
      type: String,
      enum: ['Pendente', 'Aprovado', 'Recusado'],
      default: 'Pendente'
    },
    dataAplicacao: {
      type: Date,
      default: Date.now
    }
  }],
  dataCriacao: {
    type: Date,
    default: Date.now,
  }
});

module.exports = mongoose.model('Vaga', vagaSchema);