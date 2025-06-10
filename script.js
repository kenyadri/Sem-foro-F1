let form = document.getElementById("playerForm");
let game = document.getElementById("game");
let lights = [1,2,3,4,5].map(i => document.getElementById("l" + i));
let msg = document.getElementById("msg");
let ranking = document.getElementById("ranking");

let startTime, ready = false;

form.addEventListener("submit", function(e) {
    e.preventDefault();
    form.style.display = "none";
    game.style.display = "block";
    startSequence();
});

function startSequence() {
    lights.forEach(l => l.classList.remove("on"));
    msg.textContent = "Prepárate...";

    // Encender luces una por una cada 1 segundo
    lights.forEach((light, i) => {
        setTimeout(() => light.classList.add("on"), i * 1000);
    });

    // Apagar todas después de tiempo aleatorio (2 a 4s después del último encendido)
    let randomDelay = Math.floor(Math.random() * 3000) + 2000;
    setTimeout(() => {
        lights.forEach(l => l.classList.remove("on"));
        msg.textContent = "¡YA!";
        startTime = new Date().getTime();
        ready = true;
    }, 5000 + randomDelay);
}

document.body.addEventListener("click", () => {
    if (!ready) return;

    let reactionTime = new Date().getTime() - startTime;
    msg.textContent = `⏱️ Tiempo de reacción: ${reactionTime} ms`;
    ready = false;

    // Guardar en ranking local
    const name = document.getElementById("playerName").value;
    const score = { name, reactionTime };
    const scores = JSON.parse(localStorage.getItem("scores") || "[]");
    scores.push(score);
    scores.sort((a, b) => a.reactionTime - b.reactionTime);
    localStorage.setItem("scores", JSON.stringify(scores.slice(0, 5)));
    renderRanking();
});

function renderRanking() {
    const scores = JSON.parse(localStorage.getItem("scores") || "[]");
    ranking.innerHTML = "";
    scores.forEach(s => {
        let li = document.createElement("li");
        li.textContent = `${s.name}: ${s.reactionTime} ms`;
        ranking.appendChild(li);
    });
}

renderRanking();
