const reducido = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

function revelarEnScroll() {
  const elementos = document.querySelectorAll('.revelar');

  if (!('IntersectionObserver' in window) || reducido) {
    elementos.forEach((el) => el.classList.add('is-visible'));
    return;
  }

  const observador = new IntersectionObserver(
    (entradas) => {
      entradas.forEach((entrada) => {
        if (entrada.isIntersecting) {
          entrada.target.classList.add('is-visible');
          observador.unobserve(entrada.target);
        }
      });
    },
    { threshold: 0.15 }
  );

  elementos.forEach((el) => observador.observe(el));
}

revelarEnScroll();