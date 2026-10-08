const { gql } = require('apollo-server-express');

const typeDefs = gql`
  type Ong {
    _id: ID!
    nomeFantasia: String
    razaoSocial: String
    email: String
    cnpj: String
    cidade: String
    descricao: String
    dataCriacao: String
  }

  type Voluntario {
    _id: ID!
    nome: String
    email: String
    telefone: String
    causas: [String]
    dataCriacao: String
  }

  type Candidatura {
    voluntarioId: ID
    voluntario: Voluntario
    statusInscricao: String
    dataAplicacao: String
  }

  type Vaga {
    _id: ID!
    titulo: String
    descricao: String
    formato: String
    localizacao: String
    horario: String
    status: String
    ongId: ID
    ong: Ong
    dataCriacao: String
    totalCandidatos: Int
    "Preenchido apenas para a ONG dona da vaga"
    candidatos: [Candidatura]
    "Preenchido apenas quando quem consulta é um voluntário candidatado"
    minhaCandidatura: Candidatura
  }

  type Sessao {
    token: String!
    tipo: String!
    id: ID!
    nome: String
    email: String
  }

  input VoluntarioInput {
    nome: String!
    email: String!
    senha: String!
    telefone: String!
    causas: [String]
  }

  input OngInput {
    nomeFantasia: String!
    razaoSocial: String
    cnpj: String!
    email: String!
    senha: String!
    cidade: String
    descricao: String
  }

  input VagaInput {
    titulo: String!
    descricao: String!
    formato: String!
    localizacao: String!
    horario: String!
    status: String
  }

  input VagaAtualizacaoInput {
    titulo: String
    descricao: String
    formato: String
    localizacao: String
    horario: String
    status: String
  }

  type Query {
    mensagem: String
    "Públicas"
    listarVagas: [Vaga]
    buscarVaga(id: ID!): Vaga
    listarOngs: [Ong]
    "Requer login como ONG"
    listarVoluntarios: [Voluntario]
    listarCandidatos(vagaId: ID!): [Candidatura]
    "Requer login como voluntário"
    minhasCandidaturas: [Vaga]
  }

  type Mutation {
    "Públicas"
    criarVoluntario(input: VoluntarioInput!): Voluntario
    criarOng(input: OngInput!): Ong
    login(email: String!, senha: String!): Sessao

    "Requer login como ONG (a vaga é sempre da ONG logada)"
    criarVaga(input: VagaInput!): Vaga
    atualizarVaga(id: ID!, input: VagaAtualizacaoInput!): Vaga
    removerVaga(id: ID!): Vaga
    atualizarStatusCandidatura(vagaId: ID!, voluntarioId: ID!, status: String!): Vaga
    removerOng(id: ID!): Ong

    "Requer login como voluntário"
    candidatar(vagaId: ID!): Vaga
    cancelarCandidatura(vagaId: ID!): Vaga
    removerVoluntario(id: ID!): Voluntario
  }
`;

module.exports = typeDefs;
