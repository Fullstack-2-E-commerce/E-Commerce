import { supabase } from "./supabase.js";
import { errorCorreo } from "./validaciones.js";

const loginForm = document.getElementById("loginForm");

if (loginForm) {
  loginForm.addEventListener("submit", async function (event) {
    event.preventDefault();

    const email = document.getElementById("login-email").value.trim();
    const password = document.getElementById("login-password").value;

    const emailError = document.getElementById("login-emailError");
    const passwordError = document.getElementById("login-passwordError");
    const loginMessage = document.getElementById("loginMessage");

    // Limpiar mensajes anteriores
    if (emailError) emailError.textContent = "";
    if (passwordError) passwordError.textContent = "";
    if (loginMessage) loginMessage.textContent = "";

    let valido = true;

    // Validar correo
    const msgCorreo = errorCorreo(email);
    if (msgCorreo) {
      if (emailError) emailError.textContent = msgCorreo;
      valido = false;
    }

    // Validar contraseña
    if (password === "") {
      if (passwordError)
        passwordError.textContent = "La contraseña es obligatoria.";
      valido = false;
    } else if (password.length < 6) {
      if (passwordError)
        passwordError.textContent =
          "La contraseña debe tener al menos 6 caracteres.";
      valido = false;
    }

    if (!valido) return;

    // 1. Autenticar credenciales en Supabase Auth
    const { data, error } = await supabase.auth.signInWithPassword({
      email: email,
      password: password,
    });

    if (error) {
      if (loginMessage)
        loginMessage.textContent = "Correo o contraseña incorrectos.";
      return;
    }

    // 2. Obtener el rol del usuario desde la tabla public.usuarios
    const { data: perfil, error: errorPerfil } = await supabase
      .from("usuarios")
      .select("rol")
      .eq("id", data.user.id)
      .single();

    if (errorPerfil) {
      console.error("Error al consultar el rol del usuario:", errorPerfil);
    }

    // 3. Redirección según el rol y el origen.
    //    Un comprador que inicia sesión desde el modal de otra página (el
    //    checkout, por ejemplo) se queda donde está: sacarlo al home perdería
    //    el pedido que venía armando.
    const rol = perfil?.rol;
    const esAdmin = rol === "Administrador" || rol === "Vendedor";
    const vieneDeLogin = window.location.pathname.endsWith("/login.html");

    if (loginMessage) {
      loginMessage.textContent =
        esAdmin || vieneDeLogin
          ? "Inicio de sesión exitoso. Redirigiendo..."
          : "Sesión iniciada.";
    }

    if (!esAdmin && !vieneDeLogin) {
      document
        .querySelectorAll("dialog[open]")
        .forEach((ventana) => ventana.close());
      return;
    }

    setTimeout(() => {
      window.location.href = esAdmin
        ? "/src/pages/admin-productos.html"
        : "/index.html";
    }, 800);
  });
}
