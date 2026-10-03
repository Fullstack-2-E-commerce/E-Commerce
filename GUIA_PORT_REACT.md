# Guía: portar el E-Commerce a React + Vite + Bootstrap

> Documento para el equipo. Cada paso dice qué se hace, qué archivo queda y cómo
> se comprueba que salió bien. Está pensado para que puedas repetir el port
> entero desde cero, no solo para leer qué se hizo.

**Partida:** el sitio HTML plano, en `legacy-html/`.
**Llegada:** una app de React con Vite y Bootstrap, servida desde la raíz.

---

## 0. Antes de empezar: qué cambia y qué no

El sitio plano son 7 archivos `.html` sueltos. Cada uno tiene su `<head>`, sus
`<link>` al CSS y sus 4 `<script>` al final. El header y el footer están
**copiados byte a byte** en las 5 páginas de tienda, y los dos modales de
login/registro también.

Eso no es un problema: es el punto de partida. En React el header se escribe
**una vez** y las 5 páginas lo montan solas. Por eso el port borra más de lo que
escribe.

| En el sitio plano | En React |
| --- | --- |
| 7 archivos `.html` | 1 `index.html` + un enrutador |
| Header y footer repetidos 5 veces | `<Header>` y `<Footer>` importados |
| `innerHTML` para pintar tarjetas | JSX y `.map()` |
| `document.getElementById` para leer el formulario | Estado de React |
| `<dialog>` abiertos a mano | Modal de Bootstrap |
| `supabase` desde un `<script>` del CDN | `@supabase/supabase-js` por npm |
| 7`<link>` al CSS | 8 imports en `main.jsx`, uno solo |

---

## 1. Instalar el proyecto

El sitio plano no tiene `package.json`. Se crea desde cero.

```bash
npm create vite@latest . -- --template react
```

Si el directorio no está vacío (es nuestro caso), Vite pregunta si quiere
continuar. Decir que sí **no borra nada**: solo avisa de que puede no escribir
encima de archivos existentes.

Después, las dependencias:

```bash
npm install react-router-dom bootstrap @supabase/supabase-js
```

**Qué queda:** `package.json` con 4 dependencias y `devDependencies` con Vite y el
plugin de React. Node 18 o superior.

**Cómo se comprueba:** `npm run dev` levanta el servidor en el puerto 5173 y
aparece el sitio de prueba de Vite.

---

## 2. Mover los assets

Las fotos y el video no se importan desde el código: son archivos que se
se sirven tal cual. En Vite esos archivos van en `public/`, y se llaman con ruta
absoluta desde la raíz.

```bash
mkdir -p public
mv src/assets public/assets
```

**Qué queda:** `public/assets/img/` con las 10 fotos `.webp` y
`public/assets/videos/` con el video y su póster.

**El cambio clave:** las rutas pasan a ser absolutas.

```js
// antes, en el sitio plano
src="../assets/img/pastel-de-choclo.webp"

// ahora
src="/assets/img/pastel-de-choclo.webp"
```

Sin la barra inicial, el navegador busca la foto dentro de `/productos/assets/...`
y da 404.

---

## 3. Los datos: catálogo y regiones

Los datos no son lógica, son contenido. Se sacan a su propia carpeta para que
los componentes solo los importen.

### `src/data/catalogo.js`

El arreglo `CATALOGO` del sitio plano, tal cual. Solo cambian dos cosas: `const`
pasa a `export const`, y se le agrega el comentario.

```js
export const CATALOGO = [
  {
    slug: "pastel-de-choclo",
    nombre: "Pastel de choclo",
    categoria: "Plato típico",
    descripcion: "Choclo dulce con pino de carne, huevo y aceitunas.",
    precio: 7990,
    destacado: true,
  },
  // …los otros 9 platos
];
```

Los precios son números, no strings. El formato se aplica al pintar, con una
función suelta:

```js
export function precioCLP(valor) {
  return "$" + valor.toLocaleString("es-CL");
}
```

`7990` → `"$7.990"`. Esa función va en `src/lib/validaciones.js`, junto con las
reglas de validación (ver paso 9).

### `src/data/regiones.js`

