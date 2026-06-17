const express = require('express');
const clienteRoutes = require('./routes/clienteRoutes');

const app = express();

app.use(express.json());

app.get('/', (req, res) => {
  res.send('API funcionando!');
});
const cors = require('cors');

app.use(cors());
app.use(clienteRoutes);

const PORT = 3000;

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
