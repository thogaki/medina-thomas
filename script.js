const weddingDate = new Date("2027-06-05T00:00:00+02:00");

const nodes = {
  days: document.getElementById("days"),
  hours: document.getElementById("hours"),
  minutes: document.getElementById("minutes"),
  seconds: document.getElementById("seconds")
};

function updateCountdown() {
  const distance = weddingDate.getTime() - Date.now();

  if (distance <= 0) {
    document.querySelector(".countdown").innerHTML =
      "<div style='grid-column:1/-1;border:0'><strong>Heute ist es so weit!</strong><span>Wir freuen uns auf euch</span></div>";
    return;
  }

  const day = 86400000;
  const hour = 3600000;
  const minute = 60000;

  nodes.days.textContent = String(Math.floor(distance / day)).padStart(3, "0");
  nodes.hours.textContent = String(Math.floor((distance % day) / hour)).padStart(2, "0");
  nodes.minutes.textContent = String(Math.floor((distance % hour) / minute)).padStart(2, "0");
  nodes.seconds.textContent = String(Math.floor((distance % minute) / 1000)).padStart(2, "0");
}

updateCountdown();
setInterval(updateCountdown, 1000);

const googleUrl = new URL("https://calendar.google.com/calendar/render");
googleUrl.searchParams.set("action", "TEMPLATE");
googleUrl.searchParams.set("text", "Hochzeit Medina & Thomas");
googleUrl.searchParams.set("dates", "20270605/20270606");
googleUrl.searchParams.set("details", "Save the Date – alle weiteren Informationen folgen mit der Einladung.");
document.getElementById("googleCalendar").href = googleUrl.toString();

window.addEventListener("load", () => {
  setTimeout(() => document.getElementById("intro")?.remove(), 3500);
});

const canvas = document.getElementById("stars");
const ctx = canvas.getContext("2d");
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
let stars = [];
let frameId;

function resizeStars() {
  const ratio = Math.min(window.devicePixelRatio || 1, 2);
  canvas.width = Math.floor(window.innerWidth * ratio);
  canvas.height = Math.floor(window.innerHeight * ratio);
  canvas.style.width = window.innerWidth + "px";
  canvas.style.height = window.innerHeight + "px";
  ctx.setTransform(ratio, 0, 0, ratio, 0, 0);

  const count = Math.max(55, Math.floor(window.innerWidth / 13));
  stars = Array.from({ length: count }, () => ({
    x: Math.random() * window.innerWidth,
    y: Math.random() * window.innerHeight,
    r: Math.random() * 1.3 + .25,
    a: Math.random() * .65 + .12,
    phase: Math.random() * Math.PI * 2,
    speed: Math.random() * .004 + .001
  }));
}

function drawStars(time = 0) {
  ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

  for (const s of stars) {
    const alpha = reduceMotion ? s.a : s.a + Math.sin(time * s.speed + s.phase) * .2;
    ctx.beginPath();
    ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(255,255,255,${Math.max(.05, alpha)})`;
    ctx.fill();

    if (s.r > 1.15) {
      ctx.beginPath();
      ctx.moveTo(s.x - 4, s.y);
      ctx.lineTo(s.x + 4, s.y);
      ctx.moveTo(s.x, s.y - 4);
      ctx.lineTo(s.x, s.y + 4);
      ctx.strokeStyle = `rgba(224,194,110,${Math.max(.04, alpha * .65)})`;
      ctx.lineWidth = .5;
      ctx.stroke();
    }
  }

  if (!reduceMotion) frameId = requestAnimationFrame(drawStars);
}

resizeStars();
drawStars();

window.addEventListener("resize", () => {
  cancelAnimationFrame(frameId);
  resizeStars();
  drawStars();
});
