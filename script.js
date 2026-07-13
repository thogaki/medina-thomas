const weddingDate = new Date("2027-06-05T00:00:00+02:00");

const parts = {
  days: document.getElementById("days"),
  hours: document.getElementById("hours"),
  minutes: document.getElementById("minutes"),
  seconds: document.getElementById("seconds"),
};

function updateCountdown() {
  const now = new Date();
  let diff = weddingDate.getTime() - now.getTime();

  if (diff <= 0) {
    Object.values(parts).forEach((el) => (el.textContent = "00"));
    parts.days.textContent = "0";
    return;
  }

  const days = Math.floor(diff / 86400000);
  diff %= 86400000;
  const hours = Math.floor(diff / 3600000);
  diff %= 3600000;
  const minutes = Math.floor(diff / 60000);
  const seconds = Math.floor((diff % 60000) / 1000);

  parts.days.textContent = String(days);
  parts.hours.textContent = String(hours).padStart(2, "0");
  parts.minutes.textContent = String(minutes).padStart(2, "0");
  parts.seconds.textContent = String(seconds).padStart(2, "0");
}

updateCountdown();
setInterval(updateCountdown, 1000);

// Google Calendar – bewusst ohne Ort.
const googleParams = new URLSearchParams({
  action: "TEMPLATE",
  text: "Hochzeit Medina & Thomas",
  dates: "20270605/20270606",
  details: "Save the Date – weitere Informationen folgen mit der Einladung."
});
document.getElementById("google-link").href =
  "https://calendar.google.com/calendar/render?" + googleParams.toString();

// Apple / Outlook / iPhone: lokale ICS-Datei.
document.getElementById("ics-button").addEventListener("click", () => {
  const ics = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Medina und Thomas//Save the Date//DE",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    "BEGIN:VEVENT",
    "UID:20270605-medina-thomas@medina-thomas.de",
    "DTSTAMP:20260713T000000Z",
    "DTSTART;VALUE=DATE:20270605",
    "DTEND;VALUE=DATE:20270606",
    "SUMMARY:Hochzeit Medina & Thomas",
    "DESCRIPTION:Save the Date – weitere Informationen folgen mit der Einladung.",
    "STATUS:CONFIRMED",
    "TRANSP:TRANSPARENT",
    "END:VEVENT",
    "END:VCALENDAR"
  ].join("\r\n");

  const blob = new Blob([ics], { type: "text/calendar;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "medina-und-thomas-05-06-2027.ics";
  document.body.appendChild(link);
  link.click();
  link.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
});

// Dezenter Sternenhimmel ohne externe Bibliothek.
const canvas = document.getElementById("stars");
const ctx = canvas.getContext("2d");
let stars = [];
let dpr = Math.min(window.devicePixelRatio || 1, 2);
let shootingStar = null;

function resizeStars() {
  dpr = Math.min(window.devicePixelRatio || 1, 2);
  canvas.width = Math.floor(innerWidth * dpr);
  canvas.height = Math.floor(innerHeight * dpr);
  canvas.style.width = innerWidth + "px";
  canvas.style.height = innerHeight + "px";
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

  const count = Math.max(55, Math.floor((innerWidth * innerHeight) / 15000));
  stars = Array.from({ length: count }, () => ({
    x: Math.random() * innerWidth,
    y: Math.random() * innerHeight,
    r: Math.random() * 1.25 + 0.2,
    a: Math.random() * 0.55 + 0.15,
    v: Math.random() * 0.012 + 0.004,
    phase: Math.random() * Math.PI * 2
  }));
}

function launchShootingStar() {
  shootingStar = {
    x: innerWidth * (0.55 + Math.random() * 0.35),
    y: innerHeight * (0.05 + Math.random() * 0.25),
    life: 1
  };
  setTimeout(launchShootingStar, 9000 + Math.random() * 13000);
}

function drawStars(t) {
  ctx.clearRect(0, 0, innerWidth, innerHeight);

  stars.forEach((s) => {
    const alpha = s.a + Math.sin(t * s.v + s.phase) * 0.18;
    ctx.beginPath();
    ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(245,229,170,${Math.max(0.05, alpha)})`;
    ctx.fill();
  });

  if (shootingStar) {
    shootingStar.x -= 7;
    shootingStar.y += 3;
    shootingStar.life -= 0.025;

    const gradient = ctx.createLinearGradient(
      shootingStar.x,
      shootingStar.y,
      shootingStar.x + 90,
      shootingStar.y - 38
    );
    gradient.addColorStop(0, `rgba(255,245,205,${shootingStar.life})`);
    gradient.addColorStop(1, "rgba(255,245,205,0)");

    ctx.beginPath();
    ctx.moveTo(shootingStar.x, shootingStar.y);
    ctx.lineTo(shootingStar.x + 90, shootingStar.y - 38);
    ctx.strokeStyle = gradient;
    ctx.lineWidth = 1.2;
    ctx.stroke();

    if (shootingStar.life <= 0) shootingStar = null;
  }

  requestAnimationFrame(drawStars);
}

resizeStars();
addEventListener("resize", resizeStars, { passive: true });

if (!matchMedia("(prefers-reduced-motion: reduce)").matches) {
  requestAnimationFrame(drawStars);
  setTimeout(launchShootingStar, 4500);
} else {
  drawStars(0);
}
