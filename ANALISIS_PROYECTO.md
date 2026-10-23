# Análisis del Proyecto — Sabores de Chile

> **Proyecto:** E-Commerce de comida casera chilena
> **Asignatura:** DSY1104 — Fullstack 2
> **Repositorio:** `Fullstack-2-E-commerce/E-Commerce`
> **Documento:** análisis técnico elaborado a partir de la revisión directa del código fuente, la configuración y la documentación del repositorio.
> **Alcance:** describe el estado real del proyecto. No se modificó ningún archivo del sistema durante el análisis.

---

## 1. Resumen general del proyecto

"Sabores de Chile" es un e-commerce académico de comida casera chilena. El sitio ofrece una tienda para clientes y un panel de administración para la gestión de productos.

El proyecto cuenta con dos áreas principales:

- **Vistas de tienda (cliente):** Home, Productos, Blogs, Nosotros, Contacto, Carrito, Checkout, Mi cuenta, Login y Registro.
- **Vistas de administración:** mantenedor de productos con protección por rol.

El flujo principal del sistema es:

1. El catálogo de productos se obtiene desde **Supabase**.
2. El carrito se mantiene en el navegador mediante **`localStorage`**.
3. El checkout valida los datos de entrega, genera un folio y guarda el pedido localmente.
4. La autenticación, el registro y la sesión se gestionan con **Supabase Auth**.
5. El acceso al panel de administración se restringe según el rol del usuario (`Administrador` o `Vendedor`).

### Estado real del proyecto

El repositorio está más avanzado de lo que indican el `README.md` y el `PLAN.md`. La documentación describe React, Bootstrap y un catálogo en arreglos JavaScript, pero la implementación real utiliza:

- HTML5, CSS3 y JavaScript vanilla con módulos ES.
- Vite como servidor de desarrollo y empaquetador.
- Supabase como backend de datos y autenticación.
- Custom Elements para el navbar y el footer.

No hay React, Bootstrap ni un archivo `catalogo.js` con productos en arrays.

---

## 2. Tecnologías y herramientas utilizadas

| Tecnología / herramienta | Versión o evidencia | Uso en el proyecto |
|---|---|---|
| HTML5 | 11 páginas HTML | Estructura de las vistas |
| CSS3 | 10 hojas de estilo en `src/css/` | Diseño, tokens, responsive y animaciones |
| JavaScript ES Modules | Archivos `.js` con `import` / `export` | Lógica de la aplicación |
| Vite | `vite ^8.3.2` en `package.json` | Servidor de desarrollo y build multi-página |
| Supabase JS | `@supabase/supabase-js ^2.117.2` | Cliente de base de datos y autenticación |
| Supabase Auth | Llamadas a `supabase.auth.*` | Registro, login, sesión y cambio de contraseña |
| Supabase Postgres | Consultas a `productos` y `usuarios` | Persistencia del catálogo y perfiles |
| Custom Elements | `customElements.define(...)` | Componentes `<site-navbar>` y `<site-footer>` |
| IntersectionObserver | `app.js` y `animaciones.js` | Animaciones al hacer scroll |
| `localStorage` | Claves `carrito` y `pedidos` | Persistencia del carrito y de pedidos locales |
| Git / GitHub | Historial del repositorio | Control de versiones y trabajo por ramas |

### Aclaraciones importantes sobre el stack

- **React y Bootstrap no están implementados.** No aparecen como dependencias en `package.json` ni se usan en el código.
- **Sí existe un build con Vite.** El directorio `dist/` contiene una compilación generada.
- **El catálogo no vive en arrays locales.** Se consulta a la tabla `productos` de Supabase.
- El `README.md` y el `PLAN.md` están desactualizados en varios puntos; el detalle se encuentra en la sección 6.

### Dependencias declaradas

```json
{
  "devDependencies": {
    "vite": "^8.3.2"
  },
  "dependencies": {
    "@supabase/supabase-js": "^2.117.2"
  }
}
```

### Scripts disponibles

```powershell
npm run dev      # servidor de desarrollo con Vite
npm run build    # build de producción en dist/
npm run preview  # previsualización del build
```

---

## 3. Estructura de carpetas y archivos principales

### 3.1 Vista general

```
E-Commerce/
├── index.html                     Home del sitio
├── package.json                   Dependencias y scripts
├── package-lock.json              Bloqueo de dependencias
├── vite.config.js                 Configuración multi-página de Vite
├── README.md                      Documentación general (desactualizada)
├── PLAN.md                        Plan de desarrollo (desactualizado)
├── COMMIT_GUIA.md                 Convención de commits
├── Instrucciones_Fullstack2.md    Guía académica del proyecto
├── GUIA_PORT_REACT.md             Guía de migración a React
├── .gitignore
├── dist/                          Build generado por Vite
├── public/
│   └── assets/
│       ├── img/                   Imágenes .webp y .jpeg de los platos
│       └── videos/platos.webm     Video del catálogo
├── supabase/
│   └── productos.sql              Solo contiene una URL comentada; no define esquema
└── src/
    ├── pages/                     Páginas HTML internas
    ├── css/                       Hojas de estilo
    └── js/                        Módulos JavaScript
        └── components/            Navbar y footer
```

### 3.2 Páginas HTML

