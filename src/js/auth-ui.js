// Estado de sesión, modales de login y registro.
// También controla la visualización y funcionamiento del carrito.

import { supabase } from "./supabase.js";
import { precioCLP } from "./validaciones.js";

(function () {
  // Recuperar el carrito guardado en el navegador.
  if (!Array.isArray(window.carrito)) {
    try {
      const carritoGuardado = localStorage.getItem("carrito");
      const datos = carritoGuardado ? JSON.parse(carritoGuardado) : [];

      window.carrito = Array.isArray(datos) ? datos : [];
    } catch (error) {
      console.error("No se pudo recuperar el carrito:", error);
      window.carrito = [];
    }
  }

  // Guardar el carrito en localStorage.
  function guardarCarrito() {
    try {
      localStorage.setItem("carrito", JSON.stringify(window.carrito));
    } catch (error) {
      console.error("No se pudo guardar el carrito:", error);
    }
  }

  const entrar = document.getElementById("authEntrar");
  const registrar = document.getElementById("authRegistrar");
  const salir = document.getElementById("authSalir");
  const sesion = document.getElementById("authSesion");
  const correo = document.getElementById("authCorreo");

  const cartTrigger = document.getElementById("cartTrigger");
  const cartModal = document.getElementById("cartModal");
  const cartCerrar = document.getElementById("cartCerrar");
  const cartVaciar = document.getElementById("cartVaciar");
  const cartContinuar = document.getElementById("cartContinuar");

  // Página sin el bloque de autenticación.
  if (!entrar || !salir || !sesion || !correo) return;

  const modales = {
    login: document.getElementById("authModalLogin"),
    registro: document.getElementById("authModalRegistro"),
  };

  // Mostrar u ocultar la sesión del usuario.
  async function pintar(estado) {
    const activo = Boolean(estado);

    entrar.hidden = activo;

    // Con sesión abierta el botón de registro sobra: ya hay cuenta.
    if (registrar) registrar.hidden = activo;

    sesion.classList.toggle("activa", activo);

    if (activo) {
      correo.textContent = estado.user.email;

      // Si inició sesión, deja de ser invitado.
      sessionStorage.removeItem("modoInvitado");

      // Consultar el rol del usuario en Supabase.
      const { data: usuario, error } = await supabase
        .from("usuarios")
        .select("rol")
        .eq("id", estado.user.id)
        .single();

      if (error || !usuario) {
        document.body.dataset.tipoUsuario = "";
        return;
      }

      document.body.dataset.tipoUsuario = usuario.rol;
    } else {
      // Si no hay sesión, puede ser visitante o invitado.
      if (sessionStorage.getItem("modoInvitado") === "true") {
        document.body.dataset.tipoUsuario = "Invitado";
      } else {
        document.body.dataset.tipoUsuario = "";
      }
    }
  }

  // Abrir un modal.
  function abrir(quien) {
    const modal = modales[quien];

    if (modal && !modal.open) {
      modal.showModal();
    }
  }

  // Cerrar los modales de autenticación.
  function cerrarTodos() {
    Object.values(modales).forEach((modal) => {
      if (modal && modal.open) {
        modal.close();
      }
    });
  }

  // Una línea del carrito: nombre, precio unitario, cantidad y subtotal.
  function lineaCarrito(producto) {
    const precio = Number(producto.precio);
    const cantidad = Number(producto.cantidad);
    const nombre = escapeHTML(producto.nombre);
    const id = escapeHTML(producto.id);

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

  // Después de repintar, el botón pulsado ya no existe: se devuelve el foco
  // al mismo control de la misma línea.
  function reenfocar(clase, id) {
    if (!cartModal || !cartModal.open) return;

    const selector = `.${clase}[data-id="${CSS.escape(String(id))}"]`;

    let nodo = document.querySelector(selector);

    if (nodo && nodo.disabled) {
      nodo = document.querySelector(
        `.cart-sumar[data-id="${CSS.escape(String(id))}"]`,
      );
    }

    if (nodo) nodo.focus();
  }

  // Mostrar el contenido actual del carrito.
  function actualizarCarritoVisual() {
    const cartItems = document.getElementById("cartItems");
    const cartTotal = document.getElementById("cartTotal");
    const cartCount = document.getElementById("cartCount");
    const cartPie = document.getElementById("cartPie");

    if (!cartItems || !cartTotal) return;

    const carrito = window.carrito;

    // Carrito vacío: plato vacío dibujado y salida a la carta.
    if (carrito.length === 0) {
      cartItems.innerHTML = `
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

          <a
            class="cart-btn cart-btn--primario"
            href="/src/pages/productos.html"
          >
            Ver la carta
          </a>
        </div>
      `;

      cartTotal.textContent = "$0";

      if (cartPie) cartPie.hidden = true;
      if (cartCount) cartCount.textContent = "0";

      return;
    }

    if (cartPie) cartPie.hidden = false;

    // Mostrar productos.
    cartItems.innerHTML = carrito.map(lineaCarrito).join("");

    // Cantidad total de unidades.
    const cantidadTotal = carrito.reduce(
      (total, producto) => total + Number(producto.cantidad),
      0,
    );

    // Total del carrito.
    const total = carrito.reduce(
      (suma, producto) =>
        suma + Number(producto.precio) * Number(producto.cantidad),
      0,
    );

    if (cartCount) {
      if (cartCount.textContent !== String(cantidadTotal)) latir(cartCount);

      cartCount.textContent = cantidadTotal;
    }

    cartTotal.textContent = precioCLP(total);
  }

  // Evitar insertar texto de productos directamente como HTML.
  function escapeHTML(valor) {
    return String(valor ?? "").replace(
      /[&<>"']/g,
      (caracter) =>
        ({
          "&": "&amp;",
          "<": "&lt;",
          ">": "&gt;",
          '"': "&quot;",
          "'": "&#39;",
        })[caracter],
    );
  }

  // Botón iniciar sesión.
  entrar.addEventListener("click", () => {
    abrir("login");
  });

  // Botón del carrito.
  if (cartTrigger && cartModal) {
    cartTrigger.addEventListener("click", () => {
      actualizarCarritoVisual();

      if (!cartModal.open) {
        cartModal.showModal();
      }
    });
  }

  // Cerrar carrito.
  if (cartCerrar && cartModal) {
    cartCerrar.addEventListener("click", () => {
      cartModal.close();
    });
  }

  // Vaciar carrito.
  if (cartVaciar) {
    cartVaciar.addEventListener("click", () => {
      window.carrito.length = 0;

      guardarCarrito();
      actualizarCarritoVisual();
    });
  }

  // Continuar comprando.
  if (cartContinuar && cartModal) {
    cartContinuar.addEventListener("click", () => {
      cartModal.close();
    });
  }

  // Aumentar cantidad.
  document.addEventListener("click", (evento) => {
    const boton = evento.target.closest(".cart-sumar");

    if (!boton) return;

    const id = boton.dataset.id;

    const producto = window.carrito.find(
      (item) => String(item.id) === String(id),
    );

    if (!producto) return;

    producto.cantidad++;

    guardarCarrito();
    actualizarCarritoVisual();
    reenfocar("cart-sumar", id);
  });

  // Disminuir cantidad.
  document.addEventListener("click", (evento) => {
    const boton = evento.target.closest(".cart-restar");

    if (!boton) return;

    const id = boton.dataset.id;

    const producto = window.carrito.find(
      (item) => String(item.id) === String(id),
    );

    if (!producto) return;

    if (producto.cantidad > 1) {
      producto.cantidad--;
    }

    guardarCarrito();
    actualizarCarritoVisual();
    reenfocar("cart-restar", id);
  });

  // Eliminar un producto.
  document.addEventListener("click", (evento) => {
    const boton = evento.target.closest(".cart-eliminar");

    if (!boton) return;

    const id = boton.dataset.id;

    const indice = window.carrito.findIndex(
      (producto) => String(producto.id) === String(id),
    );

    if (indice !== -1) {
      window.carrito.splice(indice, 1);
    }

    guardarCarrito();
    actualizarCarritoVisual();

    // La línea que tenía el foco ya no existe: el foco vuelve al panel.
    if (cartModal && cartModal.open && cartCerrar) cartCerrar.focus();
  });

  // Cerrar sesión.
  salir.addEventListener("click", async () => {
    const { error } = await supabase.auth.signOut();

    if (error) {
      console.error("No se pudo cerrar la sesión:", error.message);
    }
  });

  // Continuar como invitado.
  const continuarInvitado = document.getElementById("continuarInvitado");

  if (continuarInvitado) {
    continuarInvitado.addEventListener("click", () => {
      sessionStorage.setItem("modoInvitado", "true");
      document.body.dataset.tipoUsuario = "Invitado";

      cerrarTodos();
    });
  }

  // Abrir login o registro.
  document.querySelectorAll("[data-auth-abrir]").forEach((boton) => {
    boton.addEventListener("click", () => {
      abrir(boton.dataset.authAbrir);
    });
  });

  // Cerrar modales.
  document.querySelectorAll("[data-auth-cerrar]").forEach((boton) => {
    boton.addEventListener("click", cerrarTodos);
  });

  // Cambiar entre login y registro.
  document.querySelectorAll("[data-auth-ir]").forEach((enlace) => {
    enlace.addEventListener("click", (evento) => {
      evento.preventDefault();

      cerrarTodos();
      abrir(enlace.dataset.authIr);
    });
  });

  // Cerrar modales haciendo clic en el fondo.
  Object.values(modales).forEach((modal) => {
    if (!modal) return;

    modal.addEventListener("click", (evento) => {
      if (evento.target === modal) {
        modal.close();
      }
    });
  });

  // Mostrar el carrito guardado al cargar la página.
  actualizarCarritoVisual();

  // Comprobar sesión actual.
  supabase.auth
    .getSession()
    .then(({ data }) => pintar(data.session))
    .catch((error) => {
      console.error("No se pudo comprobar la sesión:", error);
    });

  // Escuchar cambios de sesión.
  supabase.auth.onAuthStateChange((_evento, estado) => pintar(estado));
})();
