/* ==========================================================================
   animaciones.js — arma las animaciones de la capa extra.
   Se carga DESPUES de app.js y despues de tienda.js, para ver las tarjetas
   ya pintadas en el DOM.

   Dos reglas guian todo el archivo:
     1. No se modifica nada que ya exista. Solo se agregan clases y una
        variable --i. Ningun texto, ninguna estructura, ningun atributo
        original se toca.
     2. Si algo falla, el sitio se ve igual que sin este archivo. Por eso
        <html> recibe .anim-listo recien al final: los estados ocultos del
        CSS viven bajo esa clase y no aplican nunca antes.
   ========================================================================== */

(function () {
  "use strict";

  var reducido = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* --- Contenedores que se escalonan por posicion -------------------------- */
  /* Los hijos reciben --i con su indice. min() en el CSS cape a 8. */
  var Escalonados = [
    ".productos-grid",
    ".blog-grid",
    ".receta",
    ".info-lista",
    ".cocina-placa",
    ".historia-grid",
  ];

  function escalar() {
    Escalonados.forEach(function (sel) {
      document.querySelectorAll(sel).forEach(function (contenedor) {
        Array.prototype.forEach.call(
          contenedor.children,
          function (hijo, i) {
            hijo.style.setProperty("--i", i);
            hijo.classList.add("escalonado");
          },
        );
      });
    });

    /* Las columnas de texto de "Nosotros" son una detras de otra en movil,
       asi que escalonan en vertical, no como grilla. */
    document.querySelectorAll(".historia").forEach(function (bloque) {
      bloque.classList.add("escalonado-v");
    });
  }

  /* --- Bloques que entran con "sello" -------------------------------------- */
  /* El titulo de cada seccion lleva la segunda tinta desalineada y se
     asienta al entrar en pantalla. Los bloques de dos columnas entran desde
     su lado. Todo lo demas ya tiene su animacion en home-styles.css. */
  var Sellos = [
    // [selector, clase de entrada]
    [".productos-titulo", "sello-titulo sello"],
    [".cocina-titulo", "sello-titulo sello"],
    [".blog-titulo", "sello-titulo sello"],
    [".contacto-titulo", "sello-titulo sello"],
    [".nosotros-hero-titulo", "sello-titulo sello"],
    [".productos-hero-titulo", "sello-titulo sello"],
    [".valores-head h2", "sello-titulo sello"],
    [".hero-title", "sello-titulo sello"],
    // Bloques de apoyo: entran sin segunda tinta para no competes con el
    // titulo de su propia seccion.
    [".valores-head .valores-lead", "sello-plano"],
    [".productos-head .productos-lead", "sello-plano"],
    [".blog-lead", "sello-plano"],
    [".contacto-lead", "sello-plano"],
    [".nosotros-hero-lead", "sello-plano"],
    [".productos-hero-lead", "sello-plano"],
    // Columnas de dos: entran desde su lado.
    [".contacto-grid > *", "sello-izq"],
    [".historia-grid > *", "sello-izq"],
    [".valores .receta > *", "sello-plano"],
  ];

  function marcarSellos() {
    Sellos.forEach(function (par) {
      var sel = par[0];
      var clase = par[1];

      document.querySelectorAll(sel).forEach(function (el, i) {
        /* El hero queda arriba al cargar: no espera al scroll, entra
           apenas la pagina esta lista. */
        el.classList.add(...clase.split(" "));

        if (el.closest(".hero")) {
          /* Escalonado corto dentro del hero: kicker, titulo, lead. */
          el.style.transitionDelay = "calc(var(--paso) * " + Math.min(i, 3) + ")";
        }
      });
    });
  }

  /* --- Observer de entrada en pantalla -------------------------------------- */
  function observar() {
    var elementos = document.querySelectorAll(
      ".sello, .sello-plano, .sello-izq, .sello-der",
    );

    if (reducido || !("IntersectionObserver" in window)) {
      elementos.forEach(function (el) {
        el.classList.add("is-visible");
      });
      return;
    }

    var obs = new IntersectionObserver(
      function (entradas) {
        entradas.forEach(function (entrada) {
          if (entrada.isIntersecting) {
            entrada.target.classList.add("is-visible");
            obs.unobserve(entrada.target);
          }
        });
      },
      /* threshold bajo y rootMargin negativo: el bloque tiene que estar
         realmente dentro del viewport, no asomando en el borde. */
      { threshold: 0.15, rootMargin: "0px 0px -8% 0px" },
    );

    elementos.forEach(function (el) {
      obs.observe(el);
    });
  }

  /* --- Barra de progreso de lectura ----------------------------------------- */
  function barraProgreso() {
    var barra = document.createElement("div");
    barra.className = "barra-progreso";
    barra.setAttribute("aria-hidden", "true");
    document.body.appendChild(barra);

    if (reducido) return;

    var ticking = false;

    function actualizar() {
      var alto = document.documentElement.scrollHeight - window.innerHeight;
      var avance = alto > 0 ? window.scrollY / alto : 0;
      barra.style.setProperty(
        "--avance",
        Math.min(Math.max(avance, 0), 1).toFixed(4),
      );
      ticking = false;
    }

    window.addEventListener(
      "scroll",
      function () {
        /* Un solo update por frame. Calcular en cada evento de scroll hace
           trabajo de mas cuando la rueda dispara varios por frame. */
        if (!ticking) {
          ticking = true;
          window.requestAnimationFrame(actualizar);
        }
      },
      { passive: true },
    );

    actualizar();
  }

  /* --- Sombra de la cabecera al bajar --------------------------------------- */
  function sombraCabecera() {
    var header = document.querySelector(".site-header");
    if (!header) return;

    var ticking = false;

    function actualizar() {
      header.classList.toggle("scrolled", window.scrollY > 12);
      ticking = false;
    }

    window.addEventListener(
      "scroll",
      function () {
        if (!ticking) {
          ticking = true;
          window.requestAnimationFrame(actualizar);
        }
      },
      { passive: true },
    );

    actualizar();
  }

  /* --- Arranque -------------------------------------------------------------- */
  function iniciar() {
    escalar();
    marcarSellos();
    observar();
    barraProgreso();
    sombraCabecera();

    /* La ultima linea del archivo: hasta aqui el contenido sigue visible
       con normalidad. Con esta clase empiezan a valer los estados
       ocultos del CSS. */
    document.documentElement.classList.add("anim-listo");
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", iniciar);
  } else {
    iniciar();
  }
})();