| Archivo | Ruta | Propósito | JavaScript principal |
|---|---|---|---|
| `index.html` | `/` | Home, hero, productos destacados, manifiesto y cifras | `tienda.js`, `app.js`, `animaciones.js`, `auth-ui.js` |
| `src/pages/productos.html` | `/src/pages/productos.html` | Catálogo completo y video | `tienda.js`, `app.js`, `animaciones.js` |
| `src/pages/blogs.html` | `/src/pages/blogs.html` | Listado de blogs | `app.js`, `animaciones.js` |
| `src/pages/nosotros.html` | `/src/pages/nosotros.html` | Historia y valores del negocio | `app.js`, `animaciones.js` |
| `src/pages/contacto.html` | `/src/pages/contacto.html` | Formulario de contacto | `contacto.js` |
| `src/pages/carrito.html` | `/src/pages/carrito.html` | Carrito completo | `carrito.js` |
| `src/pages/checkout.html` | `/src/pages/checkout.html` | Datos de entrega y confirmación | `checkout.js` |
| `src/pages/cuenta.html` | `/src/pages/cuenta.html` | Perfil y cambio de contraseña | `cuenta.js` |
| `src/pages/login.html` | `/src/pages/login.html` | Login independiente | `login.js` |
| `src/pages/registros.html` | `/src/pages/registros.html` | Registro independiente | `registro.js` |
| `src/pages/admin-productos.html` | `/src/pages/admin-productos.html` | CRUD de productos | `admin-productos.js` |

### 3.3 Hojas de estilo

| Archivo | Función |
|---|---|
| `src/css/home-styles.css` | Sistema de diseño compartido: tokens, tipografías, header, footer y estilos base |
| `src/css/auth-styles.css` | Login, registro, modales y cuenta |
| `src/css/animaciones.css` | Animaciones avanzadas y barra de progreso |
| `src/css/admin-productos-styles.css` | Panel de administración |
| `src/css/blogs-styles.css` | Vista de blogs |
| `src/css/contacto-styles.css` | Vista de contacto |
| `src/css/nosotros-styles.css` | Vista de nosotros |
| `src/css/productos-styles.css` | Catálogo de productos |
| `src/css/animaciones.css` | Efectos de entrada y scroll |

### 3.4 Módulos JavaScript

| Archivo | Responsabilidad |
|---|---|
| `src/js/supabase.js` | Crea y exporta el cliente de Supabase |
| `src/js/validaciones.js` | Validación de correo, RUT, formato de precio y escape de HTML |
| `src/js/regiones.js` | Array de las 16 regiones y sus comunas; selects en cascada |
| `src/js/tienda.js` | Consulta y renderiza el catálogo desde Supabase |
| `src/js/carrito.js` | Estado, persistencia, render y acciones del carrito |
| `src/js/checkout.js` | Validación de entrega, creación y guardado del pedido |
| `src/js/cuenta.js` | Edición de perfil y cambio de contraseña |
| `src/js/login.js` | Autenticación y redirección según rol |
| `src/js/registro.js` | Registro de usuarios con Supabase Auth |
| `src/js/contacto.js` | Validación del formulario de contacto |
| `src/js/admin-productos.js` | Listado, creación, edición y eliminación de productos |
| `src/js/auth-ui.js` | Estado de sesión en el navbar y control de modales |
| `src/js/app.js` | Reveal on scroll con IntersectionObserver |
| `src/js/animaciones.js` | Animaciones de texto, escalonados, sellos, barra de progreso y sombra del header |
| `src/js/components/navbar.js` | Custom Element `site-navbar` |
| `src/js/components/footer.js` | Custom Element `site-footer` |

### 3.5 Recursos

- Imágenes en `public/assets/img/`: cazuela de vacuno, charquicán, completo, empanada de pino, mote con huesillo, pan amasado, pastel de choclo, porotos granados, sopaipillas y terremoto.
- Video en `public/assets/videos/platos.webm`.

---

## 4. Arquitectura y funcionamiento del sistema

### 4.1 Vista general

```
Navegador
├── HTML de cada página
├── CSS compartido + CSS específico
├── Módulos JS (ES Modules)
│   ├── Custom Elements: site-navbar / site-footer
│   ├── Supabase Auth: sesión, login, registro
│   ├── Supabase Postgres: productos, usuarios
│   └── localStorage: carrito, pedidos
└── Vite: desarrollo y build
```

No existe un framework de frontend ni un router formal. La navegación es mediante enlaces HTML entre páginas y la lógica se organiza en módulos que se cargan según la página.

### 4.2 Flujo de arranque de una página

1. El navegador carga el HTML.
2. Se cargan los módulos indicados con `<script type="module">`.
3. `navbar.js` y `footer.js` definen los custom elements `<site-navbar>` y `<site-footer>`.
4. Los custom elements generan su HTML en `connectedCallback()`.
5. `auth-ui.js` consulta la sesión de Supabase y pinta el estado del usuario.
6. `carrito.js` recupera el carrito desde `localStorage` y pinta los contadores.
7. Según la página, se ejecuta la lógica específica: catálogo, checkout, cuenta, admin, etc.

### 4.3 Flujo del catálogo

El catálogo se obtiene de Supabase en `src/js/tienda.js:45`:

```js
const { data: productos, error } = await supabase
  .from("productos")
  .select(
    "id, nombre, descripcion, precio, categoria, imagen_url, destacado",
  )
  .order("id");
```

Luego:

1. Cada producto se transforma en HTML con `PLANTILLA_PRODUCTO`.
2. Se inserta dentro de los contenedores `[data-catalogo]`.
3. Si el contenedor tiene `data-catalogo="destacados"`, se filtran los productos con `destacado = true`.
4. Se emite el evento `catalogo-listo` para que `app.js` reactive las animaciones.
5. Cada tarjeta incluye un botón `.btn-agregar-carrito` con los datos del producto.

### 4.4 Flujo del carrito

El estado vive en `src/js/carrito.js`:

