console.log("Registro.js cargado");

const registroForm = document.getElementById("registroForm");

registroForm.addEventListener("submit", async function (event) {
  event.preventDefault();

  const rut = document.getElementById("rut").value.trim();
  const nombre = document.getElementById("nombre").value.trim();
  const apellidos = document.getElementById("apellidos").value.trim();
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value;
  const fechaNacimiento = document.getElementById("fechaNacimiento").value;
  const region = document.getElementById("region").value;
  const comuna = document.getElementById("comuna").value;
  const direccion = document.getElementById("direccion").value.trim();

  const rutError = document.getElementById("rutError");
  const nombreError = document.getElementById("nombreError");
  const apellidosError = document.getElementById("apellidosError");
  const emailError = document.getElementById("emailError");
  const passwordError = document.getElementById("passwordError");
  const regionError = document.getElementById("regionError");
  const comunaError = document.getElementById("comunaError");
  const direccionError = document.getElementById("direccionError");
  const registroMessage = document.getElementById("registroMessage");

  rutError.textContent = "";
  nombreError.textContent = "";
  apellidosError.textContent = "";
  emailError.textContent = "";
  passwordError.textContent = "";
  regionError.textContent = "";
  comunaError.textContent = "";
  direccionError.textContent = "";
  registroMessage.textContent = "";

  let valido = true;

  // RUT
  if (rut === "") {
    rutError.textContent = "El RUT es obligatorio.";
    valido = false;
  } else if (!/^\d{7,8}-[\dkK]$/.test(rut)) {
    rutError.textContent = "El RUT debe tener el formato 11111111-1.";
    valido = false;
  }

  // Nombre
  if (nombre === "") {
    nombreError.textContent = "El nombre es obligatorio.";
    valido = false;
  } else if (nombre.length > 50) {
    nombreError.textContent = "El nombre no puede superar los 50 caracteres.";
    valido = false;
  }

  // Apellidos
  if (apellidos === "") {
    apellidosError.textContent = "Los apellidos son obligatorios.";
    valido = false;
  } else if (apellidos.length > 100) {
    apellidosError.textContent =
      "Los apellidos no pueden superar los 100 caracteres.";
    valido = false;
  }

  // Correo
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

  // Contraseña
  if (password === "") {
    passwordError.textContent = "La contraseña es obligatoria.";
    valido = false;
  } else if (password.length < 4 || password.length > 10) {
    passwordError.textContent =
      "La contraseña debe tener entre 4 y 10 caracteres.";
    valido = false;
  }

  // Región
  if (region === "") {
    regionError.textContent = "Debes seleccionar una región.";
    valido = false;
  }

  // Comuna
  if (comuna === "") {
    comunaError.textContent = "Debes seleccionar una comuna.";
    valido = false;
  }

  // Dirección
  if (direccion === "") {
    direccionError.textContent = "La dirección es obligatoria.";
    valido = false;
  } else if (direccion.length > 300) {
    direccionError.textContent =
      "La dirección no puede superar los 300 caracteres.";
    valido = false;
  }

  if (!valido) {
    return;
  }

  const { data, error } = await supabaseClient.auth.signUp({
    email: email,
    password: password,
  });

  if (error) {
    registroMessage.textContent = "Error al crear la cuenta: " + error.message;
    return;
  }

  console.log("Usuario creado en Auth:", data.user);

  registroMessage.textContent =
    "Cuenta creada correctamente. Revisa tu correo para confirmar tu cuenta.";
});

const reenviarCorreo = document.getElementById("reenviarCorreo");

reenviarCorreo.addEventListener("click", async function () {
  const email = document.getElementById("email").value.trim();

  if (email === "") {
    registroMessage.textContent =
      "Ingresa tu correo para reenviar la confirmación.";
    return;
  }

  const { error } = await supabaseClient.auth.resend({
    type: "signup",
    email: email,
  });

  if (error) {
    registroMessage.textContent =
      "No se pudo reenviar el correo: " + error.message;
    return;
  }

  registroMessage.textContent =
    "Correo de confirmación reenviado correctamente.";
});
