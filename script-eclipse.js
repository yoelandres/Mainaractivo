const observerFade = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add("visible");
      observerFade.unobserve(entry.target);
    }
  });
}, { threshold: 0.2 });

document.querySelectorAll(".fade-in, .eclipse-content, .eclipse-title, .eclipse-info, .btn-eclipse")
  .forEach(el => observerFade.observe(el));

const enlaceInscripcionEclipse = "https://forms.gle/YqZPRQD6td6Lnfyx8";

const btnEclipse = document.getElementById("btnEclipse");

if (btnEclipse) {
  if (enlaceInscripcionEclipse) {
    btnEclipse.addEventListener("click", () => {
      window.open(enlaceInscripcionEclipse, "_blank", "noopener");
    });
  } else {
    btnEclipse.disabled = true;
    btnEclipse.textContent = "Aún no se puede inscribir";
  }
}