Lo mismo con las 16 regiones y sus 324 comunas. Del sitio plano se copia **solo
el arreglo**; los dos listeners que appendaban `<option>` a los `<select>` se
descartan, porque en React el `<select>` se pinta declarando sus opciones.

**Cómo se comprueba:**

```bash
node -e "import('./src/data/regiones.js').then(m=>console.log(m.REGIONES.length))"
# 16
```

---

## 4. El enrutador: 7 páginas, un solo archivo

`src/App.jsx` declara las rutas.

```jsx
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Layout, LayoutSinChrome } from "./layout/Layout";
import { Home } from "./pages/Home";
// …las demás páginas

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/productos" element={<Productos />} />
          <Route path="/blogs" element={<Blogs />} />
          <Route path="/nosotros" element={<Nosotros />} />
          <Route path="/contacto" element={<Contacto />} />

          {/* Red de seguridad, dentro del layout. Ver abajo. */}
          <Route path="*" element={<NoEncontrada />} />
        </Route>

        <Route element={<LayoutSinChrome />}>
          <Route path="/login" element={<Login />} />
          <Route path="/registro" element={<Registro />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
```

Dos layouts porque el sitio plano tiene dos tipos de página:

- `<Layout>` — header, contenido y pie. Las 5 páginas de tienda.
- `<LayoutSinChrome>` — solo el contenido. `login.html` y `registros.html`
  están sin header ni footer, y quedan así.

**El `path="*"`** es la red de seguridad: cualquier ruta desconocida muestra un
aviso en vez de pantalla en blanco. Hoy lo usan los enlaces "Leer receta" de
`/blogs`, que apuntan al detalle de blog y todavía no existe. Va **dentro** del
layout de tienda para que quien llegue por un enlace roto vea el sitio, no una
página pelada.

**Los enlaces.** En el sitio plano eran `<a href="./productos.html">`. Ahora:

```jsx
<Link to="/productos">Productos</Link>   // navega
<NavLink to="/productos">Productos</NavLink>  // navega y se marca solo
```

`<NavLink>` pone la clase `is-active` cuando la ruta coincide, así que no hay
que escribir a mano cuál link está activo en cada página.

**Cómo se comprueba:** hacer clic en cada enlace del menú. La página cambia sin
que se recargue el navegador entero.

---

## 5. El layout: lo que estaba copiado 5 veces

### `src/layout/Header.jsx`

El header del sitio plano, con dos diferencias:

```jsx
const ENLACES = [
  { to: "/", texto: "Home" },
  { to: "/productos", texto: "Productos" },
  // …
];

{ENLACES.map(({ to, texto }) => (
  <li key={to}>
    <NavLink
      to={to}
      className={({ isActive }) => (isActive ? "nav-link is-active" : "nav-link")}
      end={to === "/"}   // sin esto, "/" marca activo en todas las rutas
    >
      {texto}
    </NavLink>
  </li>
))}
```

El `end` importa: sin él, el link "Home" queda marcado en `/productos`, porque
`/` es el inicio de todas las rutas.

El bloque de sesión reemplaza el togglear de `hidden` que hacía `auth-ui.js`:

```jsx
const { correo, activo, salir } = useSesion();

<div className={`auth-sesion${activo ? " activa" : ""}`}>
  <span className="auth-correo">{correo}</span>
  <button type="button" className="auth-salir" onClick={salir}>Salir</button>
</div>

<button
  type="button"
  className="auth-trigger"
  hidden={activo}
  onClick={() => setModal("login")}
>
  Iniciar sesión
</button>
```

### `src/layout/Footer.jsx`

Igual: el footer del sitio plano, con los links como `<Link>`.

El bloque de créditos de las fotografías pasa a ser un arreglo. Estaba escrito
como 10 `<li>`; son datos, no layout.

```jsx
const CREDITOS = [
  ["Pastel de choclo", "Foofine", "CC BY-SA 4.0"],
  // …
];

{CREDITOS.map(([plato, autor, licencia]) => (
  <li key={plato}>{plato} — {autor} ({licencia})</li>
))}
```

### `src/layout/Layout.jsx`

Envuelve `<Header>`, un `<Outlet />` y `<Footer>`.

El `<Outlet />` es el hueco donde se renderiza la página de la ruta. Sin él, un
layout no sabe qué página mostrar.

Sobra un detalle que el sitio plano no tenía: **al cambiar de ruta hay que
volver arriba**.

