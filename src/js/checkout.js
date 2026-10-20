// Confirmación del pedido: valida los datos de entrega, guarda el pedido en
// localStorage y vacía el carrito.
//
// El pedido guarda folio, fecha, líneas y total. Los datos de quien recibe
// (nombre, RUT, correo, dirección) viven solo en el formulario: al confirmar se
// limpian y no se escriben en ninguna parte.

import { supabase } from "./supabase.js";
import { carrito, monto, pintar, vaciar } from "./carrito.js";
import { poblarRegiones, regiones } from "./regiones.js";
import { errorCorreo, errorRut, precioCLP } from "./validaciones.js";

const CLAVE_PEDIDOS = "pedidos";

const form = document.getElementById("checkoutForm");

if (form) {
  const mensaje = document.getElementById("checkoutMessage");
  const boton = document.getElementById("checkoutButton");
  const modal = document.getElementById("pedidoModal");
  const folio = document.getElementById("pedidoFolio");
  const resumenFinal = document.getElementById("pedidoResumenFinal");
  const notaCuenta = document.getElementById("checkoutNota");

  const campos = {
    nombre: {
      input: document.getElementById("pedidoNombre"),
      error: document.getElementById("pedidoNombreError"),
      validar: (v) => {
        if (!v) return "El nombre es obligatorio.";
        if (v.length > 50)
          return "El nombre no puede superar los 50 caracteres.";
        return "";
      },
    },
    rut: {
      input: document.getElementById("pedidoRut"),
      error: document.getElementById("pedidoRutError"),
      validar: (v) => errorRut(v),
    },
    correo: {
      input: document.getElementById("pedidoCorreo"),
      error: document.getElementById("pedidoCorreoError"),
      validar: (v) => errorCorreo(v),
    },
    region: {
      input: document.getElementById("pedidoRegion"),
      error: document.getElementById("pedidoRegionError"),
      validar: (v) => (v ? "" : "Debes seleccionar una región."),
    },
    comuna: {
      input: document.getElementById("pedidoComuna"),
      error: document.getElementById("pedidoComunaError"),
      validar: (v) => (v ? "" : "Debes seleccionar una comuna."),
    },
    direccion: {
      input: document.getElementById("pedidoDireccion"),
      error: document.getElementById("pedidoDireccionError"),
      validar: (v) => {
        if (!v) return "La dirección es obligatoria.";
        if (v.length > 300)
          return "La dirección no puede superar los 300 caracteres.";
        return "";
      },
    },
  };

  poblarRegiones(campos.region.input, campos.comuna.input);

  function validarCampo(cfg) {
    const valor = cfg.input.value.trim();
    const error = cfg.validar(valor);

    cfg.error.textContent = error;
    cfg.input.setAttribute("aria-invalid", error ? "true" : "false");

    return !error;
  }

  Object.values(campos).forEach((cfg) => {
    const evento = cfg.input.tagName === "SELECT" ? "change" : "input";

    cfg.input.addEventListener(evento, () => validarCampo(cfg));
    cfg.input.addEventListener("blur", () => validarCampo(cfg));
  });

  // El carrito vacío no tiene nada que confirmar.
  function avisarCarritoVacio() {
    boton.disabled = true;
    mensaje.textContent =
      "Tu carrito está vacío. Agrega platos desde la carta y vuelve.";
    mensaje.className = "form-message error";
  }

  function limpiarFormulario() {
    form.reset();

    campos.comuna.input.innerHTML =
      '<option value="">Selecciona una comuna</option>';
    campos.comuna.input.disabled = true;

    Object.values(campos).forEach((cfg) => {
      cfg.error.textContent = "";
      cfg.input.setAttribute("aria-invalid", "false");
    });
  }

  function guardarPedido(pedido) {
    try {
      const guardados = JSON.parse(localStorage.getItem(CLAVE_PEDIDOS) || "[]");
      const lista = Array.isArray(guardados) ? guardados : [];

      lista.push(pedido);
      localStorage.setItem(CLAVE_PEDIDOS, JSON.stringify(lista));
    } catch (error) {
      console.error("No se pudo guardar el pedido:", error);
    }
  }

  // Con sesión abierta el formulario llega con los datos de la cuenta: son un
  // atajo, no un candado, y se pueden corregir.
  function completarConCuenta(sesion) {
    if (!sesion) {
      // Al cerrar sesión no se dejan los datos de la cuenta en pantalla.
      limpiarFormulario();
      return;
    }

    const datos = sesion.user.user_metadata || {};

    if (datos.nombre) campos.nombre.input.value = datos.nombre;
    if (datos.rut) campos.rut.input.value = datos.rut;
    if (sesion.user.email) campos.correo.input.value = sesion.user.email;
    if (datos.direccion) campos.direccion.input.value = datos.direccion;

    const indice = regiones.findIndex((region) => region.nombre === datos.region);

    if (indice !== -1) {
      campos.region.input.value = String(indice);
      campos.region.input.dispatchEvent(new Event("change"));

      if (datos.comuna) campos.comuna.input.value = datos.comuna;
    }

    notaCuenta.hidden = false;
  }

  form.addEventListener("submit", (evento) => {
    evento.preventDefault();

    const resultados = Object.values(campos).map(validarCampo);

    if (!resultados.every(Boolean)) {
      mensaje.textContent = "Revisa los campos marcados antes de confirmar.";
      mensaje.className = "form-message error";

      const primero = Object.values(campos).find((cfg) => cfg.error.textContent);

      if (primero) primero.input.focus();
      return;
    }

    if (carrito.length === 0) {
      avisarCarritoVacio();
      return;
    }

    const pedido = {
      folio: "SDC-" + Date.now().toString(36).toUpperCase(),
      fecha: new Date().toISOString(),
      lineas: carrito.map((item) => ({
        id: item.id,
        nombre: item.nombre,
        precio: Number(item.precio),
        cantidad: Number(item.cantidad),
      })),
      total: monto(),
    };

    guardarPedido(pedido);
    vaciar();
    pintar();
    limpiarFormulario();
    avisarCarritoVacio();

    folio.textContent = pedido.folio;
    resumenFinal.textContent =
      pedido.lineas.length +
      (pedido.lineas.length === 1 ? " plato por " : " platos por ") +
      precioCLP(pedido.total) +
      ".";

    if (modal && !modal.open) modal.showModal();
  });

  document.querySelectorAll("[data-pedido-cerrar]").forEach((nodo) => {
    nodo.addEventListener("click", () => {
      if (modal && modal.open) modal.close();
    });
  });

  // Paso previo: sin sesión se elige entre entrar o comprar de invitado. Con
  // sesión abierta, o con el carrito vacío, se va directo al formulario.
  const opciones = document.getElementById("checkoutOpciones");
  const botonInvitado = document.getElementById("checkoutInvitado");
  const invitacion = document.getElementById("checkoutInvitacion");
  const carritoVacio = carrito.length === 0;

  function resolverPaso(sesion) {
    // Con sesión la invitación a entrar sobra.
    if (invitacion) invitacion.hidden = Boolean(sesion);

    if (!opciones || carritoVacio || sesion) {
      if (opciones) opciones.hidden = true;
      form.hidden = false;
      return;
    }

    opciones.hidden = false;
    form.hidden = true;
  }

  if (botonInvitado) {
    botonInvitado.addEventListener("click", () => {
      if (opciones) opciones.hidden = true;
      form.hidden = false;
      campos.nombre.input.focus();
    });
  }

  supabase.auth.getSession().then(({ data }) => {
    completarConCuenta(data.session);
    resolverPaso(data.session);
  });

  supabase.auth.onAuthStateChange((_evento, sesion) => {
    completarConCuenta(sesion);
    resolverPaso(sesion);
  });

  if (carritoVacio) avisarCarritoVacio();
}
