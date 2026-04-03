// 1. Carrega os dados salvos ou usa os iniciais
let usuarios = JSON.parse(localStorage.getItem('usuarios_lastfm')) || [
  { nome: "Pedro", musicas: 1200, artistas: { "Arctic Monkeys": 300 } },
  { nome: "Lucas", musicas: 900, artistas: { "Arctic Monkeys": 150 } }
];

function salvarNoNavegador() {
  localStorage.setItem('usuarios_lastfm', JSON.stringify(usuarios));
}

function toggleMenu() {
  document.getElementById("menu").classList.toggle("active");
}

function mostrar(id) {
  document.querySelectorAll(".aba").forEach(sec => sec.classList.remove("ativa"));
  document.getElementById(id).classList.add("ativa");
  
  // Se o menu estiver aberto, ele fecha ao clicar na opção
  const menu = document.getElementById("menu");
  if(menu.classList.contains("active")) {
    toggleMenu();
  }
}

// Contador de dias
const startDate = new Date("2026-04-03");
const today = new Date();
const diffDays = Math.floor((today - startDate)/(1000*60*60*24)) + 1;
document.getElementById("contador").innerText = "Dia " + diffDays;

// Atualizar Ranking de Músicas
function atualizarRanking() {
  let lista = document.getElementById("lista-musicas");
  lista.innerHTML = "";

  usuarios.sort((a,b) => b.musicas - a.musicas);

  usuarios.forEach(u => {
    let li = document.createElement("li");
    li.innerHTML = `<span>${u.nome}</span> <strong>${u.musicas} plays</strong>`;
    lista.appendChild(li);
  });
}

// Busca de Artistas (Inteligente)
function buscarArtista() {
  let termoBusca = document.getElementById("busca").value.toLowerCase().trim();
  let resultado = document.getElementById("resultado");
  resultado.innerHTML = "";

  if(termoBusca === "") return;

  usuarios.forEach(u => {
    // Procura o artista ignorando maiúsculas
    for (let nomeArtista in u.artistas) {
      if (nomeArtista.toLowerCase().includes(termoBusca)) {
        let li = document.createElement("li");
        li.innerHTML = `<span>${u.nome}</span> <span>${nomeArtista}: <b>${u.artistas[nomeArtista]}</b></span>`;
        resultado.appendChild(li);
      }
    }
  });
}

// Adicionar Usuário Real
function adicionarUsuario() {
  let input = document.getElementById("nomeUsuario");
  let nome = input.value.trim();

  if(nome === "") {
    alert("Por favor, digite um nome.");
    return;
  }

  usuarios.push({
    nome: nome,
    musicas: Math.floor(Math.random()*2000),
    artistas: { "Arctic Monkeys": Math.floor(Math.random()*500) }
  });

  salvarNoNavegador(); // Salva permanentemente no PC/Celular do usuário
  atualizarRanking();
  input.value = "";
  alert("Usuário adicionado com sucesso!");
}

// Inicia o sistema
atualizarRanking();
