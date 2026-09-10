const { gql } = require('apollo-server-express');

const typeDefs = gql`
  type Vaga {
    _id: ID
    titulo: String
    descricao: String
    formato: String
    localizacao: String
    horario: String
    status: String
  }

  type Voluntario {
    _id: ID
    nome: String
    email: String
    telefone: String
    causas: [String]
  }

  type Ong {
    _id: ID
    nome: String
    nomeFantasia: String
    email: String
    cidade: String
    cnpj: String
  }

  type Query {
    mensagem: String
    listarVagas: [Vaga]
    listarVoluntarios: [Voluntario]
    listarOngs: [Ong]
  }

  type Mutation {
    criarVoluntario(nome: String!, email: String!, senha: String!, telefone: String!): Voluntario
    removerVoluntario(id: ID!): Voluntario
    criarOng(nome: String!, nomeFantasia: String!, email: String!, cidade: String!, senha: String!, cnpj: String!): Ong
    removerOng(id: ID!): Ong
    criarVaga(titulo: String!, descricao: String!, formato: String!, localizacao: String!, horario: String!, status: String!, ongId: ID!): Vaga
    removerVaga(id: ID!): Vaga
  }
`;

module.exports = typeDefs;