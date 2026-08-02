const observerFade = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add("visible");
      observerFade.unobserve(entry.target);
    }
  });
}, { threshold: 0.2 });

document.querySelectorAll(".fade-in, .saludos-header, .saludo-teaser")
  .forEach(el => observerFade.observe(el));

// Igualar la altura de las tarjetas de saludo (para que la franja azul
// del título quede a la misma altura en las tres, aunque las fotos
// tengan proporciones distintas)
function igualarAlturasSaludos() {
  const tarjetas = document.querySelectorAll(".saludo-teaser");
  if (!tarjetas.length) return;

  tarjetas.forEach(t => { t.style.height = "auto"; });

  const esApilado = window.matchMedia("(max-width: 860px)").matches;
  if (esApilado) return;

  let maxAltura = 0;
  tarjetas.forEach(t => {
    maxAltura = Math.max(maxAltura, t.getBoundingClientRect().height);
  });
  tarjetas.forEach(t => { t.style.height = maxAltura + "px"; });
}

window.addEventListener("load", igualarAlturasSaludos);
window.addEventListener("resize", igualarAlturasSaludos);

document.querySelectorAll(".saludo-teaser-img img").forEach(img => {
  if (img.complete) {
    igualarAlturasSaludos();
  } else {
    img.addEventListener("load", igualarAlturasSaludos);
  }
});

igualarAlturasSaludos();

// Ventana grande de cada saludo
const backdrop = document.getElementById("saludoBackdrop");
const modales = document.querySelectorAll(".saludo-modal");

function abrirSaludo(id) {
  const modal = document.getElementById(id);
  if (!modal) return;
  modales.forEach(m => m.classList.remove("abierto"));
  modal.classList.add("abierto");
  if (backdrop) backdrop.classList.add("visible");
  document.body.classList.add("saludo-modal-abierto");
}

function cerrarSaludos() {
  modales.forEach(m => m.classList.remove("abierto"));
  if (backdrop) backdrop.classList.remove("visible");
  document.body.classList.remove("saludo-modal-abierto");
}

document.querySelectorAll(".saludo-teaser").forEach(boton => {
  boton.addEventListener("click", () => abrirSaludo(boton.dataset.target));
});

document.querySelectorAll(".saludo-cerrar").forEach(boton => {
  boton.addEventListener("click", cerrarSaludos);
});

if (backdrop) backdrop.addEventListener("click", cerrarSaludos);

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") cerrarSaludos();
});
