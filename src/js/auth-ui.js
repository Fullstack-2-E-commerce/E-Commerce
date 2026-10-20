// Estado de sesión y modales de login y registro.
// El carrito vive en carrito.js: acá solo se abre el panel.

import { supabase } from "./supabase.js";
import { pintar } from "./carrito.js";

(function () {
  const entrar = document.getElementById("authEntrar");
  const registrar = document.getElementById("authRegistrar");
  const salir = document.getElementById("authSalir");
  const sesion = document.getElementById("authSesion");
  const usuario = document.getElementById("authUsuario");
  const nombre = document.getElementById("authNombre");
  const inicial = document.getElementById("authInicial");

  const cartTrigger = document.getElementById("cartTrigger");
  const cartModal = document.getElementById("cartModal");
  const cartCerrar = document.getElementById("cartCerrar");

  // Página sin el bloque de autenticación.
  if (!entrar || !salir || !sesion || !nombre) return;

  const modales = {
    login: document.getElementById("authModalLogin"),
    registro: document.getElementById("authModalRegistro"),
  };

  // Mostrar u ocultar la sesión del usuario.
  function pintarSesion(estado) {
    const activo = Boolean(estado);

    entrar.hidden = activo;

    // Con sesión abierta el botón de registro sobra: ya hay cuenta.
    if (registrar) registrar.hidden = activo;

    sesion.classList.toggle("activa", activo);

    if (!activo) return;

    // El nombre del perfil, con el correo como respaldo: es más corto y más
    // legible en el header que la dirección completa.
    const datos = estado.user.user_metadata || {};
    const completo = (datos.nombre || "").trim();
    const correo = estado.user.email || "";
    const etiqueta = completo || correo.split("@")[0];

    nombre.textContent = etiqueta;
    inicial.textContent = etiqueta.charAt(0).toUpperCase();

    if (usuario) {
      usuario.title = completo ? completo + " <" + correo + ">" : correo;
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

  // Botón iniciar sesión.
  entrar.addEventListener("click", () => {
    abrir("login");
  });

  // Botón del carrito.
  if (cartTrigger && cartModal) {
    cartTrigger.addEventListener("click", () => {
      pintar();

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

  // Cerrar sesión.
  salir.addEventListener("click", async () => {
    const { error } = await supabase.auth.signOut();

    if (error) {
      console.error("No se pudo cerrar la sesión:", error.message);
    }
  });

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

  // Comprobar sesión actual.
  supabase.auth
    .getSession()
    .then(({ data }) => pintarSesion(data.session))
    .catch((error) => {
      console.error("No se pudo comprobar la sesión:", error);
    });

  // Escuchar cambios de sesión.
  supabase.auth.onAuthStateChange((_evento, estado) => pintarSesion(estado));
})();
