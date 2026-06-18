const API_URL = 'http://localhost:3000/clientes';

let clienteEditandoId = null;

const form = document.getElementById('clienteForm');
const tabela = document.getElementById('clientesTabela');
const busca = document.getElementById('busca');

async function listarClientes(filtro = '') {
    const resposta = await fetch(API_URL);
    const clientes = await resposta.json();

    document.getElementById('totalClientes').textContent =
        clientes.length;

    document.getElementById('clientesAtivos').textContent =
        clientes.filter(cliente =>
            cliente.status === 'ATIVO'
        ).length;

    document.getElementById('clientesInativos').textContent =
        clientes.filter(cliente =>
            cliente.status === 'INATIVO'
        ).length;

    const clientesFiltrados = clientes.filter(cliente =>
        cliente.nome.toLowerCase().includes(filtro.toLowerCase())
    );
    tabela.innerHTML = '';

    clientesFiltrados.forEach((cliente) => {
        const linha = document.createElement('tr');

        linha.innerHTML = `
      <td>${cliente.id}</td>
      <td>${cliente.nome}</td>
      <td>${cliente.cpf}</td>
      <td>${cliente.telefone}</td>
      <td>${cliente.endereco}</td>
      <td>${cliente.status}</td>
      <td>
      <button onclick='editarCliente(${JSON.stringify(cliente)})'>
        Editar
      </button>

      <button class="btn-delete" onclick="excluirCliente(${cliente.id})">
        Excluir
      </button>
      </td>
        `;

        tabela.appendChild(linha);
    });
}

form.addEventListener('submit', async (event) => {
    event.preventDefault();

    const cliente = {
        nome: document.getElementById('nome').value,
        cpf: document.getElementById('cpf').value,
        telefone: document.getElementById('telefone').value,
        endereco: document.getElementById('endereco').value,
        status: document.getElementById('status').value
    };

    if (clienteEditandoId) {
        await fetch(`${API_URL}/${clienteEditandoId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(cliente)
        });

        clienteEditandoId = null;
        document.querySelector('button[type="submit"]').textContent = 'Cadastrar';
    } else {
        await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(cliente)
        });
    }

    form.reset();
    listarClientes();
});

async function excluirCliente(id) {

  const confirmar = confirm("Tem certeza que deseja excluir este cliente?");

  if (!confirmar) {
    return;
  }

  await fetch(`${API_URL}/${id}`, {
    method: 'DELETE'
  });

  listarClientes();
}

listarClientes();

function editarCliente(cliente) {
    clienteEditandoId = cliente.id;

    document.getElementById('nome').value = cliente.nome;
    document.getElementById('cpf').value = cliente.cpf;
    document.getElementById('telefone').value = cliente.telefone;
    document.getElementById('endereco').value = cliente.endereco;
    document.getElementById('status').value = cliente.status;

    document.querySelector('button[type="submit"]').textContent = 'Atualizar';
}

busca.addEventListener('input', () => {
    listarClientes(busca.value);
});