```jsx
useEffect(() => {
  window.scrollTo(0, 0);
}, [pathname]);
```

En el sitio plano esto pasaba solo, porque cada página era una carga nueva. En
una SPA no: se llega a la siguiente con el scroll de la anterior.

**Cómo se comprueba:** en `/`, hacer scroll hasta el final, hacer clic en
"Productos". Arranca arriba, con header y pie.

---

## 6. El CSS: el mismo sistema, en otro orden

Los 6 archivos CSS del sitio plano se copian tal cual a `src/styles/`. Mismo
contenido, mismos tokens, misma paleta: el diseño no cambia una coma.

Lo que cambia es **el orden de importación**, que en Vite es explícito en
`src/main.jsx`:

```jsx
import "bootstrap/dist/css/bootstrap.min.css";  // 1. Bootstrap, CSS base
import "./styles/bootstrap-theme.css";           // 2. el tema, sobre --bs-*
import "./styles/home.css";                     // 3. los del sitio
import "./styles/auth.css";
import "./styles/blogs.css";
import "./styles/contacto.css";
import "./styles/nosotros.css";
import "./styles/productos.css";
import "./styles/port.css";                     // 4. utilidades nuevas
```

**El orden importa** porque CSS gana por orden de llegada cuando dos reglas
tienen la misma especificidad. El `.btn` del sitio plano tiene borde duro y sin
radio; el de Bootstrap es azul y redondeado. Con estos imports gana el del
sitio.

### La paleta sobre Bootstrap

`src/styles/bootstrap-theme.css` sobreescribe las variables `--bs-*` de
Bootstrap 5.3. Sin Sass, sin compilar nada:

```css
:root {
  --bs-primary: #c0392b;   /* rojo terracota */
  --bs-success: #6b8f3c;   /* verde oliva */
  --bs-body-bg: #faf7f2;   /* crema */
  --bs-body-color: #2c1810; /* tinta */
  --bs-body-font-family: "DM Sans", system-ui, sans-serif;

  /* la marca no usa bordes redondeados */
  --bs-border-radius: 0;
  --bs-border-radius-lg: 0;

  /* sombras duras, como tinta estampada */
  --bs-box-shadow: 6px 6px 0 var(--tinta);
}
```

Bootstrap 5.3 publica todas sus variables con prefijo `--bs-`. Cambiarlas es
todo lo que hace falta para que sus componentes salgan con la paleta de la
casa.

**Un detalle de accesibilidad que viene del sitio plano:** el `--bs-link-color`
es `#af3527`, no `#c0392b`. El terracota de los rellenos da 4.28:1 de contraste
sobre crema y no alcanza el nivel AA para texto; el tono más oscuro sí da
4.92:1. Para rellenos sigue mandando el terracota.

**Cómo se comprueba:** en DevTools, `getComputedStyle(document.body)`
devuelve `rgb(250, 247, 242)` de fondo y `rgb(44, 24, 16)` de texto.

---

## 7. Supabase: fuera del código, en variables de entorno

El sitio plano tenía las credenciales escritas en `supabase.js` y el cliente
sacado del `<script>` del CDN:

```js
// el sitio plano
const SUPABASE_URL = "https://nyepdzvaaupfbbxuenil.supabase.co";
const supabaseClient = window.supabase.createClient(...);
```

Con Vite eso se resuelve en dos archivos.

### `.env.example`

```
VITE_SUPABASE_URL=https://...
VITE_SUPABASE_PUBLISHABLE_KEY=sb_publishable_...
VITE_REDIRECT_URL=http://localhost:5173/login
```

Se copia a `.env` y se completa. **`.env` no se sube al repo**: el `.gitignore`
ya lo excluye. `.env.example` sí, porque es la plantilla.

### `src/lib/supabase.js`

```js
import { createClient } from "@supabase/supabase-js";

const url = import.meta.env.VITE_SUPABASE_URL;
const clave = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

if (!url || !clave) {
  throw new Error(
    "Faltan VITE_SUPABASE_URL y VITE_SUPABASE_PUBLISHABLE_KEY. " +
      "Copiá .env.example a .env y completalos.",
  );
}

export const supabase = createClient(url, clave);
```

Dos cosas para entender:

