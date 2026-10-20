// Mi cuenta: datos de entrega y contraseña.
//
// Los datos se escriben en dos lugares y hay que hacerlo a mano: en
// user_metadata (de ahí los leen el header y el prellenado del checkout) y en
// public.usuarios (donde vive el rol). No hay trigger de UPDATE que copie uno
// al otro.

import { supabase } from "./supabase.js";
import { poblarRegiones, regiones } from "./regiones.js";

const formDatos = document.getElementById("cuentaForm");
const formClave = document.getElementById("claveForm");
const sinSesion = document.getElementById("cuentaSinSesion");

if (formDatos && formClave && sinSesion) {
  const campos = {
    nombre: {
      input: document.getElementById("cuentaNombre"),
      error: document.getElementById("cuentaNombreError"),
      mensaje: "El nombre es obligatorio.",
    },
    apellidos: {
      input: document.getElementById("cuentaApellidos"),
      error: document.getElementById("cuentaApellidosError"),
      mensaje: "Los apellidos son obligatorios.",
    },
    region: {
      input: document.getElementById("cuentaRegion"),
      error: document.getElementById("cuentaRegionError"),
      mensaje: "Debes seleccionar una región.",
    },
    comuna: {
      input: document.getElementById("cuentaComuna"),
      error: document.getElementById("cuentaComunaError"),
      mensaje: "Debes seleccionar una comuna.",
    },
    direccion: {
      input: document.getElementById("cuentaDireccion"),
      error: document.getElementById("cuentaDireccionError"),
      mensaje: "La dirección es obligatoria.",
    },
  };

  const rut = document.getElementById("cuentaRut");
  const correo = document.getElementById("cuentaCorreo");
  const botonGuardar = document.getElementById("cuentaGuardar");
  const mensajeDatos = document.getElementById("cuentaMessage");

  const claveNueva = document.getElementById("cuentaClaveNueva");
  const claveRepetir = document.getElementById("cuentaClaveRepetir");
  const errorClaveNueva = document.getElementById("cuentaClaveNuevaError");
  const errorClaveRepetir = document.getElementById("cuentaClaveRepetirError");
  const botonClave = document.getElementById("cuentaClaveGuardar");
  const mensajeClave = document.getElementById("claveMessage");

  let usuarioId = null;

  poblarRegiones(campos.region.input, campos.comuna.input);

  function validar(cfg) {
    const valor = cfg.input.value.trim();
    const error = valor ? "" : cfg.mensaje;

    cfg.error.textContent = error;
    cfg.input.setAttribute("aria-invalid", error ? "true" : "false");

    return !error;
  }

  Object.values(campos).forEach((cfg) => {
    const evento = cfg.input.tagName === "SELECT" ? "change" : "input";

    cfg.input.addEventListener(evento, () => validar(cfg));
  });

  function avisar(nodo, texto, tipo) {
    nodo.textContent = texto;
    nodo.className = tipo ? "form-message " + tipo : "form-message";
  }

  // Con o sin sesión cambia lo que se ve; los datos salen de user_metadata.
  function pintarCuenta(sesion) {
    const activa = Boolean(sesion);

    sinSesion.hidden = activa;
    formDatos.hidden = !activa;
    formClave.hidden = !activa;

    if (!activa) {
      usuarioId = null;
      return;
    }

    usuarioId = sesion.user.id;

    const datos = sesion.user.user_metadata || {};

    campos.nombre.input.value = datos.nombre || "";
    campos.apellidos.input.value = datos.apellidos || "";
    campos.direccion.input.value = datos.direccion || "";

    rut.textContent = datos.rut || "—";
    correo.textContent = sesion.user.email || "—";

    const indice = regiones.findIndex(
      (region) => region.nombre === datos.region,
    );

    if (indice !== -1) {
      campos.region.input.value = String(indice);
      campos.region.input.dispatchEvent(new Event("change"));

      if (datos.comuna) campos.comuna.input.value = datos.comuna;
    }
  }

  formDatos.addEventListener("submit", async (evento) => {
    evento.preventDefault();

    if (!usuarioId) return;

    const validos = Object.values(campos).map(validar);

    if (!validos.every(Boolean)) {
      avisar(mensajeDatos, "Revisa los campos marcados.", "error");
      return;
    }

    const valores = {
      nombre: campos.nombre.input.value.trim(),
      apellidos: campos.apellidos.input.value.trim(),
      region: regiones[Number(campos.region.input.value)]?.nombre || "",
      comuna: campos.comuna.input.value,
      direccion: campos.direccion.input.value.trim(),
    };

    botonGuardar.disabled = true;
    avisar(mensajeDatos, "", "");

    const { error: errorAuth } = await supabase.auth.updateUser({
      data: valores,
    });

    if (errorAuth) {
      botonGuardar.disabled = false;
      console.error("No se pudieron guardar los datos:", errorAuth);
      avisar(mensajeDatos, "No se pudieron guardar los datos.", "error");
      return;
    }

    // La tabla no se actualiza sola: sin este paso el rol sigue, pero el resto
    // del perfil queda con los valores viejos.
    const { error: errorTabla } = await supabase
      .from("usuarios")
      .update(valores)
      .eq("id", usuarioId);

    botonGuardar.disabled = false;

    if (errorTabla) {
      console.error("No se pudo actualizar el perfil:", errorTabla);
      avisar(
        mensajeDatos,
        "La cuenta quedó al día, pero el perfil no se pudo copiar. Intenta de nuevo.",
        "error",
      );
      return;
    }

    avisar(mensajeDatos, "Datos guardados.", "exito");
  });

  formClave.addEventListener("submit", async (evento) => {
    evento.preventDefault();

    if (!usuarioId) return;

    errorClaveNueva.textContent = "";
    errorClaveRepetir.textContent = "";
    claveNueva.setAttribute("aria-invalid", "false");
    claveRepetir.setAttribute("aria-invalid", "false");
    avisar(mensajeClave, "", "");

    const nueva = claveNueva.value;

    if (nueva.length < 6) {
      errorClaveNueva.textContent =
        "La contraseña debe tener al menos 6 caracteres.";
      claveNueva.setAttribute("aria-invalid", "true");
      return;
    }

    if (nueva !== claveRepetir.value) {
      errorClaveRepetir.textContent = "Las contraseñas no coinciden.";
      claveRepetir.setAttribute("aria-invalid", "true");
      return;
    }

    botonClave.disabled = true;

    const { error } = await supabase.auth.updateUser({ password: nueva });

    botonClave.disabled = false;

    if (error) {
      console.error("No se pudo cambiar la contraseña:", error);
      avisar(mensajeClave, "No se pudo cambiar la contraseña.", "error");
      return;
    }

    formClave.reset();
    avisar(mensajeClave, "Contraseña cambiada.", "exito");
  });

  supabase.auth.getSession().then(({ data }) => pintarCuenta(data.session));
  supabase.auth.onAuthStateChange((_evento, sesion) => pintarCuenta(sesion));
}
