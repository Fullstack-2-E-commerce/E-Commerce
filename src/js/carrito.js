// Carrito: estado, persistencia, render y acciones.
// Lo usan las tarjetas de la tienda, el panel del header y la página del
// carrito. Antes la carga y el guardado estaban duplicados en tienda.js y
// auth-ui.js, y el render vivía dentro del módulo de sesión.

import { escaparHTML, precioCLP } from "./validaciones.js";

const CLAVE = "carrito";

// Recuperar el carrito guardado en el navegador.
export const carrito = (() => {
  try {
    const guardado = localStorage.getItem(CLAVE);
    const datos = guardado ? JSON.parse(guardado) : [];

    return Array.isArray(datos) ? datos : [];
  } catch (error) {
    console.error("No se pudo recuperar el carrito:", error);
    return [];
  }
})();

export function guardar() {
  try {
    localStorage.setItem(CLAVE, JSON.stringify(carrito));
  } catch (error) {
    console.error("No se pudo guardar el carrito:", error);
  }
}

export function agregar({ id, nombre, precio }) {
  const existente = carrito.find((item) => String(item.id) === String(id));

  if (existente) {
    existente.cantidad++;
  } else {
    carrito.push({ id, nombre, precio: Number(precio), cantidad: 1 });
  }

  guardar();
}

export function vaciar() {
  carrito.length = 0;
  guardar();
}

export function unidades() {
  return carrito.reduce((suma, item) => suma + Number(item.cantidad), 0);
}

export function monto() {
  return carrito.reduce(
    (suma, item) => suma + Number(item.precio) * Number(item.cantidad),
    0,
  );
}

// Una línea del carrito: nombre, precio unitario, cantidad y subtotal.
export function linea(item) {
  const precio = Number(item.precio);
  const cantidad = Number(item.cantidad);
  const nombre = escaparHTML(item.nombre);
  const id = escaparHTML(item.id);

  return `
    <article class="cart-item">
      <div class="cart-item-datos">
        <h3 class="cart-item-nombre">${nombre}</h3>
        <p class="cart-item-unitario">${precioCLP(precio)} c/u</p>
      </div>

      <button
        type="button"
        class="cart-eliminar"
        data-id="${id}"
        aria-label="Eliminar ${nombre} del carrito"
      >
        <svg
          viewBox="0 0 24 24"
          width="18"
          height="18"
          fill="none"
          stroke="currentColor"
          stroke-width="1.8"
          stroke-linecap="square"
          aria-hidden="true"
          focusable="false"
        >
          <path
            d="M4 7h16M9.5 7V4.5h5V7M6.5 7l1 12.5h9L17.5 7M10.5 10.5v6M13.5 10.5v6"
          />
        </svg>
      </button>

      <div class="cart-stepper">
        <button
          type="button"
          class="cart-paso cart-restar"
          data-id="${id}"
          aria-label="Quitar una unidad de ${nombre}"
          ${cantidad <= 1 ? "disabled" : ""}
        >
          <svg
            viewBox="0 0 24 24"
            width="16"
            height="16"
            fill="none"
            stroke="currentColor"
            stroke-width="2.2"
            stroke-linecap="square"
            aria-hidden="true"
            focusable="false"
          >
            <path d="M5 12h14" />
          </svg>
        </button>

        <span class="cart-cantidad">${cantidad}</span>

        <button
          type="button"
          class="cart-paso cart-sumar"
          data-id="${id}"
          aria-label="Agregar una unidad de ${nombre}"
        >
          <svg
            viewBox="0 0 24 24"
            width="16"
            height="16"
            fill="none"
            stroke="currentColor"
            stroke-width="2.2"
            stroke-linecap="square"
            aria-hidden="true"
            focusable="false"
          >
            <path d="M12 5v14M5 12h14" />
          </svg>
        </button>
      </div>

      <p class="cart-subtotal">${precioCLP(precio * cantidad)}</p>
    </article>
  `;
}

