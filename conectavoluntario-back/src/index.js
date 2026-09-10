require('dotenv').config();
const express = require('express');
const cors = require('cors');

const conectarBanco = require('./config/db');
const vagaRoutes = require('./routes/vagaRoutes');

const { ApolloServer } = require('apollo-server-express');

const typeDefs = require('./graphql/typeDefs');
const resolvers = require('./graphql/resolvers');

async function iniciarServidor() {
  const app = express();

  conectarBanco();

  app.use(cors());
  app.use(express.json());

  app.use('/api/vagas', vagaRoutes);

  const server = new ApolloServer({
    typeDefs,
    resolvers,
  });

  await server.start();

  server.applyMiddleware({ app, path: '/graphql' });

  const PORT = process.env.PORT || 3000;

  app.listen(PORT, () => {
    console.log(`✅ Servidor rodando na porta ${PORT}`);
    console.log(`🛣️  REST disponível em http://localhost:${PORT}/api/vagas`);
    console.log(`🚀 GraphQL pronto em http://localhost:${PORT}/graphql`);
  });
}

iniciarServidor();