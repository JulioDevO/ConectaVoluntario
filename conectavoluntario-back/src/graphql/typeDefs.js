const { gql } = require('apollo-server-express');

const typeDefs = gql`
  # Definimos a "forma" da Vaga baseada no seu model do Mongoose
  type Vaga {
    _id: ID
    titulo: String
    descricao: String
    formato: String
    localizacao: String
    horario: String
    status: String
  }

  type Query {
    mensagem: String
    # Criamos uma rota nova que devolve uma lista (Array) de Vagas
    listarVagas: [Vaga]
  }
`;

module.exports = typeDefs;