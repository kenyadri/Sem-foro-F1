const form = document.getElementById('playerForm');
const game = document.getElementById('game');
const msg = document.getElementById('msg');
const lights = ['l1','l2','l3','l4'].map(id => document.getElementById(id));
const rankingList = document.getElementById('ranking');

let startTime, canClick = false;
let nickname = "", email = "";

form.addEventListener('submit', (e) => {
  e.preventDefault();
  nickname = document.getElementById('nickname').value;
  email = document.getElementById('email').value;
  form.style.display = 'none';
  game.style.display = 'block';
  startSemaforo();
});

function startSemaforo() {
  msg.textContent = "Listo en...";
  lights.forEach(l => { l.classList.remove('on'); });
  
  const base = 500;
  const interval = 800;
  const rndExtra = Math.random() * 2000; // entre 0 y 2000 ms extra
  const totalDelay = base + rndExtra;

  // encender rojos secuenciales
  lights.slice(0,3).forEach((l, i) => {
    setTimeout(() => {
      l.classList.add('on');
    }, base + i * interval);
  });

  // encender verde al final
  setTimeout(() => {
    lights[3].classList.add('on');
    msg.textContent = "¡YA!";
    canClick = true;
    startTime = performance.now();
  }, totalDelay + 2 * interval);
}

game.addEventListener('click', () => {
  if (!canClick) {
    msg.textContent = "¡Te adelantaste!";
    setTimeout(() => location.reload(), 1500);
    return;
  }

  const reactionTime = (performance.now() - startTime).toFixed(2);
  msg.textContent = `Tu tiempo: ${reactionTime} ms`;

  saveResult(nickname, reactionTime);
  showRanking();
  canClick = false;
});

function saveResult(name, time) {
  const scores = JSON.parse(localStorage.getItem("ranking") || "[]");
  scores.push({ name, time: parseFloat(time), email });
  scores.sort((a,b) => a.time - b.time);
  localStorage.setItem("ranking", JSON.stringify(scores.slice(0,10)));
}

function showRanking() {
  const scores = JSON.parse(localStorage.getItem("ranking") || "[]");
  rankingList.innerHTML = "";
  scores.forEach((s, idx) => {
    rankingList.innerHTML += `<li>#${idx+1} - ${s.name}: ${s.time} ms</li>`;
  });
}

showRanking();
