function toggleMenu() {
  document.getElementById("menu").classList.toggle("active");
}

function mostrar(id) {
  document.querySelectorAll(".aba").forEach(sec => sec.classList.remove("ativa"));
  document.getElementById(id).classList.add("ativa");
}

// contador
const startDate = new Date("2026-04-03");
const today = new Date();
const diffDays = Math.floor((today - startDate)/(1000*60*60*24)) + 1;
document.getElementById("contador").innerText = "Dia " + diffDays;

// dados fake
let usuarios = [
  { nome: "Pedro", musicas: 1200, artistas: { "Arctic Monkeys": 300 } },
  { nome: "Lucas", musicas: 900, artistas: { "Arctic Monkeys": 150 } }
];

// ranking músicas
function atualizarRanking() {
  let lista = document.getElementById("lista-musicas");
  lista.innerHTML = "";

  usuarios.sort((a,b) => b.musicas - a.musicas);

  usuarios.forEach(u => {
    let li = document.createElement("li");
    li.innerText = `${u.nome} - ${u.musicas} plays`;
    lista.appendChild(li);
  });
}

atualizarRanking();

// busca artista
function buscarArtista() {
  let nome = document.getElementById("busca").value;
  let resultado = document.getElementById("resultado");
  resultado.innerHTML = "";

  usuarios.forEach(u => {
    if(u.artistas[nome]) {
      let li = document.createElement("li");
      li.innerText = `${u.nome} - ${u.artistas[nome]} plays`;
      resultado.appendChild(li);
    }
  });
}

// adicionar usuário
function adicionarUsuario() {
  let nome = document.getElementById("nomeUsuario").value;

  usuarios.push({
    nome: nome,
    musicas: Math.floor(Math.random()*1000),
    artistas: { "Arctic Monkeys": Math.floor(Math.random()*300) }
  });

  atualizarRanking();
  alert("Usuário adicionado!");
}
