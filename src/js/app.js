const reducido = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

function revelarEnScroll() {
  const elementos = document.querySelectorAll(".revelar");

  /* Antes de devolver: el estado oculto de .revelar solo vale con esta clase,
     asi que un script caido deja el contenido visible en vez de invisible. */
  document.documentElement.classList.add("revelar-listo");

  if (!("IntersectionObserver" in window) || reducido) {
    elementos.forEach((el) => el.classList.add("is-visible"));
    return;
  }

  const observador = new IntersectionObserver(
    (entradas) => {
      entradas.forEach((entrada) => {
        if (entrada.isIntersecting) {
          entrada.target.classList.add("is-visible");
          observador.unobserve(entrada.target);
        }
      });
    },
    { threshold: 0.15 },
  );

  elementos.forEach((el) => observador.observe(el));
}

/* Al cargar, la grilla de productos todavia no existe: la pinta tienda.js
   con un fetch a Supabase, DESPUES del DOMContentLoaded. Ese archivo avisa
   con `catalogo-listo` y acá se rearma el observer para las tarjetas nuevas.
   Si el aviso llega antes que este listener, el DOMContentLoaded igual las
   encuentra porque ya están en el DOM. */
document.addEventListener("DOMContentLoaded", revelarEnScroll);
document.addEventListener("catalogo-listo", revelarEnScroll);