```js
const CLAVE = "carrito";

export const carrito = (() => {
  try {
    const guardado = localStorage.getItem(CLAVE);
    const datos = guardado ? JSON.parse(guardado) : [];
    return Array.isArray(datos) ? datos : [];
  } catch (error) {
    console.error("No se pudo recuperar el carrito:", error);
    return [];
  }
})();
```

Funciones principales:

- `guardar()`: persiste el carrito en `localStorage`.
- `agregar({ id, nombre, precio })`: suma una unidad o crea la línea.
- `vaciar()`: elimina todo el contenido.
- `unidades()`: cuenta el total de unidades.
- `monto()`: calcula el total monetario.
- `linea(item)`: genera el HTML de una línea.
- `vacio()`: genera el estado vacío.
- `pintar()`: actualiza todas las superficies del carrito.
- `buscar(id)`: busca una línea por id.

El render se comparte mediante atributos:

- `[data-carrito-lineas]`
- `[data-carrito-total]`
- `[data-carrito-pie]`
- `[data-carrito-count]`

El panel del navbar y la página del carrito usan el mismo render sin cableado independiente.

Las acciones se manejan con un único listener delegado en `document` (`src/js/carrito.js:246`), que detecta:

- `.cart-sumar`
- `.cart-restar`
- `.cart-eliminar`
- `.cart-vaciar`

### 4.5 Flujo de autenticación y roles

#### Registro

1. `registro.js` valida los campos del formulario.
2. Llama a `supabase.auth.signUp()` con los datos personales en `user_metadata`.
3. Según el comentario del código, un **trigger de Supabase** copia los datos a la tabla `public.usuarios`.
4. Si Supabase devuelve sesión, se cierra el modal; si no, se solicita confirmar el correo.

```js
const { data, error } = await supabase.auth.signUp({
  email,
  password,
  options: {
    emailRedirectTo: `${window.location.origin}/src/pages/login.html`,
    data: {
      rut,
      nombre,
      apellidos,
      fecha_nacimiento: fechaNacimiento || null,
      region: nombreRegion,
      comuna,
      direccion,
    },
  },
});
```

#### Login

1. `login.js` valida correo y contraseña.
2. Autentica con `supabase.auth.signInWithPassword()`.
3. Consulta el rol en `public.usuarios`.
4. Redirige según el rol y la página de origen:
   - `Administrador` o `Vendedor`: `/src/pages/admin-productos.html`.
   - Cliente que entra desde `login.html`: `/index.html`.
   - Cliente que entra desde un modal en otra página: permanece en la página actual.

#### Sesión

- `auth-ui.js` usa `supabase.auth.getSession()` y `onAuthStateChange`.
- El navbar muestra el nombre o la inicial del usuario y un botón para salir.
- El footer cambia sus enlaces de "Cuenta" según la sesión y el rol.
- `cuenta.js` permite actualizar datos y contraseña.

### 4.6 Flujo del checkout

1. Al entrar, `checkout.js` detecta si hay sesión.
2. Sin sesión y con carrito con productos, muestra dos opciones: iniciar sesión o comprar como invitado.
3. Con sesión, prellena el formulario con `user_metadata`.
4. Valida nombre, RUT, correo, región, comuna y dirección.
5. Genera un folio con el formato `SDC-...`.
6. Guarda el pedido en `localStorage` bajo la clave `pedidos`.
7. Vacía el carrito, actualiza la interfaz y muestra un modal de confirmación.

El pedido contiene:

```js
{
  folio: "SDC-...",
  fecha: new Date().toISOString(),
  lineas: [{ id, nombre, precio, cantidad }],
  total: monto()
}
```

**Importante:** los pedidos no se envían a Supabase; quedan guardados únicamente en el navegador.

### 4.7 Flujo de "Mi cuenta"

1. `cuenta.js` consulta la sesión actual.
2. Sin sesión, muestra un aviso y oculta los formularios.
3. Con sesión, prellena nombre, apellidos, dirección, RUT, correo, región y comuna.
4. Al guardar datos, actualiza dos lugares:
   - `supabase.auth.updateUser({ data: valores })` para `user_metadata`.
   - `supabase.from("usuarios").update(valores)` para la tabla pública.
5. El cambio de contraseña usa `supabase.auth.updateUser({ password })`.

### 4.8 Flujo de administración

1. `admin-productos.js` espera `DOMContentLoaded`.
2. Ejecuta `verificarAccesoAdmin()`.
3. Si no hay sesión, redirige a `login.html`.
4. Si el rol no es `Administrador` o `Vendedor`, redirige a `/`.
5. Si tiene acceso, carga los productos y configura los eventos.
6. Permite crear, editar y eliminar productos.

### 4.9 Modelo de datos inferido

A partir de las consultas del código se pueden inferir las siguientes tablas y columnas.

#### Tabla `productos`

| Columna | Uso |
|---|---|
| `id` | Identificador del producto |
| `codigo` | Código interno mostrado en administración |
| `nombre` | Nombre del plato |
| `descripcion` | Descripción |
| `precio` | Precio en pesos |
| `categoria` | Categoría del producto |
| `imagen_url` | URL de la imagen |
| `destacado` | Indica si aparece en el home |
| `stock` | Stock disponible |
| `stock_critico` | Umbral de alerta de stock |
| `created_at` | Fecha de creación |

#### Tabla `usuarios`

| Columna | Uso |
|---|---|
| `id` | Coincide con el identificador de `auth.users` |
| `rol` | `Administrador`, `Vendedor` o `Cliente` |
| `nombre` | Nombre del usuario |
| `apellidos` | Apellidos |
| `rut` | RUT |
| `fecha_nacimiento` | Fecha de nacimiento |
| `region` | Región |
| `comuna` | Comuna |
| `direccion` | Dirección |

