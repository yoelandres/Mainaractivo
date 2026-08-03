const FECHA_REVELACION_PREGONERO = new Date("2026-08-03T18:14:00");

// Ruta real de la foto codificada en Base64 para que no aparezca en texto
// plano en el código fuente mientras el pregonero sigue en secreto.
// (Nota: esto solo evita que se vea "a simple vista" al inspeccionar; no es
// una protección real frente a alguien que sepa decodificar Base64).
const FOTO_CODIFICADA = "aW1nL3ByZWdvbmVyby00ZjlhMjFrNy5qcGc=";

const elBloqueo = document.getElementById("pregoneroBloqueo");
const elRevelado = document.getElementById("pregoneroRevelado");
const elDias = document.getElementById("pcDias");
const elHoras = document.getElementById("pcHoras");
const elMinutos = document.getElementById("pcMinutos");
const elSegundos = document.getElementById("pcSegundos");
const foto = document.getElementById("pregoneroFoto");
const capaOculta = document.getElementById("pregoneroOculto");

let intervaloCuenta = null;
let fotoCargada = false;

function cargarFotoReal() {
  if (fotoCargada || !foto) return;
  fotoCargada = true;
  foto.src = atob(FOTO_CODIFICADA);
}

function mostrarBloqueado() {
  if (elBloqueo) elBloqueo.hidden = false;
  if (elRevelado) elRevelado.hidden = true;
  if (capaOculta) capaOculta.classList.remove("oculto");
}

function revelarPregonero() {
  cargarFotoReal();
  if (capaOculta) capaOculta.classList.add("oculto");
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

iniciarPregonero();

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
