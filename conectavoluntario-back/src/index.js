require('dotenv').config();

const { port, corsOrigins } = require('./config/env');
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const { ApolloServer } = require('apollo-server-express');

const conectarBanco = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const vagaRoutes = require('./routes/vagaRoutes');
const ongRoutes = require('./routes/ongRoutes');
const voluntarioRoutes = require('./routes/voluntarioRoutes');
const typeDefs = require('./graphql/typeDefs');
const resolvers = require('./graphql/resolvers');
const { lerUsuario } = require('./middlewares/auth');
const { rotaNaoEncontrada, tratarErros } = require('./middlewares/erros');

async function iniciarServidor() {
  await conectarBanco();

  const app = express();

  // CSP desativada porque a página do Apollo (/graphql) carrega scripts externos
  app.use(helmet({ contentSecurityPolicy: false }));
  app.use(cors(corsOrigins.length > 0 ? { origin: corsOrigins } : undefined));
  app.use(express.json({ limit: '100kb' }));

  // REST
  app.use('/api/auth', authRoutes);
  app.use('/api/vagas', vagaRoutes);
  app.use('/api/ongs', ongRoutes);
  app.use('/api/voluntarios', voluntarioRoutes);

  // GraphQL: o usuário (se houver token válido) vai no contexto de todos os resolvers
  const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: ({ req }) => ({ usuario: lerUsuario(req) }),
  });
  await server.start();
  server.applyMiddleware({ app, path: '/graphql' });

  app.use(rotaNaoEncontrada);
  app.use(tratarErros);

  app.listen(port, () => {
    console.log(`✅ Servidor rodando na porta ${port}`);
    console.log(`🛣️  REST disponível em http://localhost:${port}/api/vagas`);
    console.log(`🚀 GraphQL pronto em http://localhost:${port}/graphql`);
  });
}

iniciarServidor().catch((error) => {
  console.error('Falha ao iniciar o servidor:', error);
  process.exit(1);
});
