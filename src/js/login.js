const loginForm = document.getElementById("loginForm");

loginForm.addEventListener("submit", async function (event) {
  event.preventDefault();

  // Prefijo login-: en las páginas de la tienda el modal de registro usa los
  // ids sin prefijo (los espera registro.js), asi que "email" y "password"
  // ya existen en el documento. Sin prefijo, getElementById devolveria el
  // campo del registro y el login leeria los datos equivocados.
  const email = document.getElementById("login-email").value.trim();
  const password = document.getElementById("login-password").value;

  const emailError = document.getElementById("login-emailError");
  const passwordError = document.getElementById("login-passwordError");
  const loginMessage = document.getElementById("loginMessage");

  // Limpiar mensajes anteriores
  emailError.textContent = "";
  passwordError.textContent = "";
  loginMessage.textContent = "";

  let valido = true;

  // Validar correo
  if (email === "") {
    emailError.textContent = "El correo es obligatorio.";
    valido = false;
  } else if (email.length > 100) {
    emailError.textContent = "El correo no puede superar los 100 caracteres.";
    valido = false;
  } else {
    const correoValido =
      email.endsWith("@duoc.cl") ||
      email.endsWith("@duocuc.cl") ||
      email.endsWith("@profesor.duoc.cl") ||
      email.endsWith("@gmail.com");

    if (!correoValido) {
      emailError.textContent =
        "Solo se permiten correos @duoc.cl, @duocuc.cl, @profesor.duoc.cl o @gmail.com.";
      valido = false;
    }
  }

  // Validar contraseña
  if (password === "") {
    passwordError.textContent = "La contraseña es obligatoria.";
    valido = false;
  } else if (password.length < 4 || password.length > 10) {
    passwordError.textContent =
      "La contraseña debe tener entre 4 y 10 caracteres.";
    valido = false;
  }

  // Si hay errores, no continuar
  if (!valido) {
    return;
  }

  // Intentar iniciar sesión con Supabase
  const { data, error } = await supabaseClient.auth.signInWithPassword({
    email: email,
    password: password,
  });

  if (error) {
    loginMessage.textContent = "Correo o contraseña incorrectos.";
    return;
  }

  loginMessage.textContent = "Inicio de sesión exitoso.";

  const datosUsuarioPendiente = localStorage.getItem("datosUsuarioPendiente");

  if (datosUsuarioPendiente) {
    const datosUsuario = JSON.parse(datosUsuarioPendiente);

    datosUsuario.id = data.user.id;

    const { error: errorPerfil } = await supabaseClient
      .from("usuarios")
      .insert([datosUsuario]);

    if (errorPerfil) {
      console.error("Error al guardar los datos del usuario:", errorPerfil);
    } else {
      localStorage.removeItem("datosUsuarioPendiente");
    }
  }

  setTimeout(() => {
    window.location.href = "home.html";
  }, 1000);
});
