/* Catálogo de la tienda. Única fuente de verdad de los platos: index.html
   muestra los destacados y productos.html el catálogo completo, las dos
   pintadas por tienda.js. Los precios van como número para no repetir el
   formato a mano. */

export const CATALOGO = [
  {
    slug: "porotos-granados",
    nombre: "Porotos granados",
    categoria: "Guiso de temporada",
    descripcion: "Porotos maduros, choclo y zapallo, bien aliñados.",
    precio: 6490,
    destacado: true,
  },
  {
    slug: "cazuela-de-vacuno",
    nombre: "Cazuela de vacuno",
    categoria: "La tradición",
    descripcion: "El clásico de los domingos, con verduras de la huerta.",
    precio: 8490,
    destacado: true,
  },
  {
    slug: "empanada-de-pino",
    nombre: "Empanada de pino",
    categoria: "De la fonda",
    descripcion: "Masa casera, pino jugoso y el sabor de las fiestas.",
    precio: 2990,
    destacado: true,
  },
  {
    slug: "charquican",
    nombre: "Charquicán",
    categoria: "Del campo",
    descripcion: "Zapallo y papa molidos con carne, huevo frito encima.",
    precio: 6990,
  },
  {
    slug: "sopaipillas",
    nombre: "Sopaipillas",
    categoria: "Para la once",
    descripcion: "Masa de zapallo frita, crujiente y calentita.",
    precio: 2490,
  },
  {
    slug: "completo",
    nombre: "Completo italiano",
    categoria: "De la esquina",
    descripcion: "Vienesa, palta y tomate en pan amasado.",
    precio: 4290,
  },
  {
    slug: "pan-amasado",
    nombre: "Pan amasado",
    categoria: "Recién horneado",
    descripcion: "Recién salido del horno, con masa de campo.",
    precio: 3190,
  },
  {
    slug: "terremoto",
    nombre: "Terremoto",
    categoria: "Para celebrar",
    descripcion: "Pipeño, helado de piña y granadina, bien helado.",
    precio: 3990,
  },
  {
    slug: "mote-con-huesillo",
    nombre: "Mote con huesillo",
    categoria: "Dulce de verano",
    descripcion: "Mote y huesillo en su jugo, el refresco de la plaza.",
    precio: 2790,
  },
  {
    slug: "pastel-de-choclo",
    nombre: "Pastel de choclo",
    categoria: "Plato típico",
    descripcion: "Choclo dulce con pino de carne, huevo y aceitunas.",
    precio: 7990,
    destacado: true,
  },
];

/** 7990 -> "$7.990" */
export function precioCLP(valor) {
  return "$" + valor.toLocaleString("es-CL");
}
