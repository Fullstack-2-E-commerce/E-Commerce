<<<<<<< Updated upstream
import { supabaseClient } from "./supabase.js";
import { regiones } from "./regiones.js";
import { errorCorreo } from "./validaciones.js";
=======
// Importar cliente de Supabase y regiones
import { supabase } from "./supabase.js";
import { regiones } from "./regiones.js";
>>>>>>> Stashed changes

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

  // Validación de RUT
  if (rut === "") {
    rutError.textContent = "El RUT es obligatorio.";
    valido = false;
  } else if (!/^\d{7,8}-[\dkK]$/.test(rut)) {
    rutError.textContent = "El RUT debe tener el formato 11111111-1.";
    valido = false;
  }

  // Validación de Nombre
  if (nombre === "") {
    nombreError.textContent = "El nombre es obligatorio.";
    valido = false;
  } else if (nombre.length > 50) {
    nombreError.textContent = "El nombre no puede superar los 50 caracteres.";
    valido = false;
  }

  // Validación de Apellidos
  if (apellidos === "") {
    apellidosError.textContent = "Los apellidos son obligatorios.";
    valido = false;
  } else if (apellidos.length > 100) {
    apellidosError.textContent =
      "Los apellidos no pueden superar los 100 caracteres.";
    valido = false;
  }

<<<<<<< Updated upstream
  // Correo
  const msgCorreo = errorCorreo(email);
  if (msgCorreo) {
    emailError.textContent = msgCorreo;
=======
  // Validación de Correo
  if (email === "") {
    emailError.textContent = "El correo es obligatorio.";
>>>>>>> Stashed changes
    valido = false;
  }

  // Validación de Contraseña
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

  if (!valido) return;

  // Cambiado a supabase (el cliente importado)
  const { data, error } = await supabase.auth.signUp({
    email: email,
    password: password,
    options: {
      emailRedirectTo: `${window.location.origin}/src/pages/login.html`,
      data: {
        rut: rut,
        nombre: nombre,
        apellidos: apellidos,
        fecha_nacimiento: fechaNacimiento || null,
        region: regiones[region]?.nombre || region,
        comuna: comuna,
        direccion: direccion,
      },
    },
  });

  if (error) {
    registroMessage.textContent = "Error al crear la cuenta: " + error.message;
    return;
  }

  registroMessage.textContent =
    "Cuenta creada correctamente. Revisa tu correo para confirmar tu cuenta.";
});

// Reenviar correo
const reenviarCorreo = document.getElementById("reenviarCorreo");

reenviarCorreo?.addEventListener("click", async function () {
  const email = document.getElementById("email").value.trim();
  const registroMessage = document.getElementById("registroMessage");

  if (email === "") {
    registroMessage.textContent =
      "Ingresa tu correo para reenviar la confirmación.";
    return;
  }

  const { error } = await supabase.auth.resend({
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