- **`VITE_` es obligatorio.** Vite solo expone al bundle las variables que
  empiezan con ese prefijo. Sin él, `import.meta.env.VITE_X` es `undefined`.
- **La clave publishable es pública por diseño.** Se llama así porque está
  pensada para ir al navegador. La seguridad la pone el RLS de la base de
  datos, no esconder la cadena en el código.

**El `VITE_REDIRECT_URL`** reemplaza una URL que estaba escrita a mano en
`registro.js`:

```js
// el sitio plano, apuntando al puerto del servidor de archivos
emailRedirectTo: "http://127.0.0.3:5500/src/pages/login.html",

// ahora, con el puerto de Vite
emailRedirectTo: import.meta.env.VITE_REDIRECT_URL,
```

Esa URL tiene que coincidir con una autorizada en Supabase →
Authentication → URL Configuration.

**Cómo se comprueba:** si falta el `.env`, la app muestra el error del `throw`
al cargar, no un `undefined is not an object` más abajo.

---

## 8. La sesión: de `<dialog>` a estado de React

`src/context/SesionContext.jsx`. Reemplaza `auth-ui.js`, que escuchaba
`onAuthStateChange` y toggleaba `hidden` sobre tres nodos del DOM.

```jsx
const SesionContext = createContext(null);

export function SesionProvider({ children }) {
  const [correo, setCorreo] = useState(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setCorreo(data.session?.user?.email ?? null);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_evento, estado) => setCorreo(estado?.user?.email ?? null),
    );

    return () => subscription.unsubscribe();
  }, []);

  return (
    <SesionContext.Provider value={{ correo, activo: Boolean(correo), … }}>
      {children}
    </SesionContext.Provider>
  );
}

export function useSesion() {
  const ctx = useContext(SesionContext);
  if (!ctx) throw new Error("useSesion necesita un <SesionProvider> arriba.");
  return ctx;
}
```

Dos cosas que hay que mirar:

- **`subscription.unsubscribe()`** en el cleanup. Sin eso, cada montaje del
  componente deja un listener acumulado, y el logout termina disparando
  tres veces.
- **El `throw` en `useSesion`.** Si alguien usa el hook sin el provider, es
  más fácil de leer que un error de destructuring.

### El bug que se arregla de paso

`login.js` guardaba datos personales en `localStorage`:

```js
// el sitio plano: RUT, nombre y dirección en localStorage
localStorage.setItem("datosUsuarioPendiente", JSON.stringify(datosUsuario));
```

El `PLAN.md` lo prohíbe textualmente para credenciales y datos personales, por
riesgo de XSS. En React el estado ya vive en memoria, así que la regla se
cumple sin código extra:

```jsx
setPendiente({ rut, nombre, apellidos, email, … });
```

`pendiente` es un `useState` del contexto. **Consecuencia:** si el usuario
recarga antes de confirmar el correo, se pierde y tiene que registrarse de
nuevo. Es el comportamiento que el proyecto pidió.

### El modal

`src/components/ModalAuth.jsx`. Un solo componente para los dos modales.

```jsx
export function ModalAuth({ abierto, onCambiar }) {
  const nodo = useRef(null);
  const instancia = useRef(null);

  useEffect(() => {
    instancia.current = new Modal(nodo.current, { backdrop: true, keyboard: true });
    return () => instancia.current?.dispose();
  }, []);

  useEffect(() => {
    const modal = instancia.current;

    if (abierto && !modal._isShown) { modal.show(); return; }
    if (!abierto && modal._isShown) { modal.hide(); return; }

    // Al cambiar de panel el foco se pierde: hay que devolverlo
    nodo.current
      ?.querySelector(".modal.show input, .modal.show select, .modal.show button")
      ?.focus();
  }, [abierto]);

  return (
    <div ref={nodo} className="modal fade" tabIndex={-1}>
      <div className="modal-dialog">
        <div className="modal-content auth-modal">
          {abierto === "login" && <PanelLogin onCambiar={onCambiar} />}
          {abierto === "registro" && <PanelRegistro onCambiar={onCambiar} />}
        </div>
      </div>
    </div>
  );
}
```

