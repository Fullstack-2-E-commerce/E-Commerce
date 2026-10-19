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

/** Un RUT válido con módulo 11: "11111111-1", "76.086.428-5", "12345678K".
    Devuelve "" o el mensaje de error. */
export function errorRut(valor) {
  const limpio = String(valor ?? "")
    .replace(/[.\s-]/g, "")
    .toUpperCase();

  if (!limpio) return "El RUT es obligatorio.";

  if (!/^\d{7,8}[\dK]$/.test(limpio))
    return "El RUT debe tener 7 u 8 dígitos y un dígito verificador.";

  const cuerpo = limpio.slice(0, -1);
  const dv = limpio.slice(-1);
  let suma = 0;
  let factor = 2;

  for (let i = cuerpo.length - 1; i >= 0; i--) {
    suma += Number(cuerpo[i]) * factor;
    factor = factor === 7 ? 2 : factor + 1;
  }

  const resto = 11 - (suma % 11);
  const esperado = resto === 11 ? "0" : resto === 10 ? "K" : String(resto);

  return esperado === dv ? "" : "El RUT no es válido.";
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
