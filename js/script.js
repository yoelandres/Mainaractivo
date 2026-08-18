const fechaObjetivo = new Date("2026-08-13T00:00:00");
const fraseFinal = "¡GRACIAS POR TODO, NOS VEMOS EL AÑO QUE VIENE!";

function actualizarContador() {
  const ahora = new Date();
  const diferencia = fechaObjetivo - ahora;
  const contador = document.getElementById("contador");
  if (!contador) return;

  if (diferencia <= 0) {
    contador.textContent = fraseFinal;
    return;
  }

  const dias = Math.floor(diferencia / (1000 * 60 * 60 * 24));
  const horas = Math.floor((diferencia % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutos = Math.floor((diferencia % (1000 * 60 * 60)) / (1000 * 60));
  const segundos = Math.floor((diferencia % (1000 * 60)) / 1000);

  contador.textContent = `${dias}d ${horas}h ${minutos}m ${segundos}s`;
}

setInterval(actualizarContador, 1000);
actualizarContador();

const navPrincipal = document.getElementById("navPrincipal");

function actualizarAlturaNav() {
  if (!navPrincipal) return;
  document.documentElement.style.setProperty("--nav-height", navPrincipal.offsetHeight + "px");
}

function actualizarNav() {
  if (!navPrincipal) return;
  if (window.scrollY > 60) {
    navPrincipal.classList.add("encogido");
  } else {
    navPrincipal.classList.remove("encogido");
  }
  actualizarAlturaNav();
}

window.addEventListener("scroll", actualizarNav, { passive: true });
window.addEventListener("resize", actualizarAlturaNav);
actualizarNav();
actualizarAlturaNav();

const enlacesDias = document.querySelectorAll(".dia-link");
const secciones = document.querySelectorAll(".dia");

if (enlacesDias.length && secciones.length) {
  const spyObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute("id");
        enlacesDias.forEach(a => a.classList.remove("activo"));
        const activo = document.querySelector(`.dia-link[href="#${id}"]`);
        if (activo) activo.classList.add("activo");
      }
    });
  }, { threshold: 0.4, rootMargin: "-120px 0px -50% 0px" });

  secciones.forEach(sec => spyObserver.observe(sec));
}

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add("visible");
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.15 });

document.querySelectorAll("nav.nav-princ li, .dia, .acto, .footer-mainar, .fade-in, .divisor-skyline")
  .forEach(el => observer.observe(el));

document.querySelectorAll(".acto").forEach(acto => {
  const cabecera = acto.querySelector(".acto-cabecera");
  if (!cabecera) return;
  cabecera.addEventListener("click", () => acto.classList.toggle("abierto"));
});

const fotosSorpresa = [
  { archivo: "img/GymkanaFotografica1.jpeg", fecha: "2026-08-13T20:00:00" },
  { archivo: "img/GymkanaFotografica2.jpeg", fecha: "2026-08-14T09:00:00" },
  { archivo: "img/GymkanaFotografica3.jpeg", fecha: "2026-08-15T09:00:00" },
  { archivo: "img/GymkanaFotografica4.jpeg", fecha: "2026-08-16T09:00:00" },
  { archivo: "img/GymkanaFotografica5.jpeg", fecha: "2026-08-17T09:00:00" }
];

const sorpresaGrid = document.getElementById("sorpresaGrid");
const estadoSorpresas = {};

function renderSorpresas() {
  if (!sorpresaGrid) return;
  const ahora = new Date();

  fotosSorpresa.forEach((foto, indice) => {
    const fechaDesbloqueo = new Date(foto.fecha);
    const desbloqueada = ahora >= fechaDesbloqueo;
    const idTarjeta = `sorpresa-${indice}`;

    let tarjeta = document.getElementById(idTarjeta);
    if (!tarjeta) {
      tarjeta = document.createElement("div");
      tarjeta.id = idTarjeta;
      sorpresaGrid.appendChild(tarjeta);
    }

    const estabaDesbloqueadaAntes = estadoSorpresas[idTarjeta] === true;
    tarjeta.className = "sorpresa-tarjeta " + (desbloqueada ? "desbloqueada" : "bloqueada");

    if (desbloqueada) {
      tarjeta.innerHTML = "";
      const img = document.createElement("img");
      img.src = foto.archivo;
      img.alt = `Foto sorpresa ${indice + 1}`;
      tarjeta.appendChild(img);
      tarjeta.onclick = () => abrirLightbox(foto.archivo, img.alt);

      if (!estabaDesbloqueadaAntes) {
        tarjeta.classList.add("recien-desbloqueada");
        setTimeout(() => tarjeta.classList.remove("recien-desbloqueada"), 1200);
      }
    } else {
      tarjeta.innerHTML = "";
      const candado = document.createElement("div");
      candado.className = "sorpresa-candado";
      candado.textContent = "🔒";
      const fechaTexto = document.createElement("p");
      fechaTexto.className = "sorpresa-fecha";
      fechaTexto.textContent = fechaDesbloqueo.toLocaleDateString("es-ES", { day: "numeric", month: "long" });
      tarjeta.appendChild(candado);
      tarjeta.appendChild(fechaTexto);
      tarjeta.onclick = null;
    }

    estadoSorpresas[idTarjeta] = desbloqueada;
  });
}

renderSorpresas();
setInterval(renderSorpresas, 5000);

const lightbox = document.getElementById("lightbox");
const lightboxImg = document.getElementById("lightboxImg");
const lightboxCerrar = document.getElementById("lightboxCerrar");

function abrirLightbox(src, alt) {
  if (!lightbox || !lightboxImg) return;
  lightboxImg.src = src;
  lightboxImg.alt = alt || "";
  lightbox.classList.add("visible");
}

function cerrarLightbox() {
  if (!lightbox) return;
  lightbox.classList.remove("visible");
}

if (lightboxCerrar) lightboxCerrar.addEventListener("click", cerrarLightbox);
if (lightbox) {
  lightbox.addEventListener("click", (e) => {
    if (e.target === lightbox) cerrarLightbox();
  });
}

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") cerrarLightbox();
});
