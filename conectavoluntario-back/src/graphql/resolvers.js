// Importamos o Model que criamos lá atrás
const Vaga = require('../models/Vaga');

const resolvers = {
  Query: {
    mensagem: () => 'Sucesso! Mongoose e GraphQL modulares estão rodando juntos!',
    
    // O resolver vai no MongoDB e busca os dados de verdade!
    listarVagas: async () => {
      try {
        const vagas = await Vaga.find();
        return vagas;
      } catch (error) {
        throw new Error("Erro ao buscar vagas no banco de dados");
      }
    }
  },
};

module.exports = resolvers;