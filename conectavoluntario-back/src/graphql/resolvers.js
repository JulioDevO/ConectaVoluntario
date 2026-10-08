const {
  ApolloError,
  AuthenticationError,
  ForbiddenError,
  UserInputError,
} = require('apollo-server-express');
const Ong = require('../models/Ong');
const Voluntario = require('../models/Voluntario');
const contaService = require('../services/contaService');
const vagaService = require('../services/vagaService');
const { normalizarErro } = require('../utils/erros');

// Traduz o erro da regra de negócio para o erro correspondente do Apollo.
function paraErroGraphQL(error) {
  const { status, message } = normalizarErro(error);
  if (status === 401) return new AuthenticationError(message);
  if (status === 403) return new ForbiddenError(message);
  if (status >= 500) return new ApolloError(message, 'INTERNAL_SERVER_ERROR');
  return new UserInputError(message, { status });
}

// Envolve todos os resolvers de uma seção para tratar erros em um só lugar.
function comTratamentoDeErros(resolvers) {
  return Object.fromEntries(
    Object.entries(resolvers).map(([nome, fn]) => [
      nome,
      async (...args) => {
        try {
          return await fn(...args);
        } catch (error) {
          throw paraErroGraphQL(error);
        }
      },
    ])
  );
}

// Datas saem em formato ISO (ex.: 2026-10-08T12:00:00.000Z)
const paraISO = (data) => (data ? new Date(data).toISOString() : null);

const resolvers = {
  Query: comTratamentoDeErros({
    mensagem: () => 'API do Conecta Voluntário funcionando!',
    listarVagas: (_, __, { usuario }) => vagaService.listarVagas(usuario),
    buscarVaga: (_, { id }, { usuario }) => vagaService.buscarVaga(id, usuario),
    listarOngs: () => contaService.listarOngs(),
    listarVoluntarios: (_, __, { usuario }) => contaService.listarVoluntarios(usuario),
    listarCandidatos: (_, { vagaId }, { usuario }) => vagaService.listarCandidatos(vagaId, usuario),
    minhasCandidaturas: (_, __, { usuario }) => vagaService.minhasCandidaturas(usuario),
  }),

  Mutation: comTratamentoDeErros({
    criarVoluntario: (_, { input }) => contaService.cadastrarVoluntario(input),
    criarOng: (_, { input }) => contaService.cadastrarOng(input),
    login: (_, { email, senha }) => contaService.autenticarQualquer(email, senha),

    criarVaga: (_, { input }, { usuario }) => vagaService.criarVaga(input, usuario),
    atualizarVaga: (_, { id, input }, { usuario }) => vagaService.atualizarVaga(id, input, usuario),
    removerVaga: (_, { id }, { usuario }) => vagaService.removerVaga(id, usuario),
    atualizarStatusCandidatura: (_, { vagaId, voluntarioId, status }, { usuario }) =>
      vagaService.atualizarStatusCandidatura(vagaId, voluntarioId, status, usuario),
    removerOng: (_, { id }, { usuario }) => contaService.removerOng(id, usuario),

    candidatar: (_, { vagaId }, { usuario }) => vagaService.candidatar(vagaId, usuario),
    cancelarCandidatura: (_, { vagaId }, { usuario }) => vagaService.cancelarCandidatura(vagaId, usuario),
    removerVoluntario: (_, { id }, { usuario }) => contaService.removerVoluntario(id, usuario),
  }),

  // Campos que dependem de outras coleções (só são buscados se o cliente pedir)
  Vaga: {
    ong: (vaga) => Ong.findById(vaga.ongId).select('-senha').lean().exec(),
    dataCriacao: (vaga) => paraISO(vaga.dataCriacao),
  },
  Candidatura: {
    // Em listarCandidatos o service já devolve o voluntário populado
    voluntario: (candidatura) =>
      candidatura.voluntario ||
      Voluntario.findById(candidatura.voluntarioId).select('-senha').lean().exec(),
    dataAplicacao: (candidatura) => paraISO(candidatura.dataAplicacao),
  },
  Ong: { dataCriacao: (ong) => paraISO(ong.dataCriacao) },
  Voluntario: { dataCriacao: (voluntario) => paraISO(voluntario.dataCriacao) },
};

module.exports = resolvers;