// Carrito vacío: plato dibujado a dos tintas y salida a la carta.
export function vacio() {
  return `
    <div class="cart-vacio">
      <svg
        class="cart-vacio-icono"
        viewBox="0 0 120 120"
        width="96"
        height="96"
        fill="none"
        stroke="currentColor"
        stroke-width="3"
        aria-hidden="true"
        focusable="false"
      >
        <circle cx="60" cy="60" r="43" />
        <circle class="cart-vacio-aro" cx="60" cy="60" r="26" />
        <path d="M60 17v9M60 94v9M17 60h9M94 60h9" />
      </svg>

      <p class="cart-vacio-titulo">Todavía no hay nada en el carrito</p>
      <p class="cart-vacio-texto">
        Agrega platos de la carta y los verás acá.
      </p>

      <a class="cart-btn cart-btn--primario" href="/src/pages/productos.html">
        Ver la carta
      </a>
    </div>
  `;
}

// El contador del header late cuando cambia, para que se note el alta.
function latir(nodo) {
  nodo.classList.remove("cart-count--late");

  // Fuerza el reinicio de la animación aunque la clase siga puesta.
  void nodo.offsetWidth;
  nodo.classList.add("cart-count--late");

  nodo.addEventListener(
    "animationend",
    () => nodo.classList.remove("cart-count--late"),
    { once: true },
  );
}

// Después de repintar, el botón pulsado ya no existe: el foco vuelve al mismo
// control de la misma línea. El contenedor se captura antes de repintar
// porque innerHTML deja el botón desprendido del documento.
function reenfocar(contenedor, clase, id) {
  if (!contenedor) return;

  const selector = `.${clase}[data-id="${CSS.escape(String(id))}"]`;

  let nodo = contenedor.querySelector(selector);

  if (nodo && nodo.disabled) {
    nodo = contenedor.querySelector(
      `.cart-sumar[data-id="${CSS.escape(String(id))}"]`,
    );
  }

  if (nodo) nodo.focus();
}

// Pinta cada superficie del carrito que exista en la página. El contrato son
// los atributos data-carrito-*, así el panel del header y la página del
// carrito comparten render sin cableado propio.
export function pintar() {
  const unidadesTotales = unidades();

  document.querySelectorAll("[data-carrito-lineas]").forEach((contenedor) => {
    contenedor.innerHTML =
      carrito.length === 0 ? vacio() : carrito.map(linea).join("");
  });

  document.querySelectorAll("[data-carrito-total]").forEach((nodo) => {
    nodo.textContent = precioCLP(monto());
  });

  document.querySelectorAll("[data-carrito-pie]").forEach((nodo) => {
    nodo.hidden = carrito.length === 0;
  });

  document.querySelectorAll("[data-carrito-count]").forEach((nodo) => {
    if (nodo.textContent !== String(unidadesTotales)) latir(nodo);

    nodo.textContent = unidadesTotales;
  });
}

function buscar(id) {
  return carrito.find((item) => String(item.id) === String(id));
}

// Un solo listener delegado para las cuatro acciones del carrito. Sirve al
// panel y a la página por igual.
document.addEventListener("click", (evento) => {
  const sumar = evento.target.closest(".cart-sumar");

  if (sumar) {
    const item = buscar(sumar.dataset.id);

    if (!item) return;

    const contenedor = sumar.closest("[data-carrito-lineas]");

    item.cantidad++;
    guardar();
    pintar();
    reenfocar(contenedor, "cart-sumar", sumar.dataset.id);
    return;
  }

  const restar = evento.target.closest(".cart-restar");

  if (restar) {
    const item = buscar(restar.dataset.id);

    if (!item || item.cantidad <= 1) return;

    const contenedor = restar.closest("[data-carrito-lineas]");

    item.cantidad--;
    guardar();
    pintar();
    reenfocar(contenedor, "cart-restar", restar.dataset.id);
    return;
  }

  const eliminar = evento.target.closest(".cart-eliminar");

  if (eliminar) {
    const contenedor = eliminar.closest("[data-carrito-lineas]");
    const indice = carrito.findIndex(
      (item) => String(item.id) === String(eliminar.dataset.id),
    );

    if (indice !== -1) carrito.splice(indice, 1);

    guardar();
    pintar();

    // La línea que tenía el foco ya no existe: el foco vuelve al contenedor,
    // que lleva tabindex="-1" para poder recibirlo.
    if (contenedor) contenedor.focus();
    return;
  }

  if (evento.target.closest(".cart-vaciar")) {
    vaciar();
    pintar();
  }
});

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", pintar);
} else {
  pintar();
}
