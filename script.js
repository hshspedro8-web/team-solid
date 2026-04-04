import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getFirestore, collection, addDoc, getDocs, query, where, setDoc, doc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

// SUAS CONFIGURAÇÕES
const firebaseConfig = {
  apiKey: "AIzaSyA_PjE980jAKIFIKa91vo7pzFd9QFTgW4c",
  authDomain: "ranking-musical-ac627.firebaseapp.com",
  projectId: "ranking-musical-ac627",
  storageBucket: "ranking-musical-ac627.firebasestorage.app",
  messagingSenderId: "218773797040",
  appId: "1:218773797040:web:dc9e0393732dc5d7992375"
};
const LASTFM_API_KEY = "decb10bb68c8e25872cf43e730a6a655";

// Inicializar Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// --- NAVEGAÇÃO ---
window.toggleMenu = () => document.getElementById("menu").classList.toggle("active");
window.mostrar = (id) => {
  document.querySelectorAll(".aba").forEach(aba => aba.classList.remove("ativa"));
  document.getElementById(id).classList.add("ativa");
  const menu = document.getElementById("menu");
  if(menu.classList.contains("active")) window.toggleMenu();
};

// --- CONTADOR ---
const startDate = new Date("2026-04-03");
const diffDays = Math.floor((new Date() - startDate)/(1000*60*60*24)) + 1;
document.getElementById("contador").innerText = "Dia " + diffDays;

// --- BUSCA REAL NO LAST.FM ---
window.buscarNoLastFM = async () => {
  const artista = document.getElementById("input-artista").value;
  if(!artista) return;

  const url = `https://ws.audioscrobbler.com/2.0/?method=artist.search&artist=${artista}&api_key=${LASTFM_API_KEY}&format=json&limit=6`;
  
  try {
    const response = await fetch(url);
    const data = await response.json();
    const artistas = data.results.artistmatches.artist;
    
    const grid = document.getElementById("resultados-artista");
    grid.innerHTML = "";

    artistas.forEach(art => {
      let div = document.createElement("div");
      div.className = "card-resultado";
      // O Last.fm não envia fotos boas na busca por limitações da API, vamos usar um truque de imagem depois
      div.innerHTML = `<img src="https://ui-avatars.com/api/?name=${art.name}&background=ba0000&color=fff"><p>${art.name}</p>`;
      div.onclick = () => window.verDetalhesArtista(art.name);
      grid.appendChild(div);
    });
  } catch (e) { console.error("Erro na busca", e); }
};

// --- RANKING REAL (FIRESTORE) ---
window.verDetalhesArtista = async (nomeArtista) => {
  document.getElementById("busca-artistas-tela").style.display = "none";
  document.getElementById("detalhe-ranking").style.display = "block";
  document.getElementById("nome-foco").innerText = nomeArtista;
  document.getElementById("foto-foco").src = `https://ui-avatars.com/api/?name=${nomeArtista}&background=ba0000&color=fff`;

  const lista = document.getElementById("lista-ranking-detalhado");
  lista.innerHTML = "<li>Carregando ranking...</li>";

  // Buscar no Firebase quem ouve esse artista
  const q = query(collection(db, "usuarios"));
  const querySnapshot = await getDocs(q);
  
  let ouvintes = [];
  
  // Para cada usuário do site, vamos ver se ele ouve esse artista no Last.fm
  for (const docUser of querySnapshot.docs) {
    const user = docUser.data();
    const url = `https://ws.audioscrobbler.com/2.0/?method=artist.getinfo&artist=${nomeArtista}&username=${user.username}&api_key=${LASTFM_API_KEY}&format=json`;
    
    const res = await fetch(url);
    const data = await res.json();
    
    if(data.artist && data.artist.stats.userplaycount > 0) {
      ouvintes.push({
        nome: user.username,
        foto: user.foto,
        plays: parseInt(data.artist.stats.userplaycount)
      });
    }
  }

  lista.innerHTML = "";
  ouvintes.sort((a,b) => b.plays - a.plays).forEach(u => {
    let li = document.createElement("li");
    li.innerHTML = `<img src="${u.foto}" class="mini-foto"> <div><b>${u.nome}</b><br><small>${u.plays} plays</small></div>`;
    lista.appendChild(li);
  });
};

window.voltarParaBusca = () => {
  document.getElementById("busca-artistas-tela").style.display = "block";
  document.getElementById("detalhe-ranking").style.display = "none";
};

// --- SALVAR PERFIL NO FIREBASE ---
window.salvarPerfilFirebase = async () => {
  const username = document.getElementById("userLastFM").value;
  if(!username) return alert("Digite seu usuário!");

  // Buscar info do usuário no Last.fm
  const url = `https://ws.audioscrobbler.com/2.0/?method=user.getinfo&user=${username}&api_key=${LASTFM_API_KEY}&format=json`;
  
  try {
    const res = await fetch(url);
    const data = await res.json();
    
    if(data.error) return alert("Usuário não encontrado no Last.fm");

    const perfil = {
      username: data.user.name,
      foto: data.user.image[2]['#text'] || `https://ui-avatars.com/api/?name=${data.user.name}`,
      scrobbles: data.user.playcount
    };

    // Salvar no Firebase
    await setDoc(doc(db, "usuarios", perfil.username), perfil);
    localStorage.setItem('meuPerfil', JSON.stringify(perfil));
    renderizarPerfil();
  } catch (e) { alert("Erro ao conectar"); }
};

function renderizarPerfil() {
  const salvo = JSON.parse(localStorage.getItem('meuPerfil'));
  if(salvo) {
    document.getElementById("form-perfil").style.display = "none";
    document.getElementById("dados-perfil").style.display = "block";
    document.getElementById("nome-perfil-display").innerText = salvo.username;
    document.getElementById("img-perfil-display").src = salvo.foto;
    document.getElementById("total-scrobbles").innerText = salvo.scrobbles + " plays totais";
  }
}

window.resetarPerfil = () => {
  localStorage.removeItem('meuPerfil');
  location.reload();
};

renderizarPerfil();
