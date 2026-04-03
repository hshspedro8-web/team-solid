===== script.js =====
function toggleMenu() {
  document.getElementById("menu").classList.toggle("active");
}

const startDate = new Date("2026-04-03");
const today = new Date();

const diffTime = today - startDate;
const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24)) + 1;

document.getElementById("contador").innerText = "Dia " + diffDays;
