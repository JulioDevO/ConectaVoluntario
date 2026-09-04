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
    enum: ['Presencial', 'Remoto', 'Híbrido'], // Limita as opções
    required: true,
  },
  localizacao: {
    type: String, // "São Paulo, SP" ou "Online"
  },
  horario: {
    type: String, 
  },
  status: {
    type: String,
    enum: ['Aberta', 'Fechada'],
    default: 'Aberta',
  },
  // Relacionamento: Qual ONG criou essa vaga?
  ongId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Ong',
    required: true,
  },
  // Relacionamento: Quem se candidatou?
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