// Credenciais fixas
const credenciais = { usuario: 'admin', senha: '1234' };

// Função de login
function login() {
  const user = document.getElementById('user').value;
  const password = document.getElementById('password').value;

  if (user === credenciais.usuario && password === credenciais.senha) {
    window.location.href = 'login.html';
  } else {
    alert('Usuário ou senha incorretos!');
  }
}

// Buscar endereço via CEP
function buscarCEP() {
  const cep = document.getElementById('cep').value.replace(/\D/g, '');
  if (cep.length === 8) {
    fetch(`https://viacep.com.br/ws/${cep}/json/`)
      .then(res => res.json())
      .then(data => {
        if (data.erro) {
          alert('CEP não encontrado');
          document.getElementById('endereco').value = '';
        } else {
          document.getElementById('endereco').value =
            `${data.logradouro}, ${data.bairro}, ${data.localidade} - ${data.uf}`;
        }
      });
  }
}

// Adicionar voluntário
function addVoluntario(e) {
  e.preventDefault();
  const nome = document.getElementById('nome').value;
  const email = document.getElementById('email').value;
  const idade = parseInt(document.getElementById('idade').value);
  const estadoCivil = document.getElementById('estadoCivil').value;
  const motivacao = document.getElementById('motivacao').value;
  const tema = document.getElementById('tema').value;
  const cep = document.getElementById('cep').value;
  const endereco = document.getElementById('endereco').value;

  if (idade < 15) {
    alert('Idade mínima de 15 anos para se cadastrar como voluntário.');
    return;
  }

  const voluntarios = JSON.parse(localStorage.getItem('voluntarios')) || [];

  const emailExistente = voluntarios.some(v => v.email === email);
  if (emailExistente) {
    alert('Já existe um voluntário cadastrado com esse email.');
    return;
  }

  voluntarios.push({ nome, email, idade, estadoCivil, motivacao, tema, cep, endereco });
  localStorage.setItem('voluntarios', JSON.stringify(voluntarios));

  alert('Voluntário cadastrado com sucesso!');
  document.querySelector('form').reset();
}

// Carregar voluntários
function carregarVoluntarios() {
  const container = document.getElementById('voluntarios');
  if (!container) return;
  container.innerHTML = '';

  const voluntarios = JSON.parse(localStorage.getItem('voluntarios')) || [];
  const filtro = document.getElementById('filter')?.value.toLowerCase() || '';

  voluntarios
    .filter(v => v.nome.toLowerCase().includes(filtro))
    .forEach((v, i) => {
      const card = document.createElement('div');
      card.className = 'card';
      card.innerHTML = `
        <img src="https://source.unsplash.com/160x160/?${v.tema}" alt="Foto">
        <div>
          <strong>${v.nome}</strong> (${v.idade} anos)<br>
          <strong>Email:</strong> ${v.email}<br>
          <strong>Endereço:</strong> ${v.endereco}<br>
          ${v.estadoCivil ? `<strong>Estado Civil:</strong> ${v.estadoCivil}<br>` : ''}
          ${v.motivacao ? `<strong>Motivação:</strong> ${v.motivacao}<br>` : ''}
          <strong>Tema:</strong> ${v.tema}
        </div>
        <button onclick="removerVoluntario(${i})">Excluir</button>
      `;
      container.appendChild(card);
    });
}

// Remover voluntário
function removerVoluntario(index) {
  const voluntarios = JSON.parse(localStorage.getItem('voluntarios')) || [];
  voluntarios.splice(index, 1);
  localStorage.setItem('voluntarios', JSON.stringify(voluntarios));
  carregarVoluntarios();
}

// Limpar tudo
function limparTudo() {
  if (confirm('Tem certeza que deseja apagar todos os cadastros?')) {
    localStorage.removeItem('voluntarios');
    carregarVoluntarios();
  }
}

// Filtrar voluntários
function filtrarVoluntarios() {
  carregarVoluntarios();
}

// Carregar lista automaticamente se estiver na página de lista
document.addEventListener('DOMContentLoaded', () => {
  if (document.getElementById('voluntarios')) {
    carregarVoluntarios();
  }
});

