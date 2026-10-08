const mongoose = require('mongoose');

const FORMATOS = ['Presencial', 'Remoto', 'Híbrido'];
const STATUS_VAGA = ['Aberta', 'Fechada'];
const STATUS_INSCRICAO = ['Pendente', 'Aprovado', 'Recusado'];

const vagaSchema = new mongoose.Schema({
  titulo: {
    type: String,
    required: [true, 'Informe o título da vaga.'],
    trim: true,
  },
  descricao: {
    type: String,
    required: [true, 'Informe a descrição da vaga.'],
    trim: true,
  },
  formato: {
    type: String,
    enum: { values: FORMATOS, message: `Formato inválido. Use: ${FORMATOS.join(', ')}.` },
    required: [true, 'Informe o formato da vaga.'],
  },
  localizacao: {
    type: String,
    trim: true,
  },
  horario: {
    type: String,
    trim: true,
  },
  status: {
    type: String,
    enum: { values: STATUS_VAGA, message: `Status inválido. Use: ${STATUS_VAGA.join(', ')}.` },
    default: 'Aberta',
  },
  ongId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Ong',
    required: true,
    index: true,
  },
  candidatos: [{
    voluntarioId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Voluntario',
      required: true,
    },
    statusInscricao: {
      type: String,
      enum: STATUS_INSCRICAO,
      default: 'Pendente',
    },
    dataAplicacao: {
      type: Date,
      default: Date.now,
    }
  }],
  dataCriacao: {
    type: Date,
    default: Date.now,
  }
});

module.exports = mongoose.model('Vaga', vagaSchema);
module.exports.FORMATOS = FORMATOS;
module.exports.STATUS_VAGA = STATUS_VAGA;
module.exports.STATUS_INSCRICAO = STATUS_INSCRICAO;
