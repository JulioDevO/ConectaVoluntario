const Vaga = require('../models/Vaga');
const Voluntario = require('../models/Voluntario');
const Ong = require('../models/Ong');

const resolvers = {
  Query: {
    mensagem: () => "Olá! O GraphQL e o Apollo estão funcionando 100%!",
    
    listarVagas: async () => {
      try {
        return await Vaga.find().lean();
      } catch (erro) {
        console.error("Erro ao buscar vagas:", erro);
        throw new Error("Falha ao carregar as vagas.");
      }
    },

    listarVoluntarios: async () => {
      try {
        return await Voluntario.find().lean();
      } catch (erro) {
        console.error("Erro ao buscar voluntários:", erro);
        throw new Error("Falha ao carregar os voluntários.");
      }
    },

    listarOngs: async () => {
      try {
        return await Ong.find().lean();
      } catch (erro) {
        console.error("Erro ao buscar ONGs:", erro);
        throw new Error("Falha ao carregar as ONGs.");
      }
    }
  },

  Mutation: {
    criarVoluntario: async (_, { nome, email, senha, telefone }) => {
      try {
        const novoVoluntario = new Voluntario({ nome, email, senha, telefone });
        await novoVoluntario.save();
        return novoVoluntario;
      } catch (erro) {
        console.error("Erro ao cadastrar voluntário:", erro);
        throw new Error("Falha ao criar o voluntário.");
      }
    },

    removerVoluntario: async (_, { id }) => {
      try {
        const voluntarioRemovido = await Voluntario.findByIdAndDelete(id);
        if (!voluntarioRemovido) {
          throw new Error("Voluntário não encontrado.");
        }
        return voluntarioRemovido;
      } catch (erro) {
        console.error("Erro ao remover voluntário:", erro);
        throw new Error("Falha ao remover o voluntário.");
      }
    },

    criarOng: async (_, { nome, nomeFantasia, email, cidade, senha, cnpj }) => {
      try {
        const novaOng = new Ong({ nome, nomeFantasia, email, cidade, senha, cnpj });
        await novaOng.save();
        return novaOng;
      } catch (erro) {
        console.error("Erro ao cadastrar ONG:", erro);
        throw new Error("Falha ao criar a ONG.");
      }
    },

    removerOng: async (_, { id }) => {
      try {
        const ongRemovida = await Ong.findByIdAndDelete(id);
        if (!ongRemovida) {
          throw new Error("ONG não encontrada.");
        }
        return ongRemovida;
      } catch (erro) {
        console.error("Erro ao remover ONG:", erro);
        throw new Error("Falha ao remover a ONG.");
      }
    },

    criarVaga: async (_, args) => {
      try {
        const novaVaga = new Vaga(args);
        await novaVaga.save();
        return novaVaga;
      } catch (erro) {
        console.error("Erro ao cadastrar vaga:", erro);
        throw new Error("Falha ao criar a vaga.");
      }
    },

    removerVaga: async (_, { id }) => {
      try {
        const vagaRemovida = await Vaga.findByIdAndDelete(id);
        if (!vagaRemovida) {
          throw new Error("Vaga não encontrada.");
        }
        return vagaRemovida;
      } catch (erro) {
        console.error("Erro ao remover vaga:", erro);
        throw new Error("Falha ao remover a vaga.");
      }
    }
  }
};

module.exports = resolvers;