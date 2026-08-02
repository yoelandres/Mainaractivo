const FECHA_REVELACION_PREGONERO = new Date("2026-08-13T19:00:00");


const elBloqueo = document.getElementById("pregoneroBloqueo");
const elRevelado = document.getElementById("pregoneroRevelado");
const elDias = document.getElementById("pcDias");
const elHoras = document.getElementById("pcHoras");
const elMinutos = document.getElementById("pcMinutos");
const elSegundos = document.getElementById("pcSegundos");
const foto = document.getElementById("pregoneroFoto");
const canvasPixel = document.getElementById("pregoneroPixelado");
const ctxPixel = canvasPixel ? canvasPixel.getContext("2d") : null;

let intervaloCuenta = null;

function pixelarFoto() {
  if (!ctxPixel || !foto.complete || !foto.naturalWidth) return;

  const w = canvasPixel.clientWidth;
  const h = canvasPixel.clientHeight;
  if (!w || !h) return;

  canvasPixel.width = w;
  canvasPixel.height = h;

  const factor = 0.045;
  const mini = document.createElement("canvas");
  mini.width = Math.max(1, Math.round(w * factor));
  mini.height = Math.max(1, Math.round(h * factor));

  const ctxMini = mini.getContext("2d");
  ctxMini.drawImage(foto, 0, 0, mini.width, mini.height);

  ctxPixel.imageSmoothingEnabled = false;
  ctxPixel.drawImage(mini, 0, 0, mini.width, mini.height, 0, 0, w, h);
}

function mostrarBloqueado() {
  if (elBloqueo) elBloqueo.hidden = false;
  if (elRevelado) elRevelado.hidden = true;
  if (canvasPixel) canvasPixel.classList.remove("oculto");
  pixelarFoto();
}

function revelarPregonero() {
  if (canvasPixel) canvasPixel.classList.add("oculto");
  if (elBloqueo) elBloqueo.hidden = true;
  if (elRevelado) elRevelado.hidden = false;
  if (intervaloCuenta) {
    clearInterval(intervaloCuenta);
    intervaloCuenta = null;
  }
}

function actualizarCuentaAtras() {
  const ahora = new Date();
  const diferencia = FECHA_REVELACION_PREGONERO - ahora;

  if (diferencia <= 0) {
    revelarPregonero();
    return;
  }

  const dias = Math.floor(diferencia / (1000 * 60 * 60 * 24));
  const horas = Math.floor((diferencia % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutos = Math.floor((diferencia % (1000 * 60 * 60)) / (1000 * 60));
  const segundos = Math.floor((diferencia % (1000 * 60)) / 1000);

  if (elDias) elDias.textContent = String(dias).padStart(2, "0");
  if (elHoras) elHoras.textContent = String(horas).padStart(2, "0");
  if (elMinutos) elMinutos.textContent = String(minutos).padStart(2, "0");
  if (elSegundos) elSegundos.textContent = String(segundos).padStart(2, "0");
}

function iniciarPregonero() {
  if (FECHA_REVELACION_PREGONERO - new Date() <= 0) {
    revelarPregonero();
    return;
  }

  mostrarBloqueado();
  actualizarCuentaAtras();
  intervaloCuenta = setInterval(actualizarCuentaAtras, 1000);
}

if (foto) {
  if (foto.complete) {
    iniciarPregonero();
  } else {
    foto.addEventListener("load", iniciarPregonero);
  }
}

window.addEventListener("resize", () => {
  if (elBloqueo && !elBloqueo.hidden) pixelarFoto();
});

// Animación de entrada (igual que en el resto del sitio)
const observerFade = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add("visible");
      observerFade.unobserve(entry.target);
    }
  });
}, { threshold: 0.2 });

document.querySelectorAll(".fade-in, .pregonero-img, .pregonero-info")
  .forEach(el => observerFade.observe(el));
