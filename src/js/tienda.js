/* Pinta las tarjetas de producto en cualquier contenedor marcado con
   [data-catalogo]. Se carga ANTES de app.js: ese archivo arma el
   scroll-reveal al ejecutarse, así que las tarjetas ya tienen que estar
   en el DOM o quedan invisibles para siempre.

   data-catalogo="destacados" -> solo los platos marcados en CATALOGO
   data-catalogo="todos"      -> el catálogo completo */

import { CATALOGO, precioCLP } from "./catalogo.js";

const PLANTILLA_PRODUCTO = (p) => `
  <article class="producto revelar">
    <figure class="producto-img">
      <img
        src="/assets/img/${p.slug}.webp"
        alt="${p.nombre}"
        width="800"
        height="600"
        loading="lazy"
      />
    </figure>
    <div class="producto-body">
      <p class="producto-categoria">${p.categoria}</p>
      <h3 class="producto-nombre">${p.nombre}</h3>
      <p class="producto-desc">${p.descripcion}</p>
      <p class="precio">${precioCLP(p.precio)}</p>
    </div>
  </article>`;

document.querySelectorAll("[data-catalogo]").forEach((contenedor) => {
  const lista =
    contenedor.dataset.catalogo === "destacados"
      ? CATALOGO.filter((p) => p.destacado)
      : CATALOGO;
  contenedor.innerHTML = lista.map(PLANTILLA_PRODUCTO).join("");
});
