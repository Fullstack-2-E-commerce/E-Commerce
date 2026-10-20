import { supabase } from "../supabase.js";

export class SiteFooter extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `
      <footer class="site-footer">
      <div class="container footer-inner">
        <div class="footer-marca">
          <p class="footer-logo">Sabores de Chile</p>
          <p class="footer-tagline">
            Cocina casera hecha con cariño, del campo a tu mesa.
          </p>
        </div>

        <nav class="footer-nav" aria-label="Tienda">
          <h2 class="footer-titulo">Tienda</h2>
          <ul>
            <li><a href="/">Home</a></li>
            <li><a href="/src/pages/productos.html">Productos</a></li>
            <li><a href="/src/pages/blogs.html">Blogs</a></li>
            <li><a href="/src/pages/nosotros.html">Nosotros</a></li>
            <li><a href="/src/pages/contacto.html">Contacto</a></li>
          </ul>
        </nav>

        <nav class="footer-nav" aria-label="Cuenta">
          <h2 class="footer-titulo">Cuenta</h2>
          <ul data-footer-invitado>
            <li><a href="/src/pages/login.html">Iniciar sesión</a></li>
            <li><a href="/src/pages/registros.html">Crear cuenta</a></li>
          </ul>
          <!-- Con sesión abierta cambia la lista; el panel solo si el rol lo permite. -->
          <ul data-footer-sesion hidden>
            <li data-footer-admin hidden>
              <a href="/src/pages/admin-productos.html"
                >Panel de administración</a
              >
            </li>
            <li><a href="/src/pages/cuenta.html">Mi cuenta</a></li>
            <li><a href="/src/pages/carrito.html">Mi pedido</a></li>
            <li>
              <button type="button" class="footer-enlace" data-footer-salir>
                Cerrar sesión
              </button>
            </li>
          </ul>
        </nav>

        <div class="footer-contacto">
          <h2 class="footer-titulo">Visítanos</h2>
          <address>
            Av. Providencia 1234, Santiago
            <a href="tel:+56912345678">+56 9 1234 5678</a>
            <a href="mailto:hola@saboresdechile.cl">hola@saboresdechile.cl</a>
          </address>
          <p class="footer-horario">Martes a domingo, 11:00 a 20:00</p>
        </div>
      </div>

      <div class="footer-bottom">
        <p>&copy; 2026 Sabores de Chile. Todos los derechos reservados.</p>
        <details class="footer-creditos">
          <summary>Créditos de las fotografías</summary>
          <ul>
            <li>Pastel de choclo — Foofine (CC BY-SA 4.0)</li>
            <li>Porotos granados — Pachanka (CC BY-SA 4.0)</li>
            <li>Cazuela de vacuno — TUTOXIC (CC BY-SA 4.0)</li>
            <li>Empanada de pino — J. B. (CC BY 2.0)</li>
            <li>Charquicán — Pablo Lobos Ovalle (CC BY-SA 4.0)</li>
            <li>Sopaipillas — Warko (CC BY-SA 3.0)</li>
            <li>Completo italiano — Bárb Santelices (CC0)</li>
            <li>Pan amasado — Alanis Galaz (CC BY-SA 3.0)</li>
            <li>Terremoto — Dirick91 (CC BY-SA 4.0)</li>
            <li>Mote con huesillo — Shadowmaster ra (CC BY-SA 4.0)</li>
          </ul>
          <p>Fotografías de Wikimedia Commons, publicadas bajo licencia:</p>
          <p class="footer-licencia">
            <a href="https://creativecommons.org/licenses/by-sa/4.0/deed.es"
              >Creative Commons BY-SA 4.0</a
            >
          </p>
        </details>
      </div>
    </footer>
    `;

    // La nav "Cuenta" cambia con la sesión. El footer no depende del header:
    // se consulta la sesión acá para que funcione en cualquier página.
    const invitado = this.querySelector("[data-footer-invitado]");
    const conSesion = this.querySelector("[data-footer-sesion]");
    const bloqueAdmin = this.querySelector("[data-footer-admin]");
    const salir = this.querySelector("[data-footer-salir]");

    function pintarCuenta(sesion) {
      const activa = Boolean(sesion);

      invitado.hidden = activa;
      conSesion.hidden = !activa;
      bloqueAdmin.hidden = true;

      if (!activa) return;

      supabase
        .from("usuarios")
        .select("rol")
        .eq("id", sesion.user.id)
        .single()
        .then(({ data, error }) => {
          if (error) {
            console.error("No se pudo leer el rol del usuario:", error);
            return;
          }

          bloqueAdmin.hidden =
            data?.rol !== "Administrador" && data?.rol !== "Vendedor";
        });
    }

    if (salir) {
      salir.addEventListener("click", async () => {
        const { error } = await supabase.auth.signOut();

        if (error) {
          console.error("No se pudo cerrar la sesión:", error.message);
        }
      });
    }

    supabase.auth.getSession().then(({ data }) => pintarCuenta(data.session));
    supabase.auth.onAuthStateChange((_evento, sesion) =>
      pintarCuenta(sesion),
    );
  }
}

customElements.define("site-footer", SiteFooter);
