import { supabase } from "./supabase.js";
import { poblarRegiones, regiones } from "./regiones.js";
import { errorCorreo } from "./validaciones.js";

// El formulario de registro de cada página es este mismo, con o sin navbar.
poblarRegiones(
  document.getElementById("region"),
  document.getElementById("comuna"),
);

console.log(" Script registro.js cargado correctamente");

const registroForm = document.getElementById("registroForm");

if (!registroForm) {
  console.error(" No se encontró el elemento #registroForm en el DOM");
} else {
  registroForm.addEventListener("submit", async function (event) {
    event.preventDefault();
    console.log(" Evento Submit disparado en el formulario de registro");

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
    const registroButton = document.getElementById("registroButton");

    // Limpiar mensajes
    if (rutError) rutError.textContent = "";
    if (nombreError) nombreError.textContent = "";
    if (apellidosError) apellidosError.textContent = "";
    if (emailError) emailError.textContent = "";
    if (passwordError) passwordError.textContent = "";
    if (regionError) regionError.textContent = "";
    if (comunaError) comunaError.textContent = "";
    if (direccionError) direccionError.textContent = "";
    if (registroMessage) registroMessage.textContent = "";

    let valido = true;

    if (rut === "") {
      if (rutError) rutError.textContent = "El RUT es obligatorio.";
      valido = false;
    } else if (!/^\d{7,8}-[\dkK]$/.test(rut)) {
      if (rutError)
        rutError.textContent = "El RUT debe tener el formato 11111111-1.";
      valido = false;
    }

    if (nombre === "") {
      if (nombreError) nombreError.textContent = "El nombre es obligatorio.";
      valido = false;
    }

    if (apellidos === "") {
      if (apellidosError)
        apellidosError.textContent = "Los apellidos son obligatorios.";
      valido = false;
    }

    const msgCorreo = errorCorreo(email);
    if (msgCorreo) {
      if (emailError) emailError.textContent = msgCorreo;
      valido = false;
    }

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

    if (region === "") {
      if (regionError)
        regionError.textContent = "Debes seleccionar una región.";
      valido = false;
    }

    if (comuna === "") {
      if (comunaError)
        comunaError.textContent = "Debes seleccionar una comuna.";
      valido = false;
    }

    if (direccion === "") {
      if (direccionError)
        direccionError.textContent = "La dirección es obligatoria.";
      valido = false;
    }

    if (!valido) {
      console.warn(" Formulario inválido, revisa los campos en rojo");
      return;
    }

    if (registroButton) {
      registroButton.disabled = true;
      registroButton.textContent = "Creando cuenta...";
    }

    try {
      const nombreRegion = regiones[region]?.nombre || region;

      // Un solo llamado a Supabase Auth. El Trigger se encarga de poblar la tabla `public.usuarios` automáticamente.
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
            region: nombreRegion,
            comuna: comuna,
            direccion: direccion,
          },
        },
      });

      if (error) {
        console.error("Error devuelto por Supabase Auth:", error);

        // Supabase Auth conoce las cuentas de auth.users; la tabla public.usuarios
        // no participa en esta comprobación.
        const yaExiste =
          error.code === "user_already_exists" ||
          /already registered/i.test(error.message);

        if (registroMessage) {
          registroMessage.textContent = yaExiste
            ? "Ese correo ya tiene una cuenta. Inicia sesión con tu contraseña."
            : "Error: " + error.message;
        }
        return;
      }

      console.log("Usuario registrado con éxito en Auth:", data);

      // Con la confirmación por correo apagada en el panel de Supabase, el
      // alta ya devuelve sesión: no hay correo que esperar y el modal sobra.
      const conSesion = Boolean(data.session);

      if (registroMessage) {
        registroMessage.textContent = conSesion
          ? "Cuenta creada. Sesión iniciada como " + email + "."
          : "Cuenta creada correctamente. Revisa tu correo para confirmarla.";
      }

      registroForm.reset();
      if (conSesion) registroForm.closest("dialog")?.close();
    } catch (err) {
      console.error("Error inesperado en la ejecución del submit:", err);
      if (registroMessage) {
        registroMessage.textContent =
          "Ocurrió un error inesperado al procesar el registro.";
      }
    } finally {
      if (registroButton) {
        registroButton.disabled = false;
        registroButton.textContent = "Crear cuenta";
      }
    }
  });
}
