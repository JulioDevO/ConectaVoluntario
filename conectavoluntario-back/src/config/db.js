const mongoose = require('mongoose');

const conectarBanco = async () => {
  try {
    const uri = "mongodb://larissafc13_db_user:iTeXvK0UHFKL9qUr@ac-bwthduz-shard-00-00.8xnfcvh.mongodb.net:27017,ac-bwthduz-shard-00-01.8xnfcvh.mongodb.net:27017,ac-bwthduz-shard-00-02.8xnfcvh.mongodb.net:27017/?ssl=true&replicaSet=atlas-13dok4-shard-0&authSource=admin&appName=Cluster0";
    
    const conexao = await mongoose.connect(uri);
    console.log(`MongoDB Conectado: ${conexao.connection.host}`);
  } catch (error) {
    console.error(`Erro ao conectar no MongoDB: ${error.message}`);
    process.exit(1); 
  }
};

module.exports = conectarBanco;