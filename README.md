# Sabores de Chile

E-commerce de cocina casera chilena con catálogo dinámico, carrito, checkout y
panel de administración. Proyecto académico de la asignatura **DSY1104 —
Fullstack 2**.

El sitio tiene dos áreas:

- **Tienda (cliente):** home, catálogo, blogs, nosotros, contacto, carrito,
  checkout, mi cuenta, login y registro.
- **Administración:** mantenedor de productos protegido por rol.

## Stack

| Tecnología | Uso |
|---|---|
| HTML5 + CSS3 | Estructura y estilos (11 páginas, 10 hojas de estilo) |
| JavaScript ES Modules | Lógica de la aplicación |
| React 19 | Navbar y footer montados como islas |
| Vite 8 | Servidor de desarrollo y build multi-página |
| Supabase | Base de datos Postgres, Auth y perfiles |

El catálogo vive en Supabase, no en arrays locales. El carrito y los pedidos se
guardan en `localStorage`.

## Requisitos

- Node.js 18 o superior
- Una cuenta de Supabase con las tablas descritas más abajo

## Cómo ejecutar

1. Clona el repositorio y entra a la carpeta:

   ```bash
   git clone https://github.com/Fullstack-2-E-commerce/E-Commerce.git
   cd E-Commerce
   ```

2. Instala las dependencias:

   ```bash
   npm install
   ```

3. Crea el archivo `.env` en la raíz con las credenciales de Supabase:

   ```env
   VITE_SUPABASE_URL=https://tu-proyecto.supabase.co
   VITE_SUPABASE_ANON_KEY=tu_clave_publica
   ```

   Si no existe `.env`, `src/js/supabase.js` usa credenciales de respaldo
   incluidas en el código. Configúralo para apuntar a tu propio proyecto.

4. Levanta el servidor de desarrollo:

   ```bash
   npm run dev
   ```

   Abre `http://localhost:5173` en el navegador. Los cambios en HTML, CSS y JS
   se recargan automáticamente.

### Build de producción

```bash
npm run build     # genera la carpeta dist/
npm run preview   # sirve dist/ en http://localhost:4173
```

| Comando | Qué hace |
|---|---|
| `npm run dev` | Servidor de desarrollo con recarga en caliente |
| `npm run build` | Compila el sitio multi-página en `dist/` |
| `npm run preview` | Previsualiza el build de producción |

## Estructura

```
.
├── index.html                  # Home
├── src/
│   ├── components/             # Navbar y Footer (React)
│   ├── css/                    # Estilos por página + animaciones
│   ├── js/                     # Lógica de la aplicación
│   │   ├── supabase.js         # Cliente de Supabase
│   │   ├── validaciones.js     # RUT, correo, precios, escape HTML
│   │   ├── regiones.js         # Regiones y comunas de Chile
│   │   ├── carrito.js          # Estado y render del carrito
│   │   ├── tienda.js           # Catálogo desde Supabase
│   │   ├── checkout.js         # Validación y cierre del pedido
│   │   └── admin-productos.js  # CRUD y guardia de rol
│   └── pages/                  # Vistas HTML internas
├── public/assets/              # Imágenes y video
└── vite.config.js              # Entradas del build multi-página
```

## Páginas

| Ruta | Descripción |
|---|---|
| `/index.html` | Home con hero, destacados, marquesina y manifiesto |
| `/src/pages/productos.html` | Catálogo completo |
| `/src/pages/carrito.html` | Carrito con cantidades y totales |
| `/src/pages/checkout.html` | Datos de entrega y confirmación del pedido |
| `/src/pages/cuenta.html` | Perfil del usuario y sus pedidos |
| `/src/pages/login.html` | Inicio de sesión |
| `/src/pages/registros.html` | Registro de usuario |
| `/src/pages/admin-productos.html` | Panel de administración |
| `/src/pages/blogs.html` | Blog |
| `/src/pages/nosotros.html` | Historia del proyecto |
| `/src/pages/contacto.html` | Formulario de contacto |

## Funcionalidades

- Catálogo dinámico consultado a Supabase, con precios en CLP.
- Carrito persistente en `localStorage`, con control de cantidades.
- Checkout con validación de nombre, RUT, correo, región, comuna y dirección.
- Generación de folio y guardado local del pedido.
- Registro y login con Supabase Auth.
- Perfil de usuario con región y comuna (lista local de `regiones.js`).
- Panel de administración con crear, editar y eliminar productos.
- Navbar responsive y enlace activo según la ruta.
- Animaciones al hacer scroll con `IntersectionObserver`, respetando
  `prefers-reduced-motion`.

## Roles

El acceso al panel se controla con la columna `rol` de la tabla `usuarios`:

| Rol | Acceso |
|---|---|
| `Administrador` | Panel de productos completo |
| `Vendedor` | Panel de productos completo |
| `Cliente` | Tienda y cuenta propia |

La guardia de ruta es del lado del cliente. La protección efectiva debe
implementarse con políticas RLS en Supabase.

## Modelo de datos

### `productos`

`id`, `codigo`, `nombre`, `descripcion`, `precio`, `categoria`, `imagen_url`,
`destacado`, `stock`, `stock_critico`, `created_at`.

### `usuarios`

`id` (igual a `auth.users.id`), `rol`, `nombre`, `apellidos`, `rut`,
`fecha_nacimiento`, `region`, `comuna`, `direccion`.

## Limitaciones conocidas

- Los pedidos se guardan solo en el navegador; no se persisten en el backend.
- El esquema de Supabase no está versionado en el repositorio.
- El stock se almacena pero no se descuenta en la tienda.
- No hay pruebas automatizadas.

## Licencia

ISC.
