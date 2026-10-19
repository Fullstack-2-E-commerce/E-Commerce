export class SiteNavbar extends HTMLElement {
  connectedCallback() {
    // Detectamos la ruta actual para marcar el enlace activo dinámicamente
    const path = window.location.pathname;

    this.innerHTML = `
      <header class="site-header">
        <div class="container header-inner">

          <a href="/" class="logo">
            Sabores de <span class="logo-em">Chile</span>
          </a>

          <!-- Solo bajo 768 px: el nav ocupa dos filas y empuja el resto. -->
          <button
            type="button"
            class="nav-toggle"
            id="navToggle"
            aria-expanded="false"
            aria-controls="navPrincipal"
            aria-label="Abrir menú"
          >
            <svg
              viewBox="0 0 24 24"
              width="20"
              height="20"
              fill="none"
              stroke="currentColor"
              stroke-width="2.2"
              stroke-linecap="square"
              aria-hidden="true"
              focusable="false"
            >
              <path d="M4 7h16M4 12h16M4 17h16" />
            </svg>
          </button>

          <nav
            class="main-nav"
            id="navPrincipal"
            aria-label="Navegación principal"
          >
            <ul>
              <li>
                <a
                  href="/"
                  class="nav-link ${
                    path === "/" || path === "/index.html" ? "is-active" : ""
                  }"
                >
                  Home
                </a>
              </li>

              <li>
                <a
                  href="/src/pages/productos.html"
                  class="nav-link ${
                    path.includes("productos") ? "is-active" : ""
                  }"
                >
                  Productos
                </a>
              </li>

              <li>
                <a
                  href="/src/pages/blogs.html"
                  class="nav-link ${path.includes("blogs") ? "is-active" : ""}"
                >
                  Blogs
                </a>
              </li>

              <li>
                <a
                  href="/src/pages/nosotros.html"
                  class="nav-link ${
                    path.includes("nosotros") ? "is-active" : ""
                  }"
                >
                  Nosotros
                </a>
              </li>

              <li>
                <a
                  href="/src/pages/contacto.html"
                  class="nav-link ${
                    path.includes("contacto") ? "is-active" : ""
                  }"
                >
                  Contacto
                </a>
              </li>
            </ul>
          </nav>

          <div class="header-acciones">
            <div class="auth-sesion" id="authSesion">
              <span class="auth-correo" id="authCorreo"></span>

              <button type="button" class="auth-salir" id="authSalir">
                Salir
              </button>
            </div>

            <button
              type="button"
              class="auth-trigger auth-trigger--linea"
              id="authEntrar"
            >
              Iniciar sesión
            </button>

            <button
              type="button"
              class="auth-trigger"
              id="authRegistrar"
              data-auth-abrir="registro"
            >
              Registrarse
            </button>

            <button
              type="button"
              class="auth-trigger auth-trigger--carrito"
              id="cartTrigger"
              aria-haspopup="dialog"
            >
              <svg
                class="icono-carrito"
                viewBox="0 0 24 24"
                width="20"
                height="20"
                fill="none"
                stroke="currentColor"
                stroke-width="1.75"
                stroke-linecap="square"
                aria-hidden="true"
                focusable="false"
              >
                <path d="M3 4h2.4l2.6 10.4h9.6L20 7.2H6.2" />
                <circle cx="9.6" cy="19" r="1.5" />
                <circle cx="17" cy="19" r="1.5" />
              </svg>

              <span class="cart-trigger-texto">Carrito</span>
              <span
                class="cart-count"
                id="cartCount"
                data-carrito-count
                aria-live="polite"
                >0</span
              >
            </button>
          </div>
        </div>
      </header>

      <dialog class="cart-modal" id="cartModal" aria-labelledby="cartTitulo">
        <div class="cart-cabecera">
          <h2 class="cart-titulo" id="cartTitulo">Mi carrito</h2>

          <button
            type="button"
            id="cartCerrar"
            class="cart-cerrar"
            aria-label="Cerrar carrito"
          >
            <svg
              viewBox="0 0 24 24"
              width="18"
              height="18"
              fill="none"
              stroke="currentColor"
              stroke-width="2.2"
              stroke-linecap="square"
              aria-hidden="true"
              focusable="false"
            >
              <path d="M5 5l14 14M19 5L5 19" />
            </svg>
          </button>
        </div>

        <div class="cart-cuerpo">
          <div
            id="cartItems"
            class="cart-lineas"
            data-carrito-lineas
            tabindex="-1"
          ></div>
        </div>

        <div class="cart-pie" id="cartPie" data-carrito-pie>
          <div class="cart-total">
            <span class="cart-total-etiqueta">Total</span>
            <strong class="cart-total-monto" id="cartTotal" data-carrito-total
              >$0</strong
            >
          </div>

          <div class="cart-acciones">
            <button
              type="button"
              class="cart-btn cart-btn--fantasma cart-vaciar"
              id="cartVaciar"
            >
              Vaciar carrito
            </button>

            <button type="button" class="cart-btn cart-btn--primario" id="cartContinuar">
              Continuar compra
            </button>
          </div>
        </div>
      </dialog>
    `;

    // Menú móvil: el nav se pliega bajo 768 px. Arriba el botón no existe
    // (display: none), así que el estado no importa.
    const botonMenu = this.querySelector("#navToggle");
    const cabecera = this.querySelector(".header-inner");

    if (botonMenu && cabecera) {
      botonMenu.addEventListener("click", () => {
        const abierto = cabecera.classList.toggle("nav-abierta");

        botonMenu.setAttribute("aria-expanded", String(abierto));
        botonMenu.setAttribute(
          "aria-label",
          abierto ? "Cerrar menú" : "Abrir menú",
        );
      });
    }
  }
}

customElements.define("site-navbar", SiteNavbar);
