const express = require('express');
const clienteRoutes = require('./routes/clienteRoutes');

const app = express();

app.use(express.json());

app.get('/', (req, res) => {
  res.send('API funcionando!');
});

app.use(clienteRoutes);

const PORT = 3000;

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});