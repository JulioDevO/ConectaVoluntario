const mongoose = require('mongoose');
const { mongoUri } = require('./env');

const conectarBanco = async () => {
  try {
    const conexao = await mongoose.connect(mongoUri);
    console.log(`MongoDB Conectado: ${conexao.connection.host}`);
  } catch (error) {
    console.error(`Erro ao conectar no MongoDB: ${error.message}`);
    process.exit(1);
  }
};

module.exports = conectarBanco;