Bootstrap no tiene componente de React oficial para el modal, así que se usa su
JS imperativamente sobre un `<div>` del árbol de React. A cambio: foco atrapado,
Escape y backdrop, que es lo que hacía el `<dialog>` nativo.

**`abierto` es estado, no un atributo.** En el sitio plano eran dos `<dialog>`
en el HTML y `modal.showModal()`. Acá el estado decide qué panel se pinta.

**El `dispose()`** en el cleanup importa: si el componente se desmonta con el
modal abierto, Bootstrap deja el `<body>` con `overflow: hidden` y la página no
scrollea más.

**El foco del último bloque** es un detalle que costó encontrar. Al cambiar de
"login" a "registro", el nodo que tenía el foco se desmonta y el foco se va al
`<body>`. Bootstrap escucha el Escape sobre el modal, así que sin esto Escape
dejaba de cerrar el modal. Se devuelve el foco al primer campo del panel nuevo.

---

## 9. Los formularios: el lugar donde más cambió todo

### El componente `Campo`

`src/components/Campo.jsx`. El sitio plano repetía este bloque nueve veces en el
registro y cuatro en el login, cada uno con su `<small id="...Error">` y su
`aria-describedby`.

```jsx
export function Campo({ id, etiqueta, valor, error, onChange, onBlur, … }) {
  const errorId = `${id}Error`;

  return (
    <div className={`form-group${error ? " invalido" : ""}`}>
      <label htmlFor={id}>{etiqueta}</label>
      <input
        id={id}
        value={valor}
        aria-invalid={error ? "true" : "false"}
        aria-describedby={errorId}
        onChange={(e) => onChange(id, e.target.value)}
        onBlur={() => onBlur?.(id)}
      />
      <small id={errorId} className="error-message" aria-live="polite">
        {error}
      </small>
    </div>
  );
}
```

**La regla que más confunde:** `id` cumple dos papeles a la vez. Es el id del
DOM (para el `<label for>` y el `aria-describedby`) **y** es la clave del estado
que guarda el formulario. `onChange` recibe `(id, valor)`, así que
`<Campo id="email" />` guarda en `campos.email`.

Si el id del input y la clave del estado son distintos, el estado nunca se
actualiza y los campos se quedan vacíos sin error visible. Es el bug más
típico de este port.

`aria-live="polite"` hace que el lector de pantalla anuncie el error sin
interrumpir lo que el usuario está escribiendo.

### Las reglas de validación

`src/lib/validaciones.js`. Se copian los mensajes del sitio plano sin cambiar ni
uno, cada función devuelve `""` si el valor está bien o el mensaje si no.

```js
export function validaPassword(valor) {
  if (!valor) return "La contraseña es obligatoria.";
  if (valor.length < 4 || valor.length > 10)
    return "La contraseña debe tener entre 4 y 10 caracteres.";
  return "";
}
```

Cada hook devuelve un objeto con la misma forma, así que login y registro se
consumen igual:

```js
const { campos, setCampo, errores, tocar, mensaje, exito, enviar } = useLogin();
```

### Validar en tiempo real

El sitio plano validaba en el `submit`. La Fase 4 del plan pide tiempo real. La
diferencia está en un objeto de campos "tocados":

```js
const errores = {
  email: tocados.email ? validaLoginCorreo(campos.email) : "",
  password: tocados.password ? validaPassword(campos.password) : "",
};

function tocar(nombre) {
  setTocados((t) => ({ ...t, [nombre]: true }));
}
```

Sin `tocados`, el formulario abriría lleno de rojo antes de que el usuario
escriba una letra. El error aparece cuando el campo pierde el foco (`onBlur`),
o al enviar.

**El envío valida sobre el estado, no sobre los errores**, porque en el momento
del `submit` los errores del render todavía son los de antes:

```js
function enviar(evento) {
  evento.preventDefault();
  setTocados({ email: true, password: true });

  if (!todoValido) {
    setMensaje("Revisa los campos marcados antes de continuar.");
    return;
  }
  // …
}
```

Y en contacto, focus al primer error:

```js
useEffect(() => {
  if (!focusEnError) return;
  const primero = REGLAS.find(([campo]) => errores[campo]);
  if (primero) document.getElementById(primero[0])?.focus();
  setFocusEnError(false);
}, [focusEnError, errores]);
```

El setTimeout 0 implícito del efecto deja que React pinte los errores antes de
buscar el input.

