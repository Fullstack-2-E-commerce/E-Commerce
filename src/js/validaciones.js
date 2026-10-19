/* Dominios de correo permitidos en login, registro y contacto. Vivía
   copiado en cada archivo con listas distintas: contacto rechazaba
   @duocuc.cl y los otros no. */
export const DOMINIOS_CORREO = [
  "@duoc.cl",
  "@duocuc.cl",
  "@profesor.duoc.cl",
  "@gmail.com",
];

export function errorCorreo(v) {
  if (!v) return "El correo es obligatorio.";
  if (v.length > 100) return "El correo no puede superar los 100 caracteres.";
  if (!DOMINIOS_CORREO.some((d) => v.endsWith(d)))
    return "Solo se permiten correos @duoc.cl, @duocuc.cl, @profesor.duoc.cl o @gmail.com.";
  return "";
}

/** 7990 -> "$7.990" */
export function precioCLP(valor) {
  return "$" + Number(valor).toLocaleString("es-CL");
}

/** Texto seguro para interpolar en plantillas HTML. */
export function escaparHTML(valor) {
  return String(valor ?? "").replace(
    /[&<>"']/g,
    (caracter) =>
      ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;",
      })[caracter],
  );
}
