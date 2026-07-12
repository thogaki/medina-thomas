const weddingDate = new Date("2027-06-05T00:00:00+02:00");

const nodes = {
  days: document.getElementById("days"),
  hours: document.getElementById("hours"),
  minutes: document.getElementById("minutes"),
  seconds: document.getElementById("seconds")
};

function updateCountdown() {
  const now = new Date();
  const distance = weddingDate - now;

  if (distance <= 0) {
    document.querySelector(".countdown").innerHTML =
      "<div style='grid-column:1/-1'><strong>Heute ist es so weit!</strong><span>Wir freuen uns auf euch</span></div>";
    return;
  }

  const days = Math.floor(distance / 86400000);
  const hours = Math.floor((distance % 86400000) / 3600000);
  const minutes = Math.floor((distance % 3600000) / 60000);
  const seconds = Math.floor((distance % 60000) / 1000);

  nodes.days.textContent = String(days).padStart(3, "0");
  nodes.hours.textContent = String(hours).padStart(2, "0");
  nodes.minutes.textContent = String(minutes).padStart(2, "0");
  nodes.seconds.textContent = String(seconds).padStart(2, "0");
}

updateCountdown();
setInterval(updateCountdown, 1000);

const googleUrl = new URL("https://calendar.google.com/calendar/render");
googleUrl.searchParams.set("action", "TEMPLATE");
googleUrl.searchParams.set("text", "Hochzeit Medina & Thomas");
googleUrl.searchParams.set("dates", "20270605/20270606");
googleUrl.searchParams.set("details", "Save the Date – weitere Informationen folgen mit der Einladung.");
document.getElementById("googleCalendar").href = googleUrl.toString();

window.addEventListener("load", () => {
  setTimeout(() => {
    const intro = document.getElementById("intro");
    if (intro) intro.remove();
  }, 3300);
});
