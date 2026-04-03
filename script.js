// DADOS SIMULADOS (Enquanto não usamos a API)
let bancoDeDados = {
  artistas: [
    { nome: "Arctic Monkeys", foto: "https://i.scdn.co/image/ab6761610000e5eb7da39dea0a72f581535fb11f", ouvintes: [
      { nome: "Daniel", plays: 1250, foto: "" },
      { nome: "Lucas", plays: 800, foto: "" }
    ]},
    { nome: "The Weeknd", foto: "https://i.scdn.co/image/ab6761610000e5ebc8b444e05707fdcb72691475", ouvintes: [
      { nome: "Pedro", plays: 2100, foto: "" }
    ]}
  ]
};

// NAVEGAÇÃO
function toggleMenu() { document.getElementById("menu").classList.toggle("active"); }

function mostrar(id) {
  document.querySelectorAll(".aba").forEach(aba => aba.classList.remove("ativa"));
  document.getElementById(id).classList.add("ativa");
  if(document.getElementById("menu").classList.contains("active")) toggleMenu();
}

// CONTADOR
const diffDays = Math.floor((new Date() - new Date("2026-04-03"))/(1000*60*60*24)) + 1;
document.getElementById("contador").innerText = "Dia " + diffDays;

// BUSCA
function buscar(tipo) {
  if(tipo === 'artista') {
    let termo = document.getElementById("input-artista").value.toLowerCase();
    let grid = document.getElementById("resultados-artista");
    grid.innerHTML = "";

    let filtrados = bancoDeDados.artistas.filter(a => a.nome.toLowerCase().includes(termo));
    
    filtrados.forEach(art => {
      let div = document.createElement("div");
      div.className = "card-resultado";
      div.innerHTML = `<img src="${art.foto}"><p>${art.nome}</p>`;
      div.onclick = () => verDetalhes(art);
      grid.appendChild(div);
    });
  }
}

// TELA DE DETALHES
function verDetalhes(artista) {
  document.getElementById("busca-artistas-tela").style.display = "none";
  document.getElementById("detalhe-ranking").style.display = "block";
  
  document.getElementById("nome-foco").innerText = artista.nome;
  document.getElementById("foto-foco").src = artista.foto;
  
  let lista = document.getElementById("lista-ranking-detalhado");
  lista.innerHTML = "";
  
  artista.ouvintes.forEach(u => {
    let li = document.createElement("li");
    li.innerHTML = `<div class="mini-foto"></div> <div><b>${u.nome}</b><br><small>${u.plays} plays</small></div>`;
    lista.appendChild(li);
  });
}

function voltarParaBusca() {
  document.getElementById("busca-artistas-tela").style.display = "block";
  document.getElementById("detalhe-ranking").style.display = "none";
}

// PERFIL (LOCALSTORAGE)
function adicionarUsuario() {
  let nome = document.getElementById("nomeUsuario").value;
  let foto = document.getElementById("fotoUsuario").value || "https://via.placeholder.com/100";

  if(!nome) return alert("Digite um nome!");

  let perfil = { nome, foto };
  localStorage.setItem('meuPerfil', JSON.stringify(perfil));
  renderizarPerfil();
}

function renderizarPerfil() {
  let salvo = JSON.parse(localStorage.getItem('meuPerfil'));
  if(salvo) {
    document.getElementById("form-perfil").style.display = "none";
    document.getElementById("dados-perfil").style.display = "block";
    document.getElementById("nome-perfil-display").innerText = salvo.nome;
    document.getElementById("img-perfil-display").src = salvo.foto;
  }
}

function resetarPerfil() {
  localStorage.removeItem('meuPerfil');
  document.getElementById("form-perfil").style.display = "block";
  document.getElementById("dados-perfil").style.display = "none";
}

// Iniciar
renderizarPerfil();
