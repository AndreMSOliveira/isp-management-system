const db = require('../config/db');

const listarClientes = (req, res) => {
  db.query('SELECT * FROM clientes', (err, results) => {
    if (err) return res.status(500).json(err);
    res.json(results);
  });
};

const criarCliente = (req, res) => {
  const { nome, cpf, telefone, endereco, status } = req.body;

  const sql = `
    INSERT INTO clientes
    (nome, cpf, telefone, endereco, status)
    VALUES (?, ?, ?, ?, ?)
  `;

  db.query(sql, [nome, cpf, telefone, endereco, status], (err, result) => {
    if (err) return res.status(500).json(err);

    res.status(201).json({
      mensagem: 'Cliente cadastrado com sucesso!',
      id: result.insertId
    });
  });
};

const atualizarCliente = (req, res) => {
  const { id } = req.params;
  const { nome, cpf, telefone, endereco, status } = req.body;

  const sql = `
    UPDATE clientes
    SET nome = ?, cpf = ?, telefone = ?, endereco = ?, status = ?
    WHERE id = ?
  `;

  db.query(sql, [nome, cpf, telefone, endereco, status, id], (err) => {
    if (err) return res.status(500).json(err);

    res.json({
      mensagem: 'Cliente atualizado com sucesso!'
    });
  });
};

const excluirCliente = (req, res) => {
  const { id } = req.params;

  db.query('DELETE FROM clientes WHERE id = ?', [id], (err) => {
    if (err) return res.status(500).json(err);

    res.json({
      mensagem: 'Cliente removido com sucesso!'
    });
  });
};

module.exports = {
  listarClientes,
  criarCliente,
  atualizarCliente,
  excluirCliente
};