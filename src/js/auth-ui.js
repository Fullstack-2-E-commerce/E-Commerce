// Estado de sesión y apertura de los modales de login y registro.
// Solo se activa en páginas que traen el bloque de auth en el header.
import { supabaseClient } from "./supabase.js";

(function () {
  const entrar = document.getElementById("authEntrar");
  const salir = document.getElementById("authSalir");
  const sesion = document.getElementById("authSesion");
  const correo = document.getElementById("authCorreo");

  // Página sin el bloque de auth (por ahora, las dos páginas sueltas).
  if (!entrar || !salir || !sesion || !correo) return;

  const modales = {
    login: document.getElementById("authModalLogin"),
    registro: document.getElementById("authModalRegistro"),
  };

  function pintar(estado) {
    const activo = Boolean(estado);
    entrar.hidden = activo;
    sesion.classList.toggle("activa", activo);
    // El nombre vive en la tabla `usuarios`, que puede no existir todavia.
    // El email viene de Auth y esta garantizado.
    if (activo) correo.textContent = estado.user.email;
  }

  function abrir(quien) {
    const modal = modales[quien];
    if (modal && !modal.open) modal.showModal();
  }

  function cerrarTodos() {
    Object.values(modales).forEach((modal) => {
      if (modal && modal.open) modal.close();
    });
  }

  entrar.addEventListener("click", () => abrir("login"));

  salir.addEventListener("click", async () => {
    await supabaseClient.auth.signOut();
  });

  document.querySelectorAll("[data-auth-abrir]").forEach((boton) => {
    boton.addEventListener("click", () => abrir(boton.dataset.authAbrir));
  });

  document.querySelectorAll("[data-auth-cerrar]").forEach((boton) => {
    boton.addEventListener("click", cerrarTodos);
  });

  // "Crear cuenta" / "¿Ya tienes cuenta?" cambian de modal sin recargar.
  document.querySelectorAll("[data-auth-ir]").forEach((enlace) => {
    enlace.addEventListener("click", (evento) => {
      evento.preventDefault();
      cerrarTodos();
      abrir(enlace.dataset.authIr);
    });
  });

  // Clic en el fondo oscuro. <dialog> cierra con Escape, pero no con el backdrop.
  Object.values(modales).forEach((modal) => {
    if (!modal) return;
    modal.addEventListener("click", (evento) => {
      if (evento.target === modal) modal.close();
    });
  });

  supabaseClient.auth.getSession().then(({ data }) => pintar(data.session));
  supabaseClient.auth.onAuthStateChange((_evento, estado) => pintar(estado));
})();