#### Observaciones sobre la base de datos

- El esquema no está versionado en el repositorio. `supabase/productos.sql` solo contiene una URL comentada.
- No se puede verificar desde el código si existen políticas RLS (Row Level Security) configuradas en Supabase.
- El trigger que crea el registro en `public.usuarios` se menciona en comentarios, pero no está versionado.

### 4.10 Persistencia y estado

| Dato | Ubicación | Observaciones |
|---|---|---|
| Sesión y tokens | Gestionados por Supabase JS | El SDK administra el almacenamiento |
| Carrito | `localStorage["carrito"]` | Persistente entre recargas |
| Pedidos | `localStorage["pedidos"]` | Solo en el navegador |
| Productos | Supabase `productos` | Fuente central |
| Perfiles y roles | Supabase `usuarios` + `user_metadata` | Datos duplicados que se actualizan manualmente |
| Regiones y comunas | Array local `regiones.js` | Sin consulta al backend |

### 4.11 Eventos y comunicación entre módulos

- `catalogo-listo`: lo emite `tienda.js` y lo escucha `app.js` para reactivar las animaciones de las tarjetas recién renderizadas.
- Delegación de eventos en `document`:
  - `carrito.js`: acciones del carrito.
  - `tienda.js`: botones "Agregar al carrito".
  - `auth-ui.js`: apertura y cierre de modales.
  - `admin-productos.js`: botones de edición y eliminación en la tabla.

### 4.12 Seguridad del modelo actual

- El control de acceso al panel es **del lado del cliente**: se consulta el rol y se redirige. La protección real debe estar en las políticas RLS de Supabase.
- La clave publishable de Supabase está escrita como respaldo en `src/js/supabase.js` además de las variables de entorno.
- El carrito y los pedidos usan `localStorage`; no contienen credenciales, pero sí datos del pedido.
- `admin-productos.js` inserta datos de la base con `innerHTML` sin escape, a diferencia de `tienda.js`, que usa `escaparHTML`.
- El checkout acepta compras como invitado y no persiste el pedido en el servidor.

---

## 5. Descripción de las funcionalidades existentes

### 5.1 Tienda y navegación

- Home con hero, marquesina de platos, productos destacados, banda de fotos, manifiesto y cifras.
- Catálogo dinámico desde Supabase.
- Página de productos con video del catálogo.
- Páginas de Blogs y Nosotros.
- Navbar responsive con menú móvil y enlace activo según la ruta.
- Footer con enlaces, datos de contacto, créditos de fotografías y enlaces de cuenta.

### 5.2 Catálogo de productos

- Consulta a Supabase.
- Render con tarjetas que incluyen imagen, categoría, nombre, descripción y precio.
- Filtro de destacados para el home.
- Botón "Agregar al carrito" con confirmación temporal ("Agregado").
- Escape de HTML en los datos mostrados.
- Formato de precio en pesos chilenos con `precioCLP()`.

### 5.3 Carrito de compras

- Agregar productos.
- Sumar y restar unidades.
- Eliminar líneas.
- Vaciar el carrito.
- Cálculo de unidades y total.
- Persistencia en `localStorage`.
- Render compartido entre el panel lateral del navbar y la página del carrito.
- Estado vacío ilustrado.
- Accesibilidad: foco gestionado tras cada repintado y etiquetas `aria-label`.

### 5.4 Checkout

- Compra con sesión o como invitado.
- Prellenado de datos desde la cuenta.
- Validación de nombre, RUT, correo, región, comuna y dirección.
- Selects de región y comuna en cascada.
- Generación de folio.
- Guardado local del pedido.
- Confirmación en modal.
- Limpieza del carrito y del formulario.
- Aviso cuando el carrito está vacío.

### 5.5 Autenticación

- Registro con Supabase Auth.
- Confirmación de correo configurable desde Supabase.
- Login con correo y contraseña.
- Manejo del error "correo ya registrado" en español.
- Sesión persistente administrada por el SDK.
- Cierre de sesión desde el navbar y el footer.
- Redirección según rol.
- Actualización de perfil y contraseña.
- Modales de login y registro disponibles desde el navbar.
- Páginas independientes de login y registro.

### 5.6 Validaciones

`src/js/validaciones.js` centraliza:

- `DOMINIOS_CORREO`: `@duoc.cl`, `@duocuc.cl`, `@profesor.duoc.cl`, `@gmail.com`.
- `errorCorreo(v)`: obligatorio, máximo 100 caracteres y dominio permitido.
- `errorRut(v)`: validación completa con módulo 11.
- `precioCLP(v)`: formato `$7.990`.
- `escaparHTML(v)`: escape de `&`, `<`, `>`, `"` y `'`.

Validaciones adicionales por formulario:

- Contacto: nombre, correo, asunto y mensaje con largos mínimos y máximos.
- Registro: RUT con formato, nombre, apellidos, correo, contraseña, región, comuna y dirección.
- Login: correo y contraseña.
- Checkout: nombre, RUT, correo, región, comuna y dirección.
- Cuenta: nombre, apellidos, región, comuna y dirección.
- Administración: código, nombre, categoría, precio, stock y stock crítico.

### 5.7 Regiones y comunas

- Array con las 16 regiones de Chile y sus comunas.
- `poblarRegiones(regionSelect, comunaSelect)` llena ambos selects y actualiza las comunas al cambiar la región.
- Se usa en registro, checkout y cuenta.

### 5.8 Administración de productos

