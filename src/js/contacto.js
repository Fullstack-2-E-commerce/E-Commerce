// Validación formulario contacto — solo memoria, sin Web Storage (decisión de seguridad).
(function () {
  const form = document.getElementById("contactoForm");
  if (!form) return;

  const campos = {
    nombre: {
      input: document.getElementById("nombre"),
      error: document.getElementById("nombreError"),
      validar: (v) => {
        if (!v) return "El nombre es obligatorio.";
        if (v.length > 50)
          return "El nombre no puede superar los 50 caracteres.";
        return "";
      },
    },
    correo: {
      input: document.getElementById("correo"),
      error: document.getElementById("correoError"),
      validar: (v) => {
        if (!v) return "El correo es obligatorio.";
        if (v.length > 100)
          return "El correo no puede superar los 100 caracteres.";
        const ok =
          v.endsWith("@duoc.cl") ||
          v.endsWith("@profesor.duoc.cl") ||
          v.endsWith("@gmail.com");
        if (!ok)
          return "Solo se permiten correos @duoc.cl, @profesor.duoc.cl o @gmail.com.";
        return "";
      },
    },
    asunto: {
      input: document.getElementById("asunto"),
      error: document.getElementById("asuntoError"),
      validar: (v) => {
        if (!v) return "El asunto es obligatorio.";
        if (v.length > 100)
          return "El asunto no puede superar los 100 caracteres.";
        return "";
      },
    },
    mensaje: {
      input: document.getElementById("mensaje"),
      error: document.getElementById("mensajeError"),
      validar: (v) => {
        if (!v) return "El mensaje es obligatorio.";
        if (v.length < 10)
          return "El mensaje debe tener al menos 10 caracteres.";
        if (v.length > 1000)
          return "El mensaje no puede superar los 1000 caracteres.";
        return "";
      },
    },
  };

  function validarCampo(cfg) {
    const valor = cfg.input.value.trim();
    const msg = cfg.validar(valor);
    cfg.error.textContent = msg;
    cfg.input.closest(".campo").classList.toggle("invalido", Boolean(msg));
    cfg.input.setAttribute("aria-invalid", msg ? "true" : "false");
    return !msg;
  }

  Object.values(campos).forEach((cfg) => {
    cfg.input.addEventListener("input", () => validarCampo(cfg));
    cfg.input.addEventListener("blur", () => validarCampo(cfg));
  });

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const resultados = Object.values(campos).map(validarCampo);
    const mensaje = document.getElementById("contactoMessage");
    if (resultados.every(Boolean)) {
      mensaje.textContent =
        "Mensaje listo para enviar. Nos pondremos en contacto a la brevedad.";
      mensaje.className = "form-message exito";
      form.reset();
      Object.values(campos).forEach((cfg) =>
        cfg.input.closest(".campo").classList.remove("invalido"),
      );
    } else {
      mensaje.textContent = "Revisa los campos marcados antes de enviar.";
      mensaje.className = "form-message error";
      const primero = Object.values(campos).find((c) => c.error.textContent);
      if (primero) primero.input.focus();
    }
  });
})();
