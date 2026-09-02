const express = require('express');
const cors = require('cors');
const voluntarioRoutes = require('./routes/voluntarioRoutes');
const ongRoutes = require('./routes/ongRoutes');
const vagaRoutes = require('./routes/vagaRoutes');

const app = express();


app.use(cors()); 
app.use(express.json()); 

app.use('/api/voluntarios', voluntarioRoutes);
app.use('/api/ongs', ongRoutes);
app.use('/api/vagas', vagaRoutes);

app.get('/', (req, res) => {
  res.send('API do ConectaVoluntário rodando e pronta para o Mongoose!');
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando na porta ${PORT}`);
});