- Guardia de ruta por sesión y rol.
- Tabla de inventario.
- Crear producto.
- Editar producto.
- Eliminar producto con confirmación.
- Feedback visual de éxito o error.
- Badge de stock crítico.
- Formulario con código, nombre, categoría, precio, stock, stock crítico, imagen y descripción.

### 5.9 Experiencia visual y animaciones

- Sistema de diseño tipo afiche serigrafiado a dos tintas.
- Tokens CSS: terracota, ocre, oliva, limón, crema, papel y carbón.
- Tipografías Fraunces y DM Sans.
- Animaciones de entrada al hacer scroll.
- Sellos, escalonados, columnas y manifiesto animado.
- Barra de progreso de lectura.
- Sombra del header al hacer scroll.
- Respeto por `prefers-reduced-motion`.
- Modales nativos `<dialog>`.

### 5.10 Build y despliegue

- Vite configurado como build multi-página en `vite.config.js`.
- Entradas: `index.html` y las 10 páginas de `src/pages/`.
- Salida en `dist/`.
- El directorio `dist/` ya contiene una compilación generada.

---

## 6. Problemas y posibles errores detectados

### 6.1 Documentación desactualizada

| Documento indica | Estado real |
|---|---|
| El proyecto usa React y Bootstrap | No están instalados ni usados |
| No hay `package.json` ni build | Sí existen `package.json`, Vite y `dist/` |
| El catálogo está en `catalogo.js` con arrays | El catálogo viene de Supabase; `catalogo.js` no existe |
| El carrito funciona solo en memoria, sin Web Storage | Usa `localStorage` con las claves `carrito` y `pedidos` |
| Los roles están pendientes | Ya están implementados en login, footer y admin |
| El panel de administración está pendiente | `admin-productos.html` ya existe y funciona |
| Las validaciones de registro no son en tiempo real | Cuenta y checkout validan mientras se escribe; registro valida al enviar |

**Impacto:** un evaluador podría recibir información contradictoria entre la documentación y el código.

### 6.2 Posible fallo de autenticación en `carrito.html`

`carrito.html` carga `auth-ui.js`, que abre los modales de login y registro del navbar, pero **no carga `login.js` ni `registro.js`**. Los formularios de esos modales podrían mostrarse sin manejador de envío en esa página.

**Evidencia:** comparación de los `<script type="module">` de cada página. `carrito.html` incluye `navbar.js`, `footer.js`, `carrito.js`, `app.js`, `animaciones.js` y `auth-ui.js`, pero no `login.js` ni `registro.js`.

### 6.3 Inconsistencia en la validación del RUT

- `registro.js` valida el RUT con una expresión regular simple:
  ```js
  /^\d{7,8}-[\dkK]$/
  ```
- `checkout.js` usa `errorRut()` de `validaciones.js`, que aplica el algoritmo completo de módulo 11.

**Consecuencia:** el registro podría aceptar un RUT con formato correcto pero dígito verificador inválido, mientras el checkout lo rechazaría.

### 6.4 Escape de HTML en administración

`admin-productos.js` construye filas de tabla con `innerHTML` e interpola directamente `codigo`, `nombre` y `categoria`:

```js
tr.innerHTML = `
  <td><strong>${prod.codigo}</strong></td>
  <td>${prod.nombre}</td>
  <td>${prod.categoria}</td>
  ...
`;
```

Si un producto tuviera contenido malicioso en la base, podría inyectarse HTML. `tienda.js` sí usa `escaparHTML`.

### 6.5 Credenciales de Supabase en el código

`src/js/supabase.js` incluye valores de respaldo escritos directamente:

```js
const SUPABASE_URL =
  import.meta.env.VITE_SUPABASE_URL ||
  "https://<proyecto>.supabase.co";

const SUPABASE_ANON_KEY =
  import.meta.env.VITE_SUPABASE_ANON_KEY ||
  import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY ||
  "sb_publishable_...";
```

La clave publishable está diseñada para usarse en el cliente, pero lo recomendable es no dejar valores embebidos en el repositorio y usar únicamente variables de entorno.

### 6.6 Pedidos no persistidos en el backend

El checkout guarda el pedido solo en `localStorage`. Esto implica:

- El pedido se pierde si se limpia el navegador.
- No hay historial real de pedidos por usuario.
- No hay panel de pedidos para administración.
- No se puede consultar el pedido desde otro dispositivo.

### 6.7 Esquema y RLS no versionados

- `supabase/productos.sql` no contiene la definición de tablas.
- No hay migraciones ni políticas RLS en el repositorio.
- El trigger de creación de usuarios solo se menciona en comentarios.

**Consecuencia:** no se puede reconstruir la base de datos desde el repositorio ni auditar la seguridad de acceso a datos.

### 6.8 Carga redundante de módulos

Varias páginas cargan simultáneamente `supabase.js`, `registro.js`, `login.js`, `auth-ui.js` y `animaciones.js`. En algunos casos es necesario porque los modales viven en el navbar, pero conviene revisar si todos los módulos son indispensables en cada página para reducir trabajo de red y ejecución.

### 6.9 Stock no utilizado en la tienda

La administración gestiona `stock` y `stock_critico`, pero `tienda.js` no consulta esas columnas ni bloquea la compra de productos sin stock. El catálogo público no refleja disponibilidad.

### 6.10 Datos duplicados del perfil

Los datos del usuario se guardan en dos lugares:

- `user_metadata` de Supabase Auth.
- Tabla `public.usuarios`.

`cuenta.js` actualiza ambos manualmente. No hay un trigger de `UPDATE` que mantenga la sincronización, por lo que una falla parcial podría dejar los datos inconsistentes.