### El `<select>` en cascada

Región y comuna. `CampoSelect` recibe las opciones ya calculadas:

```jsx
const region = REGIONES[Number(registro.campos.region)];

<CampoSelect
  id="comuna"
  valor={registro.campos.comuna}
  disabled={!region}
  opciones={(region?.comunas ?? []).map((c) => ({ valor: c, texto: c }))}
  onChange={registro.setCampo}
/>
```

Sin región elegida, el select queda deshabilitado, igual que en el sitio plano.

Y al cambiar de región se limpia la comuna, para que no se pueda mandar una
comuna que no pertenece a la región elegida:

```js
function setCampo(nombre, valor) {
  setCampos((c) => {
    const siguiente = { ...c, [nombre]: valor };
    if (nombre === "region") siguiente.comuna = "";
    return siguiente;
  });
}
```

**Cómo se comprueba:** elegir Tarapacá habilita la comuna con 8 opciones.
Elegir Pica, cambiar a Antofagasta: la comuna vuelve a vacío con 9 opciones.

---

## 10. Catálogo: de `innerHTML` a JSX

### `src/components/TarjetaProducto.jsx`

El sitio plano pintaba las tarjetas con una plantilla de string y las inyectaba
con `innerHTML`:

```js
// el sitio plano
const PLANTILLA_PRODUCTO = (p) => `
  <article class="producto revelar">
    <img src="../assets/img/${p.slug}.webp" alt="${p.nombre}" />
    …
  </article>`;

contenedor.innerHTML = lista.map(PLANTILLA_PRODUCTO).join("");
```

En React es JSX. Además de no tener que concatenar strings, React escapa los
valores: si un nombre de producto tuviera `<script>`, saldría como texto.

```jsx
export function TarjetaProducto({ producto }) {
  return (
    <article className="producto revelar">
      <figure className="producto-img">
        <img src={`/assets/img/${producto.slug}.webp`} alt={producto.nombre} />
      </figure>
      <div className="producto-body">
        <p className="producto-categoria">{producto.categoria}</p>
        <h3 className="producto-nombre">{producto.nombre}</h3>
        <p className="producto-desc">{producto.descripcion}</p>
        <p className="precio">{precioCLP(producto.precio)}</p>
      </div>
    </article>
  );
}
```

La grilla usa el catálogo como fuente de datos:

```jsx
export function GrillaProductos({ soloDestacados = false }) {
  const lista = soloDestacados ? CATALOGO.filter((p) => p.destacado) : CATALOGO;

  return (
    <div className="productos-grid">
      {lista.map((p) => (
        <TarjetaProducto key={p.slug} producto={p} />
      ))}
    </div>
  );
}
```

`key={p.slug}` es obligatorio: es lo que le dice a React qué elemento es cuál
cuando la lista cambia.

**Cómo se comprueba:** `/` muestra 4 tarjetas (los `destacado: true`),
`/productos` muestra 10.

---

## 11. El reveal al hacer scroll

`src/hooks/useRevelar.js`. El sitio plano buscaba `.revelar` en el DOM y le
clavaba un `IntersectionObserver` (`app.js`).

En React no hay DOM que consultar después del render, así que cada componente
que use la animación pasa su ref al hook:

```js
export function useRevelar() {
  const ref = useRef(null);

  useEffect(() => {
    const nodo = ref.current;
    if (!nodo) return;

    const reducido = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (!("IntersectionObserver" in window) || reducido) {
      nodo.classList.add("is-visible");
      return;
    }

    const observador = new IntersectionObserver(
      (entradas) => {
        entradas.forEach((entrada) => {
          if (entrada.isIntersecting) {
            entrada.target.classList.add("is-visible");
            observador.unobserve(entrada.target);
          }
        });
      },
      { threshold: 0.15 },
    );

    observador.observe(nodo);
    return () => observador.disconnect();
  }, []);

  return ref;
}
```

Uso:

```jsx
const panel = useRevelar();

<section ref={panel} className="productos-head revelar">…</section>
```

Hay una segunda variante, `useRevelarEnLista`, para cuando hay varios elementos
que observes juntos (la grilla de productos, los posts del blog). Observa todos
los `.revelar` del contenedor en un solo observer.

