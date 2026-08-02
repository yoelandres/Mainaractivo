function cerrarMenu(nav) {
  if (!nav) return;
  nav.classList.remove("abierto");
  document.body.classList.remove("menu-abierto");
  const boton = nav.querySelector(".nav-toggle");
  if (boton) boton.setAttribute("aria-expanded", "false");
  cerrarSubmenus(nav);
}

function cerrarSubmenus(nav) {
  if (!nav) return;
  nav.querySelectorAll(".nav-item-dropdown.submenu-abierto").forEach(item => {
    item.classList.remove("submenu-abierto");
    const toggle = item.querySelector(".nav-dropdown-toggle");
    if (toggle) toggle.setAttribute("aria-expanded", "false");
  });
}

document.querySelectorAll(".nav-toggle").forEach(boton => {
  boton.addEventListener("click", (e) => {
    e.stopPropagation();
    const nav = boton.closest("nav.nav-princ");
    if (!nav) return;
    const abierto = nav.classList.toggle("abierto");
    boton.setAttribute("aria-expanded", abierto ? "true" : "false");
    document.body.classList.toggle("menu-abierto", abierto);
    if (!abierto) cerrarSubmenus(nav);
  });
});

// Desplegables del menú (PROGRAMA, SALUDOS...): en escritorio se abren con
// :hover por CSS; este click solo controla el acordeón dentro del menú
// móvil (en escritorio no tiene efecto visual, el hover ya lo muestra).
document.querySelectorAll(".nav-dropdown-toggle").forEach(boton => {
  boton.addEventListener("click", (e) => {
    e.preventDefault();
    e.stopPropagation();
    const item = boton.closest(".nav-item-dropdown");
    if (!item) return;
    const abierto = item.classList.toggle("submenu-abierto");
    boton.setAttribute("aria-expanded", abierto ? "true" : "false");
  });
});

// Las etiquetas principales de un desplegable (p. ej. "VOCES") solo se
// abren con el ratón encima (:hover) o con teclado (:focus); un clic no
// debe hacer nada ni dejar el submenú "enganchado" abierto.
document.querySelectorAll(".nav-link-solo-despliega").forEach(boton => {
  boton.addEventListener("click", (e) => {
    e.preventDefault();
    e.stopPropagation();
    boton.blur();
  });
});

document.querySelectorAll("nav.nav-princ a").forEach(enlace => {
  enlace.addEventListener("click", () => {
    cerrarMenu(enlace.closest("nav.nav-princ"));
  });
});

document.addEventListener("click", (e) => {
  const nav = document.querySelector("nav.nav-princ.abierto");
  if (nav && !nav.contains(e.target)) cerrarMenu(nav);
});

document.addEventListener("keydown", (e) => {
  if (e.key !== "Escape") return;
  const nav = document.querySelector("nav.nav-princ.abierto");
  if (nav) cerrarMenu(nav);
});