### 6.11 Dependencia de la configuración del proyecto Supabase

Si el proyecto de Supabase no está disponible, cambian sus credenciales o se modifican las políticas, el catálogo, el login y el panel dejan de funcionar. No hay una capa de respaldo ni datos locales de demostración.

### 6.12 Ausencia de pruebas automatizadas

No se encontraron pruebas unitarias, de integración ni end-to-end en el repositorio. Tampoco hay configuración de linting ni de formateo.

---

## 7. Mejoras recomendadas

Las mejoras se presentan por prioridad técnica.

### 7.1 Prioridad alta

1. **Actualizar la documentación.**
   - Corregir `README.md` y `PLAN.md` para reflejar Vite, Supabase y JavaScript vanilla.
   - Eliminar referencias a React, Bootstrap y `catalogo.js` mientras no existan.
   - Documentar que el carrito y los pedidos usan `localStorage`.

2. **Corregir la autenticación en todas las páginas.**
   - Cargar `login.js` y `registro.js` en `carrito.html`, o centralizar los manejadores de autenticación en un único módulo común.

3. **Unificar la validación del RUT.**
   - Usar `errorRut()` de `validaciones.js` también en `registro.js`.

4. **Escapar datos en administración.**
   - Usar `escaparHTML()` en las filas de la tabla de productos o construir el DOM con `textContent`.

5. **Versionar el esquema de Supabase.**
   - Agregar migraciones SQL para `productos`, `usuarios`, triggers y políticas RLS.
   - Documentar el trigger de creación de perfiles.

### 7.2 Prioridad media

6. **Persistir pedidos en Supabase.**
   - Crear una tabla `pedidos` y `pedido_lineas`.
   - Asociar el pedido al usuario cuando exista sesión.
   - Permitir consulta de pedidos en "Mi cuenta".

7. **Aplicar RLS y validación del lado del servidor.**
   - Restringir escrituras de productos a roles `Administrador` y `Vendedor`.
   - Permitir que cada usuario lea y actualice solo su perfil.
   - Evitar depender únicamente del control de acceso del frontend.

8. **Usar solo variables de entorno.**
   - Quitar las credenciales de respaldo de `supabase.js`.
   - Documentar un `.env.example` con las variables necesarias.
   - Rotar la clave si se considera expuesta.

9. **Incorporar stock en la tienda.**
   - Mostrar disponibilidad o estado "agotado".
   - Bloquear el alta al carrito cuando no haya stock.
   - Validar stock al confirmar el pedido.

10. **Sincronizar el perfil.**
    - Crear un trigger de `UPDATE` en Supabase o centralizar la actualización en una función segura.

### 7.3 Prioridad baja

11. **Mejorar la organización de módulos.**
    - Separar la lógica de autenticación en un módulo compartido.
    - Evitar cargas redundantes por página.
    - Considerar un manifiesto de dependencias por vista.

12. **Agregar pruebas y calidad de código.**
    - Configurar ESLint y Prettier.
    - Agregar pruebas unitarias para validaciones, carrito y checkout.
    - Agregar pruebas end-to-end para los flujos principales.

13. **Optimizar el rendimiento.**
    - Revisar el tamaño del bundle de Supabase.
    - Mantener `loading="lazy"` en imágenes.
    - Evaluar la carga diferida de módulos no críticos.

14. **Mejorar accesibilidad.**
    - Revisar el contraste de todos los textos.
    - Añadir pruebas con lector de pantalla.
    - Verificar la navegación completa por teclado.

15. **Agregar funcionalidades de tienda.**
    - Detalle de producto.
    - Búsqueda y filtros por categoría.
    - Historial de pedidos.
    - Mensajes de carga y error más visibles.

### 7.4 Migración futura a React

La migración a React y Bootstrap es una fase opcional y posterior. El código actual funciona sin framework, por lo que la migración debe planificarse como una reescritura gradual y no como un requisito para la entrega actual.

---

## 8. Plan de implementación por etapas

El siguiente plan es una propuesta de trabajo. No representa tareas ya realizadas.

### Etapa 0 — Línea base y documentación

**Objetivo:** dejar el estado real del proyecto documentado.

Tareas:

- Corregir `README.md` y `PLAN.md`.
- Documentar el stack real, las rutas y los flujos.
- Registrar el esquema de Supabase y las variables de entorno necesarias.
- Definir criterios de aceptación para la entrega.

Entregables:

- Documentación coherente con el código.
- Inventario de páginas, módulos, tablas y dependencias.

Verificación:

- Comparar cada afirmación del README con el código.

### Etapa 1 — Estabilización y corrección de errores

**Objetivo:** eliminar fallos funcionales conocidos.

Tareas:

- Cargar `login.js` y `registro.js` en `carrito.html` o centralizar la autenticación.
- Unificar la validación del RUT.
- Escapar los datos en la tabla de administración.
- Revisar los módulos cargados por página.

Entregables:

- Flujo de login y registro operativo en todas las páginas con navbar.
- Validación de RUT consistente.

Verificación:

- Probar login y registro desde Home, Productos, Carrito y Checkout.

### Etapa 2 — Seguridad y datos

**Objetivo:** proteger la información y garantizar integridad.

Tareas:

- Versionar el esquema de Supabase.
- Documentar y verificar las políticas RLS.
- Restringir escrituras por rol.
- Quitar credenciales del código y usar `.env`.
- Validar los datos también en el backend.

Entregables:

- Migraciones SQL en el repositorio.
- Variables de entorno documentadas.
- Políticas RLS aplicadas.

Verificación:

- Intentar escribir productos con un usuario cliente y confirmar que se rechaza.
- Intentar leer datos de otro usuario y confirmar que no es posible.

### Etapa 3 — Persistencia de pedidos

**Objetivo:** dejar de depender de `localStorage` para los pedidos.

Tareas:

- Crear las tablas `pedidos` y `pedido_lineas`.
- Guardar el pedido en Supabase al confirmar.
- Asociarlo al usuario o registrar el modo invitado.
- Mostrar el historial en "Mi cuenta".
- Mantener un respaldo local solo como borrador.

Entregables:

- Pedido visible desde la base de datos.
- Historial de pedidos por usuario.

Verificación:

- Confirmar un pedido con sesión y verificar su registro en Supabase.
- Confirmar un pedido como invitado y verificar el tratamiento definido.

### Etapa 4 — Pruebas y calidad

**Objetivo:** reducir regresiones y facilitar el mantenimiento.

Tareas:

- Configurar ESLint y Prettier.
- Crear pruebas unitarias para `validaciones.js`, `carrito.js` y `checkout.js`.
- Crear pruebas end-to-end para compra, login y administración.
- Documentar cómo ejecutar las pruebas.

Entregables:

- Scripts de lint y test.
- Casos de prueba automatizados.

Verificación:

- Ejecutar la suite completa y revisar que no haya fallos.

### Etapa 5 — Mejoras de experiencia y funcionalidad

**Objetivo:** completar la experiencia de tienda.

Tareas:

- Incorporar stock visible y bloqueo de compra sin disponibilidad.
- Agregar detalle de producto.
- Agregar búsqueda y filtros.
- Mejorar mensajes de carga y error.
- Revisar accesibilidad y responsive.

Entregables:

- Catálogo con disponibilidad.
- Vista de detalle de producto.
- Filtros de catálogo.

Verificación:

- Probar el flujo completo desde el catálogo hasta la confirmación.

### Etapa 6 — Build y preparación de la presentación

**Objetivo:** asegurar una entrega reproducible.

Tareas:

- Ejecutar `npm run build` y revisar advertencias.
- Probar `npm run preview`.
- Verificar las rutas del build en `dist/`.
- Ensayar el flujo de demostración.
- Preparar respuestas sobre arquitectura, roles y persistencia.

Entregables:

- Build funcional.
- Guion de presentación.
- Lista de limitaciones conocidas.

Verificación:

- Recorrer la aplicación desde el build de producción, no solo desde el servidor de desarrollo.

### Etapa 7 — Migración opcional a React

**Objetivo:** modernizar el frontend si el alcance académico lo permite.

Tareas:

- Configurar React con Vite.
- Portar páginas y componentes.
- Migrar el estado del carrito a un contexto.
- Migrar auth y catálogo a hooks.
- Alinear Bootstrap con los tokens de diseño.

Entregables:

- Aplicación React funcional.
- Documentación de la migración.

Verificación:

- Comparar los flujos del sitio actual con la versión React.

---

## 9. Pruebas recomendadas

### 9.1 Pruebas manuales de navegación

| Caso | Resultado esperado |
|---|---|
| Abrir `/` | Home carga con navbar, footer y productos destacados |
| Navegar a Productos | Catálogo completo visible |
| Navegar a Blogs, Nosotros y Contacto | Páginas cargan sin errores de consola |
| Abrir el menú móvil | El navbar se despliega y el botón cambia de estado |
| Revisar el enlace activo | La ruta actual aparece marcada en el navbar |

### 9.2 Pruebas del catálogo

| Caso | Resultado esperado |
|---|---|
| Cargar el catálogo con Supabase disponible | Se muestran los productos |
| Cargar con Supabase no disponible | Se muestra el mensaje "No se pudo cargar la carta" |
| Revisar el home | Solo aparecen productos con `destacado = true` |
| Revisar precios | Se muestran en formato `$7.990` |
| Revisar imágenes | Se cargan con texto alternativo |

### 9.3 Pruebas del carrito

| Caso | Resultado esperado |
|---|---|
| Agregar un producto | Se crea una línea con cantidad 1 |
| Agregar el mismo producto dos veces | La cantidad aumenta a 2 |
| Sumar unidades | El subtotal y el total se actualizan |
| Restar con cantidad 1 | El botón de restar está deshabilitado |
| Eliminar una línea | La línea desaparece y el total se recalcula |
| Vaciar el carrito | Se muestra el estado vacío |
| Recargar la página | El carrito se conserva |
| Revisar el contador del navbar | Refleja el total de unidades |

### 9.4 Pruebas de checkout

| Caso | Resultado esperado |
|---|---|
| Checkout con carrito vacío | Se muestra el aviso de carrito vacío |
| Checkout sin sesión | Se ofrecen las opciones de login o invitado |
| Checkout con sesión | El formulario se prellena con los datos de la cuenta |
| Confirmar con campos inválidos | Se muestran errores y no se genera el pedido |
| Confirmar con datos válidos | Se genera el folio y se muestra el modal |
| Confirmar el pedido | El carrito queda vacío |
| Revisar `localStorage["pedidos"]` | El pedido queda guardado |
| Comprar como invitado | El flujo permite confirmar sin sesión |

### 9.5 Pruebas de validación