**El `disconnect()`** en el cleanup evita que el observer quede mirando nodos
desmontados.

---

## 12. `main.jsx`: el punto de entrada

```jsx
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

// el orden importa: ver paso 6
import "bootstrap/dist/css/bootstrap.min.css";
import "./styles/bootstrap-theme.css";
import "./styles/home.css";
// …

import App from "./App";
import { SesionProvider } from "./context/SesionContext";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <SesionProvider>
      <App />
    </SesionProvider>
  </StrictMode>,
);
```

`index.html` queda reducido a un `<div id="root">`. React se encarga del resto
del documento.

**El `SesionProvider` va por encima de `App`**, no dentro de una página: el
header y los modales tienen que ver la misma sesión, cambie de página el
usuario o no.

---

## 13. Verificar y compilar

```bash
npm run dev      # desarrollo, con recarga en caliente
npm run build    # compila a dist/
npm run preview  # sirve dist/, para probar el build
```

### Qué revisar en cada ruta

| Ruta | Qué tiene que verse |
| --- | --- |
| `/` | Hero, cinta de nombres, 4 tarjetas de destacados |
| `/productos` | Video, 10 tarjetas, precio formateado `$7.990` |
| `/blogs` | 3 posts con su ilustración SVG |
| `/nosotros` | 4 pilares con su SVG |
| `/contacto` | Formulario de 4 campos; enviar vacío marca errores |
| `/login` | Sin header ni pie, 2 campos |
| `/registro` | Sin header ni pie, 9 campos, región y comuna en cascada |

### Pruebas manuales del auth

1. En `/`, "Iniciar sesión" abre el modal.
2. Escribir `malo@qq.com` → al salir del campo aparece el error de dominio.
3. "Crear cuenta" cambia de modal sin recargar, y Escape lo cierra.
4. Correo válido + contraseña de 3 caracteres → error de largo.
5. En `/registro`, elegir una región habilita el select de comuna.

---

## Errores frecuentes

**Pantalla en blanco y la consola dice `supabaseClient is not defined`**
Falta el `.env`. Se copia de `.env.example` y se completa. El error real del
`throw` en `lib/supabase.js` lo dice explícitamente.

**Los campos del formulario no se llenan**
El `id` del `<Campo>` no coincide con la clave del estado. `onChange` recibe
`(id, valor)`, así que `<Campo id="login-email">` guarda en `campos["login-email"]`
mientras el formulario lee `campos.email`. Los dos tienen que decir lo mismo.

**`Module not found: Can't resolve 'bootstrap/js/dist/modal'`**
Falta la dependencia: `npm install bootstrap`.

**Las fotos dan 404**
La ruta tiene que empezar con `/`: `/assets/img/x.webp`. Sin la barra, el
navegador la busca relativo a la ruta actual.

**Las variables de entorno salen `undefined`**
Les falta el prefijo `VITE_`. Vite solo expone al bundle las que empiezan así, y
hay que reiniciar el servidor después de cambiar el `.env`.

**Bootstrap se ve azul y redondeado**
El orden de los imports en `main.jsx`. `bootstrap-theme.css` tiene que ir
después de `bootstrap.min.css`, y los CSS del sitio al final.

**El modal no cierra con Escape después de cambiar de panel**
El foco se perdió al desmontarse el panel viejo. Ver el paso 8.

---

## Qué quedó fuera

Esto no se hizo en este port, y sigue pendiente:

- **El carrito.** No se escribió nada. Es la Fase 3 del plan, y estaba sin dueño
  asignado.
- **El detalle de producto** (`/producto/:slug`). Las tarjetas no son
  enlazables.
- **El detalle de blog** (`/blogs/:slug`). Los enlaces "Leer receta" apuntan a
  esas rutas y muestran la página de aviso. El sitio plano enlazaba a un
  `detalle-blog.html` que nunca se creó.
- **Las tres páginas de administrador** y el control de acceso por rol. Son la
  Fase 5 del plan y no hay ninguna.
- **`index.html` en la raíz del sitio plano.** Nunca se creó; el sitio se
  servía entrando por `src/pages/`.

Cuando se implemente el carrito, la pista es que **el estado va en un contexto,
nunca en `localStorage`** (ver paso 8, el caso de los datos pendientes).