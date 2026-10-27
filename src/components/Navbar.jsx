import React, { useState, useEffect } from "react";
import { supabase } from "../js/supabase.js";

export function Navbar() {
  const [menuAbierto, setMenuAbierto] = useState(false);
  const [sesion, setSesion] = useState(null);
  const [nombreUsuario, setNombreUsuario] = useState("");
  const path = window.location.pathname;

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSesion(data.session);
      obtenerNombrePerfil(data.session);
    });

    const { data: authListener } = supabase.auth.onAuthStateChange(
      (_evento, nuevaSesion) => {
        setSesion(nuevaSesion);
        obtenerNombrePerfil(nuevaSesion);
      },
    );

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  const obtenerNombrePerfil = async (sesionActual) => {
    if (!sesionActual) {
      setNombreUsuario("");
      return;
    }

    const { data, error } = await supabase
      .from("usuarios")
      .select("nombre, email")
      .eq("id", sesionActual.user.id)
      .single();

    if (!error && data) {
      setNombreUsuario(data.nombre || data.email || "Usuario");
    } else {
      setNombreUsuario(sesionActual.user.email);
    }
  };

  const toggleMenu = () => {
    setMenuAbierto(!menuAbierto);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.href = "/";
  };

  const abrirModal = (modalId) => {
    const modal = document.getElementById(modalId);
    if (modal && !modal.open) {
      modal.showModal();
    }
  };

  const cerrarModal = (modalId) => {
    const modal = document.getElementById(modalId);
    if (modal && modal.open) {
      modal.close();
    }
  };

  const cambiarModal = (deModalId, aModalId) => {
    cerrarModal(deModalId);
    abrirModal(aModalId);
  };

  const inicial = nombreUsuario ? nombreUsuario.charAt(0).toUpperCase() : "U";

  return (
    <>
      <header className="site-header">
        <div
          className={`container header-inner ${menuAbierto ? "nav-abierta" : ""}`}
        >
          <a href="/" className="logo">
            Sabores de <span className="logo-em">Chile</span>
          </a>

          {/* Botón Menú Hamburguesa */}
          <button
            type="button"
            className="nav-toggle"
            id="navToggle"
            aria-expanded={menuAbierto}
            aria-label={menuAbierto ? "Cerrar menú" : "Abrir menú"}
            onClick={toggleMenu}
          >
            <svg
              viewBox="0 0 24 24"
              width="20"
              height="20"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="square"
              aria-hidden="true"
            >
              <path d="M4 7h16M4 12h16M4 17h16" />
            </svg>
          </button>

          {/* Navegación Principal */}
          <nav
            className="main-nav"
            id="navPrincipal"
            aria-label="Navegación principal"
          >
            <ul>
              <li>
                <a
                  href="/"
                  className={`nav-link ${path === "/" || path === "/index.html" ? "is-active" : ""}`}
                >
                  Home
                </a>
              </li>
              <li>
                <a
                  href="/src/pages/productos.html"
                  className={`nav-link ${path.includes("productos") ? "is-active" : ""}`}
                >
                  Productos
                </a>
              </li>
              <li>
                <a
                  href="/src/pages/blogs.html"
                  className={`nav-link ${path.includes("blogs") ? "is-active" : ""}`}
                >
                  Blogs
                </a>
              </li>
              <li>
                <a
                  href="/src/pages/nosotros.html"
                  className={`nav-link ${path.includes("nosotros") ? "is-active" : ""}`}
                >
                  Nosotros
                </a>
              </li>
              <li>
                <a
                  href="/src/pages/contacto.html"
                  className={`nav-link ${path.includes("contacto") ? "is-active" : ""}`}
                >
                  Contacto
                </a>
              </li>
            </ul>
          </nav>

          {/* Acciones de Auth */}
          <div className="header-acciones">
            {sesion ? (
              <div className="auth-sesion activa" id="authSesion">
                <a
                  className="auth-usuario"
                  id="authUsuario"
                  href="/src/pages/cuenta.html"
                >
                  <span className="auth-inicial">{inicial}</span>
                  <span className="auth-nombre">{nombreUsuario}</span>
                </a>
                <button
                  type="button"
                  className="auth-salir"
                  id="authSalir"
                  onClick={handleLogout}
                >
                  Salir
                </button>
              </div>
            ) : (
              <>
                <button
                  type="button"
                  className="auth-trigger auth-trigger--linea"
                  id="authEntrar"
                  onClick={() => abrirModal("authModalLogin")}
                >
                  Iniciar sesión
                </button>
                <button
                  type="button"
                  className="auth-trigger"
                  id="authRegistrar"
                  onClick={() => abrirModal("authModalRegistro")}
                >
                  Registrarse
                </button>
              </>
            )}

            {/* Trigger del Carrito */}
            <button
              type="button"
              className="auth-trigger auth-trigger--carrito"
              id="cartTrigger"
              aria-haspopup="dialog"
              onClick={() => abrirModal("cartModal")}
            >
              <svg
                className="icono-carrito"
                viewBox="0 0 24 24"
                width="20"
                height="20"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.75"
                strokeLinecap="square"
                aria-hidden="true"
              >
                <path d="M3 4h2.4l2.6 10.4h9.6L20 7.2H6.2" />
                <circle cx="9.6" cy="19" r="1.5" />
                <circle cx="17" cy="19" r="1.5" />
              </svg>
              <span className="cart-trigger-texto">Carrito</span>
              <span
                className="cart-count"
                id="cartCount"
                data-carrito-count
                aria-live="polite"
              >
                0
              </span>
            </button>
          </div>
        </div>
      </header>

      {/* Modal Carrito */}
      <dialog
        className="cart-modal"
        id="cartModal"
        aria-labelledby="cartTitulo"
      >
        <div className="cart-cabecera">
          <h2 className="cart-titulo" id="cartTitulo">
            Mi carrito
          </h2>
          <button
            type="button"
            className="cart-cerrar"
            aria-label="Cerrar carrito"
            onClick={() => cerrarModal("cartModal")}
          >
            <svg
              viewBox="0 0 24 24"
              width="18"
              height="18"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="square"
            >
              <path d="M5 5l14 14M19 5L5 19" />
            </svg>
          </button>
        </div>
        <div className="cart-cuerpo">
          <div
            id="cartItems"
            className="cart-lineas"
            data-carrito-lineas
            tabIndex={-1}
          ></div>
        </div>
        <div className="cart-pie" id="cartPie" data-carrito-pie>
          <div className="cart-total">
            <span className="cart-total-etiqueta">Total</span>
            <strong
              className="cart-total-monto"
              id="cartTotal"
              data-carrito-total
            >
              $0
            </strong>
          </div>
          <div className="cart-acciones">
            <button
              type="button"
              className="cart-btn cart-btn--fantasma cart-vaciar"
            >
              Vaciar carrito
            </button>
            <a
              className="cart-btn cart-btn--primario"
              href="/src/pages/checkout.html"
            >
              Continuar compra
            </a>
          </div>
          <a className="cart-ver-pagina" href="/src/pages/carrito.html">
            Ver el carrito completo
          </a>
        </div>
      </dialog>

      {/* Modal Login */}
      <dialog
        className="auth-modal"
        id="authModalLogin"
        aria-labelledby="authTituloLogin"
      >
        <div className="auth-modal-cabecera">
          <h2 id="authTituloLogin">Iniciar sesión</h2>
          <button
            type="button"
            className="auth-modal-cerrar"
            aria-label="Cerrar"
            onClick={() => cerrarModal("authModalLogin")}
          >
            &times;
          </button>
        </div>
        <div className="auth-modal-cuerpo">
          <form id="loginForm" noValidate>
            <div className="form-group">
              <label htmlFor="login-email">Correo electrónico</label>
              <input
                type="email"
                id="login-email"
                name="email"
                maxLength={100}
                placeholder="ejemplo@gmail.com"
                autoComplete="email"
                required
              />
              <small
                id="login-emailError"
                className="error-message"
                aria-live="polite"
              ></small>
            </div>

            <div className="form-group">
              <label htmlFor="login-password">Contraseña</label>
              <input
                type="password"
                id="login-password"
                name="password"
                placeholder="Mínimo 6 caracteres"
                autoComplete="current-password"
                required
              />
              <small
                id="login-passwordError"
                className="error-message"
                aria-live="polite"
              ></small>
            </div>

            <button type="submit" className="btn">
              Iniciar sesión
            </button>
            <p
              id="loginMessage"
              className="form-message"
              aria-live="polite"
            ></p>

            <p className="register-link">
              ¿No tienes una cuenta?{" "}
              <a
                href="/src/pages/registros.html"
                onClick={(e) => {
                  e.preventDefault();
                  cambiarModal("authModalLogin", "authModalRegistro");
                }}
              >
                Crear cuenta
              </a>
            </p>
          </form>
        </div>
      </dialog>

      {/* Modal Registro */}
      <dialog
        className="auth-modal"
        id="authModalRegistro"
        aria-labelledby="authTituloRegistro"
      >
        <div className="auth-modal-cabecera">
          <h2 id="authTituloRegistro">Crear cuenta</h2>
          <button
            type="button"
            className="auth-modal-cerrar"
            aria-label="Cerrar"
            onClick={() => cerrarModal("authModalRegistro")}
          >
            &times;
          </button>
        </div>
        <div className="auth-modal-cuerpo">
          <form id="registroForm" noValidate>
            <div className="form-group">
              <label htmlFor="rut">RUT</label>
              <input
                type="text"
                id="rut"
                name="rut"
                placeholder="11111111-1"
                maxLength={10}
                required
              />
              <small
                id="rutError"
                className="error-message"
                aria-live="polite"
              ></small>
            </div>

            <div className="form-group">
              <label htmlFor="nombre">Nombre</label>
              <input
                type="text"
                id="nombre"
                name="nombre"
                placeholder="Tu nombre"
                maxLength={50}
                autoComplete="name"
                required
              />
              <small
                id="nombreError"
                className="error-message"
                aria-live="polite"
              ></small>
            </div>

            <div class="form-group">
              <label htmlFor="apellidos">Apellidos</label>
              <input
                type="text"
                id="apellidos"
                name="apellidos"
                placeholder="Tus apellidos"
                maxLength={100}
                required
              />
              <small
                id="apellidosError"
                className="error-message"
                aria-live="polite"
              ></small>
            </div>

            <div className="form-group">
              <label htmlFor="email">Correo electrónico</label>
              <input
                type="email"
                id="email"
                name="email"
                maxLength={100}
                placeholder="ejemplo@gmail.com"
                autoComplete="email"
                required
              />
              <small
                id="emailError"
                className="error-message"
                aria-live="polite"
              ></small>
            </div>

            <div className="form-group">
              <label htmlFor="password">Contraseña</label>
              <input
                type="password"
                id="password"
                name="password"
                placeholder="Mínimo 6 caracteres"
                autoComplete="new-password"
                required
              />
              <small
                id="passwordError"
                className="error-message"
                aria-live="polite"
              ></small>
            </div>

            <div className="form-group">
              <label htmlFor="fechaNacimiento">Fecha de nacimiento</label>
              <input
                type="date"
                id="fechaNacimiento"
                name="fechaNacimiento"
                autoComplete="bday"
              />
              <small
                id="fechaNacimientoError"
                className="error-message"
                aria-live="polite"
              ></small>
            </div>

            <div className="form-group">
              <label htmlFor="region">Región</label>
              <select id="region" name="region" required>
                <option value="">Selecciona una región</option>
              </select>
              <small
                id="regionError"
                className="error-message"
                aria-live="polite"
              ></small>
            </div>

            <div className="form-group">
              <label htmlFor="comuna">Comuna</label>
              <select id="comuna" name="comuna" disabled required>
                <option value="">Selecciona una comuna</option>
              </select>
              <small
                id="comunaError"
                className="error-message"
                aria-live="polite"
              ></small>
            </div>

            <div className="form-group">
              <label htmlFor="direccion">Dirección</label>
              <input
                type="text"
                id="direccion"
                name="direccion"
                placeholder="Calle y número"
                maxLength={300}
                autoComplete="street-address"
                required
              />
              <small
                id="direccionError"
                className="error-message"
                aria-live="polite"
              ></small>
            </div>

            <button type="submit" id="registroButton" className="btn">
              Crear cuenta
            </button>
            <p
              id="registroMessage"
              className="form-message"
              aria-live="polite"
            ></p>

            <p className="register-link">
              ¿Ya tienes una cuenta?{" "}
              <a
                href="/src/pages/login.html"
                onClick={(e) => {
                  e.preventDefault();
                  cambiarModal("authModalRegistro", "authModalLogin");
                }}
              >
                Iniciar sesión
              </a>
            </p>
          </form>
        </div>
      </dialog>
    </>
  );
}
