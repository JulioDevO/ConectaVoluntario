require('dotenv').config(); 

const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');

const voluntarioRoutes = require('./routes/voluntarioRoutes');
const ongRoutes = require('./routes/ongRoutes');
const vagaRoutes = require('./routes/vagaRoutes');

const app = express();

connectDB();

app.use(cors()); 
app.use(express.json()); 

app.use('/api/voluntarios', voluntarioRoutes);
app.use('/api/ongs', ongRoutes);
app.use('/api/vagas', vagaRoutes);

app.get('/', (req, res) => {
  res.send('API do ConectaVoluntário rodando e conectada ao Mongoose!');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});


console.log('Rotas de voluntários carregadas:');
voluntarioRoutes.stack.forEach((r) => {
  if (r.route) {
    console.log(`${Object.keys(r.route.methods)[0].toUpperCase()} /api/voluntarios${r.route.path}`);
  }
});