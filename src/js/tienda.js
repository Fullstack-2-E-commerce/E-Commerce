import { supabase } from "./supabase.js";
import { escaparHTML as esc, precioCLP } from "./validaciones.js";
import { agregar, pintar } from "./carrito.js";

// Plantilla de cada producto
const PLANTILLA_PRODUCTO = (p) => `
  <article class="producto revelar" data-producto-id="${esc(p.id)}">
    <figure class="producto-img">
      ${
        p.imagen_url
          ? `<img
              src="${esc(p.imagen_url)}"
              alt="${esc(p.nombre)}"
              width="800"
              height="600"
              loading="lazy"
            />`
          : ""
      }
    </figure>

    <div class="producto-body">
      <p class="producto-categoria">${esc(p.categoria)}</p>
      <h3 class="producto-nombre">${esc(p.nombre)}</h3>
      <p class="producto-desc">${esc(p.descripcion)}</p>
      <p class="precio">${precioCLP(p.precio)}</p>

      <button
        type="button"
        class="btn-agregar-carrito"
        data-producto-id="${esc(p.id)}"
        data-producto-nombre="${esc(p.nombre)}"
        data-producto-precio="${p.precio}"
        aria-label="Agregar ${esc(p.nombre)} al carrito"
      >
        <span class="btn-agregar-texto">Agregar al carrito</span>
      </button>
    </div>
  </article>
`;

const contenedores = document.querySelectorAll("[data-catalogo]");

if (contenedores.length) {
  const { data: productos, error } = await supabase
    .from("productos")
    .select("id, nombre, descripcion, precio, categoria, imagen_url, destacado")
    .order("id");

  if (error) {
    console.error("No se pudo cargar el catálogo:", error.message);

    contenedores.forEach((contenedor) => {
      contenedor.innerHTML = `
        <p class="productos-lead">
          No se pudo cargar la carta. Intenta de nuevo más tarde.
        </p>
      `;
    });
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

// El botón confirma el alta un instante antes de volver a su estado normal.
function marcarAgregado(boton) {
  const etiqueta = boton.querySelector(".btn-agregar-texto");

  if (!etiqueta) return;

  clearTimeout(boton.temporizadorTexto);

  boton.classList.add("is-agregado");
  etiqueta.textContent = "Agregado";

  boton.temporizadorTexto = setTimeout(() => {
    boton.classList.remove("is-agregado");
    etiqueta.textContent = "Agregar al carrito";
  }, 1200);
}

// Agregar productos al carrito. No pide sesión: el carrito es del navegador.
document.addEventListener("click", (evento) => {
  const boton = evento.target.closest(".btn-agregar-carrito");

  if (!boton) return;

  agregar({
    id: boton.dataset.productoId,
    nombre: boton.dataset.productoNombre,
    precio: boton.dataset.productoPrecio,
  });

  pintar();
  marcarAgregado(boton);
});
