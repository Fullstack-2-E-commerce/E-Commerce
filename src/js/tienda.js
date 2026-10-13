/* Pinta las tarjetas de producto en cualquier contenedor marcado con
   [data-catalogo]. Los platos salen de la tabla `productos` de Supabase
   (ver supabase/productos.sql), no de un arreglo en el código.

   data-catalogo="destacados" -> solo los platos con destacado = true
   data-catalogo="todos"      -> el catálogo completo

   Al terminar avisa con `catalogo-listo`: app.js rearma el scroll-reveal
   porque las tarjetas llegan después del DOMContentLoaded (fetch) y si no
   quedan en opacity 0 para siempre. */

import { supabase } from "./supabase.js";
import { precioCLP } from "./validaciones.js";

/* La descripción viaja en la BD: se escapa antes de meterla al HTML. */
function esc(s) {
  return String(s ?? "").replace(
    /[&<>"']/g,
    (c) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[
        c
      ],
  );
}

const PLANTILLA_PRODUCTO = (p) => `
  <article class="producto revelar">
    <figure class="producto-img">
      ${
        p.imagen_url
          ? `<img src="${esc(p.imagen_url)}" alt="${esc(p.nombre)}" width="800" height="600" loading="lazy" />`
          : ""
      }
    </figure>
    <div class="producto-body">
      <p class="producto-categoria">${esc(p.categoria)}</p>
      <h3 class="producto-nombre">${esc(p.nombre)}</h3>
      <p class="producto-desc">${esc(p.descripcion)}</p>
      <p class="precio">${precioCLP(p.precio)}</p>
    </div>
  </article>`;

const contenedores = document.querySelectorAll("[data-catalogo]");

if (contenedores.length) {
  const { data: productos, error } = await supabase
    .from("productos")
    .select("nombre, descripcion, precio, categoria, imagen_url, destacado")
    .order("id");

  if (error) {
    console.error("No se pudo cargar el catálogo:", error.message);
    contenedores.forEach(
      (c) =>
        (c.innerHTML = `<p class="productos-lead">No se pudo cargar la carta. Intenta de nuevo más tarde.</p>`),
    );
  } else {
    contenedores.forEach((contenedor) => {
      const lista =
        contenedor.dataset.catalogo === "destacados"
          ? productos.filter((p) => p.destacado)
          : productos;
      contenedor.innerHTML = lista.map(PLANTILLA_PRODUCTO).join("");
    });
  }

  document.dispatchEvent(new Event("catalogo-listo"));
}
