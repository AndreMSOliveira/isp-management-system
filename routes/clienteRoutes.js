const express = require('express');
const router = express.Router();

const {
  listarClientes,
  criarCliente,
  atualizarCliente,
  excluirCliente
} = require('../controllers/clienteController');

router.get('/clientes', listarClientes);
router.post('/clientes', criarCliente);
router.put('/clientes/:id', atualizarCliente);
router.delete('/clientes/:id', excluirCliente);

module.exports = router;