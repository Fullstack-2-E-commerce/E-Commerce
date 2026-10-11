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
    } else if (password.length < 4 || password.length > 10) {
      if (passwordError)
        passwordError.textContent =
          "La contraseña debe tener entre 4 y 10 caracteres.";
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

    if (loginMessage)
      loginMessage.textContent = "Inicio de sesión exitoso. Redirigiendo...";

    // 2. Obtener el rol del usuario desde la tabla public.usuarios
    const { data: perfil, error: errorPerfil } = await supabase
      .from("usuarios")
      .select("rol")
      .eq("id", data.user.id)
      .single();

    if (errorPerfil) {
      console.error("Error al consultar el rol del usuario:", errorPerfil);
    }

    // 3. Redirección basada en Rol
    setTimeout(() => {
      const rol = perfil?.rol;
      if (rol === "Administrador" || rol === "Vendedor") {
        window.location.href = "/src/pages/admin-productos.html";
      } else {
        window.location.href = "/index.html";
      }
    }, 800);
  });
}
