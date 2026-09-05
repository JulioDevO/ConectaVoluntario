require('dotenv').config();
const express = require('express');
const cors = require('cors');

// Importações do Mongoose e Rotas REST
const conectarBanco = require('./config/db');
const vagaRoutes = require('./routes/vagaRoutes');

// Importação segura do Apollo para o Node 24
const { ApolloServer } = require('apollo-server-express');

// Importando os arquivos do GraphQL que você modularizou
const typeDefs = require('./graphql/typeDefs');
const resolvers = require('./graphql/resolvers');

async function iniciarServidor() {
  const app = express();

  // 1. Conecta ao MongoDB
  conectarBanco();

  // 2. Middlewares básicos (Express + CORS + JSON)
  app.use(cors());
  app.use(express.json());

  // 3. Rotas REST antigas (continuam funcionando normalmente!)
  app.use('/api/vagas', vagaRoutes);

  // 4. Configura o Apollo Server
  const server = new ApolloServer({
    typeDefs,
    resolvers,
  });

  await server.start();

  // 5. A Nova Rota Única do GraphQL
  server.applyMiddleware({ app, path: '/graphql' });

  const PORT = process.env.PORT || 3000;

  app.listen(PORT, () => {
    console.log(`✅ Servidor rodando na porta ${PORT}`);
    console.log(`🛣️  REST disponível em http://localhost:${PORT}/api/vagas`);
    console.log(`🚀 GraphQL pronto em http://localhost:${PORT}/graphql`);
  });
}

iniciarServidor();