| Caso | Resultado esperado |
|---|---|
| Correo sin dominio permitido | Se rechaza con mensaje |
| Correo con `@duoc.cl` | Se acepta |
| Correo con `@duocuc.cl` | Se acepta |
| Correo con `@profesor.duoc.cl` | Se acepta |
| Correo con `@gmail.com` | Se acepta |
| Correo de más de 100 caracteres | Se rechaza |
| RUT con dígito verificador incorrecto | Se rechaza en checkout y cuenta |
| RUT con dígito verificador correcto | Se acepta |
| Contraseña de menos de 6 caracteres | Se rechaza |
| Contraseña y repetición distintas | Se rechaza en cuenta |
| Nombre vacío | Se rechaza |
| Dirección vacía | Se rechaza |
| Región o comuna sin seleccionar | Se rechaza |

### 9.6 Pruebas de autenticación

| Caso | Resultado esperado |
|---|---|
| Registro con correo nuevo | Se crea la cuenta |
| Registro con correo existente | Se muestra "Ese correo ya tiene una cuenta" |
| Login con credenciales correctas | Se inicia sesión |
| Login con contraseña incorrecta | Se muestra "Correo o contraseña incorrectos" |
| Login de administrador | Redirige al panel de productos |
| Login de vendedor | Redirige al panel de productos |
| Login de cliente desde modal | Permanece en la página actual |
| Login de cliente desde `login.html` | Redirige al home |
| Cerrar sesión | El navbar vuelve al estado invitado |
| Recargar con sesión | La sesión se mantiene |
| Cambiar contraseña | Supabase confirma el cambio |
| Actualizar perfil | Se actualizan `user_metadata` y `usuarios` |

### 9.7 Pruebas de roles y administración

| Caso | Resultado esperado |
|---|---|
| Abrir el panel sin sesión | Redirige a `login.html` |
| Abrir el panel como cliente | Redirige a `/` |
| Abrir el panel como administrador | Se muestra el mantenedor |
| Crear un producto | Aparece en la tabla y en la tienda |
| Editar un producto | Los cambios se reflejan |
| Eliminar un producto | Se pide confirmación y se elimina |
| Producto con stock bajo | Se muestra el badge de stock crítico |
| Cerrar sesión desde el panel | Redirige al home |

### 9.8 Pruebas de cuenta

| Caso | Resultado esperado |
|---|---|
| Abrir cuenta sin sesión | Se muestra el aviso y se ocultan formularios |
| Abrir cuenta con sesión | Se muestran los datos del usuario |
| Cambiar región | Se actualizan las comunas disponibles |
| Guardar datos válidos | Se muestra "Datos guardados" |
| Guardar con campos vacíos | Se muestran errores |
| Cambiar contraseña con menos de 6 caracteres | Se rechaza |
| Cambiar contraseña correctamente | Se muestra "Contraseña cambiada" |

### 9.9 Pruebas de formulario de contacto

| Caso | Resultado esperado |
|---|---|
| Enviar vacío | Se muestran errores en todos los campos |
| Mensaje de menos de 10 caracteres | Se rechaza |
| Mensaje de más de 1000 caracteres | Se rechaza |
| Datos válidos | Se muestra el mensaje de éxito y se limpia el formulario |
| Correo inválido | Se rechaza |

### 9.10 Pruebas de responsive y accesibilidad

- Verificar el sitio en anchos de 320 px, 768 px, 1024 px y 1440 px.
- Navegar todo el sitio solo con teclado.
- Verificar el foco visible en botones, enlaces y campos.
- Revisar que los modales se puedan cerrar con teclado.
- Verificar los textos alternativos de las imágenes.
- Activar `prefers-reduced-motion` y confirmar que las animaciones se reducen.
- Revisar el contraste de textos sobre fondo crema y papel.

### 9.11 Pruebas de build y despliegue

```powershell
npm install
npm run build
npm run preview
```

Verificar:

- Que el build termine sin errores.
- Que todas las rutas de `dist/` respondan.
- Que las imágenes y el video se sirvan correctamente.
- Que las variables de entorno estén disponibles en el entorno de despliegue.
- Que el login, el catálogo y el panel funcionen desde el build de producción.

### 9.12 Pruebas automatizadas recomendadas

No existen pruebas automatizadas en el repositorio. Como mejora, se propone:

- **Unitarias:** `validaciones.js` (correo, RUT, precio, escape), `carrito.js` (agregar, sumar, restar, total) y `regiones.js` (cascada de comunas).
- **Integración:** flujo de checkout con carrito y sesión simulada.
- **End-to-end:** compra completa, registro, login, cambio de contraseña y CRUD de productos.

Herramientas sugeridas: Vitest para unitarias y Playwright para end-to-end. Su incorporación requiere agregar dependencias y scripts, por lo que debe planificarse como parte de la Etapa 4.

### 9.13 Datos de prueba recomendados

- Usuario cliente de prueba.
- Usuario administrador de prueba.
- Usuario vendedor de prueba.
- Producto con stock alto, stock crítico y stock cero.
- Producto sin imagen.
- Correos de cada dominio permitido y uno no permitido.
- RUT válidos e inválidos.
- Carrito vacío, con un producto y con varios productos.

Los datos de prueba deben eliminarse o aislarse después de las pruebas para no contaminar la base real.

---

## Conclusión

El proyecto es una aplicación funcional de e-commerce construida con HTML, CSS y JavaScript vanilla, usando Vite y Supabase. Sus flujos principales —catálogo, carrito, autenticación, roles, checkout y administración— están implementados.

Los principales riesgos para la presentación son las contradicciones entre la documentación y el código, la falta de versionado del esquema de Supabase, la dependencia de `localStorage` para los pedidos y algunos detalles de seguridad y validación. Corregir la documentación y estabilizar los flujos críticos permitirá presentar el proyecto con una descripción técnica precisa y defendible.

**Archivo generado:** `C:\Users\ernes\Desktop\E-Commers\E-Commerce\ANALISIS_PROYECTO.md`
