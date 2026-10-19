import { supabase } from "./supabase.js";
import { precioCLP } from "./validaciones.js";

function esc(s) {
  return String(s ?? "").replace(
    /[&<>"']/g,
    (c) =>
      ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;",
      })[c],
  );
}

// Recuperar el carrito guardado
const carritoGuardado = localStorage.getItem("carrito");

try {
  const datos = carritoGuardado ? JSON.parse(carritoGuardado) : [];
  window.carrito = Array.isArray(datos) ? datos : [];
} catch (error) {
  console.error("No se pudo recuperar el carrito:", error);
  window.carrito = [];
}

// Guardar el carrito
function guardarCarrito() {
  try {
    localStorage.setItem("carrito", JSON.stringify(window.carrito));
  } catch (error) {
    console.error("No se pudo guardar el carrito:", error);
  }
}

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

// Actualizar el contador
function actualizarContadorCarrito() {
  const cartCount = document.getElementById("cartCount");

  if (!cartCount) return;

  const cantidadTotal = window.carrito.reduce(
    (total, producto) => total + producto.cantidad,
    0,
  );

  cartCount.textContent = cantidadTotal;
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

// Agregar productos al carrito
document.addEventListener("click", (evento) => {
  const boton = evento.target.closest(".btn-agregar-carrito");

  if (!boton) return;

  const tipoUsuario = document.body.dataset.tipoUsuario;

  if (tipoUsuario !== "Cliente" && tipoUsuario !== "Invitado") {
    alert(
      "Debes iniciar sesión como Cliente o continuar como invitado para usar el carrito.",
    );
    return;
  }

  const id = boton.dataset.productoId;
  const nombre = boton.dataset.productoNombre;
  const precio = Number(boton.dataset.productoPrecio);

  const productoExistente = window.carrito.find(
    (producto) => String(producto.id) === String(id),
  );

  if (productoExistente) {
    productoExistente.cantidad++;
  } else {
    window.carrito.push({
      id,
      nombre,
      precio,
      cantidad: 1,
    });
  }

  guardarCarrito();
  actualizarContadorCarrito();
  marcarAgregado(boton);

  document.dispatchEvent(new Event("carrito-actualizado"));
});

// Actualizar el contador al cargar la página
actualizarContadorCarrito();
