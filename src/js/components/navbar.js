export class SiteNavbar extends HTMLElement {
  connectedCallback() {
    // Detectamos la ruta actual para marcar el enlace activo dinámicamente
    const path = window.location.pathname;

    this.innerHTML = `
      <header class="site-header">
        <div class="container header-inner">
          <a href="/" class="logo">Sabores de <span class="logo-em"> Chile</span></a>
          <nav class="main-nav" aria-label="Navegación principal">
            <ul>
              <li><a href="/" class="nav-link ${path === "/" || path === "/index.html" ? "is-active" : ""}">Home</a></li>
              <li><a href="/src/pages/productos.html" class="nav-link ${path.includes("productos") ? "is-active" : ""}">Productos</a></li>
              <li><a href="/src/pages/blogs.html" class="nav-link ${path.includes("blogs") ? "is-active" : ""}">Blogs</a></li>
              <li><a href="/src/pages/nosotros.html" class="nav-link ${path.includes("nosotros") ? "is-active" : ""}">Nosotros</a></li>
              <li><a href="/src/pages/contacto.html" class="nav-link ${path.includes("contacto") ? "is-active" : ""}">Contacto</a></li>
            </ul>
          </nav>

          <div class="auth-sesion" id="authSesion">
            <span class="auth-correo" id="authCorreo"></span>
            <button type="button" class="auth-salir" id="authSalir">Salir</button>
          </div>
          <button type="button" class="auth-trigger" id="authEntrar">Iniciar sesión</button>
        </div>
      </header>
    `;
  }
}

customElements.define("site-navbar", SiteNavbar);
