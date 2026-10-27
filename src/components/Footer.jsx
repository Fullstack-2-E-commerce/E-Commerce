import React, { useState, useEffect } from "react";
import { supabase } from "../js/supabase.js";

export function Footer() {
  const [sesion, setSesion] = useState(null);
  const [esAdminOVendedor, setEsAdminOVendedor] = useState(false);

  useEffect(() => {
    // 1. Cargar sesión inicial
    supabase.auth.getSession().then(({ data }) => {
      setSesion(data.session);
      verificarRol(data.session);
    });

    // 2. Escuchar cambios de estado en Auth
    const { data: authListener } = supabase.auth.onAuthStateChange(
      (_evento, nuevaSesion) => {
        setSesion(nuevaSesion);
        verificarRol(nuevaSesion);
      },
    );

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  const verificarRol = async (sesionActual) => {
    if (!sesionActual) {
      setEsAdminOVendedor(false);
      return;
    }

    const { data, error } = await supabase
      .from("usuarios")
      .select("rol")
      .eq("id", sesionActual.user.id)
      .single();

    if (error) {
      console.error("No se pudo leer el rol del usuario:", error);
      setEsAdminOVendedor(false);
      return;
    }

    setEsAdminOVendedor(
      data?.rol === "Administrador" || data?.rol === "Vendedor",
    );
  };

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error("No se pudo cerrar la sesión:", error.message);
    } else {
      window.location.href = "/";
    }
  };

  return (
    <footer className="site-footer">
      <div className="container footer-inner">
        <div className="footer-marca">
          <p className="footer-logo">Sabores de Chile</p>
          <p className="footer-tagline">
            Cocina casera hecha con cariño, del campo a tu mesa.
          </p>
        </div>

        <nav className="footer-nav" aria-label="Tienda">
          <h2 className="footer-titulo">Tienda</h2>
          <ul>
            <li>
              <a href="/">Home</a>
            </li>
            <li>
              <a href="/src/pages/productos.html">Productos</a>
            </li>
            <li>
              <a href="/src/pages/blogs.html">Blogs</a>
            </li>
            <li>
              <a href="/src/pages/nosotros.html">Nosotros</a>
            </li>
            <li>
              <a href="/src/pages/contacto.html">Contacto</a>
            </li>
          </ul>
        </nav>

        <nav className="footer-nav" aria-label="Cuenta">
          <h2 className="footer-titulo">Cuenta</h2>
          {!sesion ? (
            /* Usuario Invitado */
            <ul>
              <li>
                <a href="/src/pages/login.html">Iniciar sesión</a>
              </li>
              <li>
                <a href="/src/pages/registros.html">Crear cuenta</a>
              </li>
            </ul>
          ) : (
            /* Usuario con Sesión Activa */
            <ul>
              {esAdminOVendedor && (
                <li>
                  <a href="/src/pages/admin-productos.html">
                    Panel de administración
                  </a>
                </li>
              )}
              <li>
                <a href="/src/pages/cuenta.html">Mi cuenta</a>
              </li>
              <li>
                <a href="/src/pages/carrito.html">Mi pedido</a>
              </li>
              <li>
                <button
                  type="button"
                  className="footer-enlace"
                  onClick={handleLogout}
                >
                  Cerrar sesión
                </button>
              </li>
            </ul>
          )}
        </nav>

        <div className="footer-contacto">
          <h2 className="footer-titulo">Visítanos</h2>
          <address>
            Av. Providencia 1234, Santiago{" "}
            <a href="tel:+56912345678">+56 9 1234 5678</a>{" "}
            <a href="mailto:hola@saboresdechile.cl">hola@saboresdechile.cl</a>
          </address>
          <p className="footer-horario">Martes a domingo, 11:00 a 20:00</p>
        </div>
      </div>

      <div className="footer-bottom">
        <p>
          &copy; {new Date().getFullYear()} Sabores de Chile. Todos los derechos
          reservados.
        </p>
        <details className="footer-creditos">
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
          <p className="footer-licencia">
            <a href="https://creativecommons.org/licenses/by-sa/4.0/deed.es">
              Creative Commons BY-SA 4.0
            </a>
          </p>
        </details>
      </div>
    </footer>
  );
}
