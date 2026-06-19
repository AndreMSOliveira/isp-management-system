const API_URL = 'http://localhost:3000/clientes';

let clienteEditandoId = null;
let paginaAtual = 1;
const clientesPorPagina = 5;

const form = document.getElementById('clienteForm');
const tabela = document.getElementById('clientesTabela');
const busca = document.getElementById('busca');

async function listarClientes(filtro = '') {
  const resposta = await fetch(API_URL);
  const clientes = await resposta.json();

  const clientesFiltrados = clientes.filter(cliente =>
    cliente.nome.toLowerCase().includes(filtro.toLowerCase())
  );

  const totalPaginas = Math.ceil(clientesFiltrados.length / clientesPorPagina);

  const inicio = (paginaAtual - 1) * clientesPorPagina;
  const fim = inicio + clientesPorPagina;

  const clientesPaginados = clientesFiltrados.slice(inicio, fim);

  document.getElementById('totalClientes').textContent = clientes.length;

  document.getElementById('clientesAtivos').textContent =
    clientes.filter(cliente => cliente.status === 'ATIVO').length;

  document.getElementById('clientesInativos').textContent =
    clientes.filter(cliente => cliente.status === 'INATIVO').length;

  document.getElementById('infoPagina').textContent =
    `Página ${paginaAtual} de ${totalPaginas || 1}`;

  tabela.innerHTML = '';

  clientesPaginados.forEach((cliente) => {
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

function validarCPF(cpf) {
  const cpfLimpo = cpf.replace(/\D/g, '');
  return cpfLimpo.length === 11;
}

function validarTelefone(telefone) {
  const telefoneLimpo = telefone.replace(/\D/g, '');
  return telefoneLimpo.length === 11;
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

    if (!validarCPF(cliente.cpf)) {
  alert('CPF inválido. Digite pelo menos 11 números.');
  return;
}

if (!validarTelefone(cliente.telefone)) {
  alert('Telefone inválido. Digite pelo menos 12 números.');
  return;
}

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
  paginaAtual = 1;
  listarClientes(busca.value);
});

document.getElementById('btnAnterior').addEventListener('click', () => {
  if (paginaAtual > 1) {
    paginaAtual--;
    listarClientes(busca.value);
  }
});

document.getElementById('btnProxima').addEventListener('click', async () => {
  const resposta = await fetch(API_URL);
  const clientes = await resposta.json();

  const clientesFiltrados = clientes.filter(cliente =>
    cliente.nome.toLowerCase().includes(busca.value.toLowerCase())
  );

  const totalPaginas = Math.ceil(clientesFiltrados.length / clientesPorPagina);

  if (paginaAtual < totalPaginas) {
    paginaAtual++;
    listarClientes(busca.value);
  }
});

const inputCPF = document.getElementById('cpf');
const inputTelefone = document.getElementById('telefone');

inputCPF.addEventListener('input', () => {
  let valor = inputCPF.value.replace(/\D/g, '');

  valor = valor.slice(0, 11);

  valor = valor.replace(/(\d{3})(\d)/, '$1.$2');
  valor = valor.replace(/(\d{3})(\d)/, '$1.$2');
  valor = valor.replace(/(\d{3})(\d{1,2})$/, '$1-$2');

  inputCPF.value = valor;
});

inputTelefone.addEventListener('input', () => {
  let valor = inputTelefone.value.replace(/\D/g, '');

  valor = valor.slice(0, 11);

  valor = valor.replace(/(\d{2})(\d)/, '($1) $2');
  valor = valor.replace(/(\d{5})(\d)/, '$1-$2');

  inputTelefone.value = valor;
});