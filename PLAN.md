# Guía de Proyecto de Frontend — E-Commerce de Comida Casera

> **Asignatura:** DSY1104 (Fullstack 2)
> **Proyecto:** E-commerce dedicado a restaurantes de comida casera chilena.
> **Tecnologías:** HTML, CSS, JavaScript y React, más Bootstrap.
> **Estado del stack (2026-09-29):** el sitio que hay en el repo es HTML + CSS + JS puro, sin framework y sin build. React y Bootstrap son el siguiente paso, todavía no implementados: no hay `package.json` ni build. Ver §4, Fase 7.
> **Estado del documento:** las listas de la §4 y la §5 se contrastaron contra el código el 2026-09-29.

---

## 1. Visión del Proyecto

Tienda en línea de comida casera chilena con dos áreas principales:

- **Vistas de Tienda** (lado cliente): Home, Nosotros, Blogs, Detalle de Blogs, Contacto, Login y Registro de Usuarios.
- **Vistas de Administrador**: Dashboard, listados y mantenedores (Usuarios y Productos).

Todo el contenido (catálogo de productos, regiones/comunas, usuarios) se maneja mediante arreglos en JavaScript. El carrito se mantiene solo en memoria durante la sesión (sin Web Storage). **Por seguridad, en Login/Registro no se debe utilizar `localStorage` ni `sessionStorage` para credenciales, tokens o datos personales (riesgo XSS); solo memoria o backend seguro.**

---

## 2. Identidad Visual

### Concepto

Diseño de tipo **"casero"**: cálido, rústico y artesanal, que evoca la nostalgia y la calidez del hogar chileno. La estética se apoya en el afiche chileno tradicional (Lira Popular), con imagen protagonista, jerarquía tipográfica clara y colores vibrantes con carga identitaria local.

### Paleta de colores

| Rol          | Color                | Hex       | Uso                                     |
| ------------ | -------------------- | --------- | --------------------------------------- |
| Primario     | Rojo Terracota       | `#C0392B` | Acentos, CTA, bordes decorativos        |
| Secundario   | Ocre / Mostaza       | `#D4A017` | Títulos destacados, hover states        |
| Acento 1     | Verde Oliva          | `#6B8F3C` | Ingredientes frescos, acentos naturales |
| Acento 2     | Limón de Pica        | `#E8C840` | Hover states, badges, ofertas           |
| Fondo claro  | Crema / Pergamino    | `#FAF7F2` | Fondo general, respiración visual       |
| Fondo oscuro | Carne Asada Charcoal | `#1C1714` | Secciones hero, footer, contraste       |
| Texto        | Tinta Oscura         | `#2C1810` | Body text                               |
| Neutro       | Madera Clara         | `#8B7355` | Bordes secundarios, metadata            |

**Regla:** 1 primario + 1 acento + 1 tinta + 1 crema. No más.

### Tipografía

- **Display (títulos):** `Fraunces` (serif de alto contraste, calidez artesanal).
- **Cuerpo (texto):** `DM Sans` (sans serif limpia y legible).
- Máximo **2 familias tipográficas** en todo el sitio. Pesos fijos: `400` + `500` + itálicas.

### Temática visual

1. **"Cocina que abraza"** — hogar, familia, recetas heredadas.
2. **"Hecho con cariño"** — artesanal, no industrial.
3. **Sabor y nostalgia** — la mesa familiar chilena, los domingos, las fondas.
4. **Ingredientes de temporada** — conexión con la tierra y lo local.

Elementos: ilustraciones de ingredientes chilenos (ají, merkén, papas, choclo), texturas de madera/papel kraft/greda, fotografía cálida, fondo pizarra para menús.

---

## 3. Estructura del Proyecto

Todo cuelga de `src/`. La estructura pedida (`/css`, `/js`, `/assets`, `/pages`) existe, un nivel más abajo. **Abrir el sitio es servir la raíz del repo y entrar por `src/pages/`.**

```
/
├── src/
│   ├── pages/
│   │   ├── index.html           # Home
│   │   ├── nosotros.html        # Sobre nosotros / historia
│   │   ├── blogs.html           # Listado de blogs
│   │   ├── contacto.html        # Formulario de contacto
│   │   ├── productos.html       # Catálogo completo
│   │   ├── login.html           # Inicio de sesión
│   │   └── registros.html       # Registro de usuarios
│   ├── css/
│   │   ├── home-styles.css      # Sistema de diseño compartido: tokens, header y footer
│   │   ├── auth-styles.css
│   │   ├── blogs-styles.css
│   │   ├── contacto-styles.css
│   │   ├── nosotros-styles.css
│   │   └── productos-styles.css
│   ├── js/
│   │   ├── app.js               # Utilidades generales (reveal on scroll)
│   │   ├── catalogo.js          # Arreglo CATALOGO con los 10 platos
│   │   ├── tienda.js            # Render dinámico sobre [data-catalogo]
│   │   ├── contacto.js          # Validación del formulario en tiempo real
│   │   ├── auth-ui.js           # Modales de sesión
│   │   ├── login.js
│   │   ├── registro.js
│   │   ├── regiones.js          # 16 regiones y sus comunas, select en cascada
│   │   └── supabase.js          # Cliente de Supabase
│   └── assets/
│       ├── img/                 # Fotos .webp de los platos (licencia libre, atribución en el ERS)
│       └── videos/              # Video del catálogo (platos.webm: VP8, 720p, 11,25 s a 24 fps, ~1,1 MB, nueve platos, cinta de nombres estática) + póster
├── PLAN.md
├── README.md
├── COMMIT_GUIA.md
└── Instrucciones_Fullstack2.md
```

**Páginas y archivos que el plan exige y todavía no existen:** `index.html` en la raíz, `detalle-blog.html` (ya enlazado desde `blogs.html`), `admin-dashboard.html`, `admin-productos.html`, `admin-usuarios.html` y `ERS.md`.

`src/js/script.js` está en 0 bytes: sobra, se puede borrar.

---

## 4. Fases de Desarrollo

### Fase 1 — Configuración inicial

- [x] Crear el repositorio público en GitHub.
- [x] Crear la estructura limpia de carpetas: `/css`, `/js`, `/assets`, `/pages` (bajo `src/`).
- [ ] Redactar la versión inicial (V1) del documento **ERS** (Especificación de Requisitos de Software) según la norma **IEEE 830** y la plantilla entregada.

### Fase 2 — Layout y vistas base (HTML/CSS)

- [x] Maquetar el menú global y pie de página adaptativo/responsivo para mantener consistencia en todo el sitio. Presente en las 5 páginas de tienda; `login.html` y `registros.html` quedan sin header ni footer.
- [ ] Crear la estructura HTML completa de las **Vistas de la Tienda** y las **Vistas del Administrador** basadas en los wireframes provistos. Tienda 6 de 7 (falta `detalle-blog.html`); Administrador 0 de 3.
- [x] Aplicar el sistema de diseño: design tokens (variables CSS), paleta terracota/crema/verde oliva, tipografías Fraunces + DM Sans.

### Fase 3 — Lógica de productos y carrito (JavaScript)

- [x] Crear el arreglo JS con el catálogo de productos inicial (`src/js/catalogo.js`, 10 platos).
- [ ] Implementar el renderizado dinámico en la tienda y en la vista de detalle. El render está hecho (`src/js/tienda.js` sobre `[data-catalogo]`); falta la vista de detalle de producto.
- [ ] Programar las funciones del carrito (agregar, modificar cantidades, calcular total) mantenidas en memoria durante la sesión (sin Web Storage por seguridad).

### Fase 4 — Validaciones de formularios y reglas de negocio

Validar campos en formularios con JavaScript en tiempo real:

- [ ] Formulario de Inicio de Sesión (dominio de correo `@duoc.cl`, `@profesor.duoc.cl`, `@gmail.com` y largo de contraseña). Valida en `submit`, no en tiempo real.
- [x] Formulario de Contacto.
- [ ] Formulario de Registro/Mantenedor de Usuarios (RUT sin puntos ni guion, largo de campos, Select de Regiones y Comunas desde arrays JS). La lógica está completa y con las 16 regiones reales; falta pasarla a tiempo real.
- [ ] Formulario de Nuevo/Editar Producto (código, precios, stock entero, stock crítico, imágenes). La vista no existe.

### Fase 5 — Control de accesos según rol

- [ ] Implementar la lógica para restringir accesos según perfil: **Administrador**, **Vendedor**, **Cliente**. El perfil todavía no guarda el rol.

### Fase 6 — Revisión, empaquetado y presentación

- [x] Verificar que todos los cambios estén reflejados con commits claros en GitHub. Salvedad: el historial tiene solo 2 autores, el Integrante 3 no tiene ningún commit.
- [ ] Finalizar el documento ERS (Versión 1) y comprimir el código fuente para entrega.
- [ ] Ensayar la presentación (15 min) y prepararse para la ronda de preguntas individuales.

### Fase 7 — Migración a React y Bootstrap

- [ ] Levantar el build: Vite + React, con `package.json` y estructura de componentes.
- [ ] Portar `home`, `nosotros`, `blogs`, `detalle-blog`, `contacto`, `productos`, `login` y `registros` a componentes.
- [ ] Portar el sistema de diseño: los tokens de `home-styles.css` pasan a variables CSS globales, y los tokens de Bootstrap se alinean con la paleta terracota/crema/verde oliva para que no pelen.
- [ ] Migrar `catalogo.js` + `tienda.js` al estado de React: el catálogo pasa a ser la fuente de datos del render y de la vista de detalle.
- [ ] Auth: `login.js`, `registro.js` y `auth-ui.js` pasan a ser hooks sobre el cliente de Supabase. Los modales `<dialog>` pasan a ser estado de React.
- [ ] Carrito en memoria: contexto de React, nunca Web Storage.

> Hoy el sitio es HTML + CSS + JS puro. Esta fase es la que convierte el "sin framework" en React; hasta que exista `package.json`, el repositorio sigue siendo estático.

---

## 5. División de Trabajo (Equipo de 3 Integrantes)

### Integrante 1 — Módulo: Usuarios y Autenticación (Encargado Ernesto)

| Responsabilidad Técnica                                                                                                                | Estado                                                                                                          |
| -------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------- |
| Maquetación HTML/CSS de Login y Registro de Usuarios                                                                                   | Completado: `auth-styles.css` con los tokens del sitio. Falta decidir si estas 2 páginas llevan header y footer |
| Lógica de Login y Registro con Supabase Auth (confirmación de correo y reenvío)                                                        | Completado                                                                                                      |
| Validaciones de Login: dominio de correo (`@duoc.cl`, `@profesor.duoc.cl`, `@gmail.com`) y largo de contraseña                         | Completado, pero solo al enviar el formulario, no en tiempo real                                                |
| Validaciones de Registro/Mantenedor de Usuario: RUT sin puntos ni guion, largo de campos, Select de Regiones y Comunas desde arrays JS | Completado, con las 16 regiones y sus comunas reales. Falta pasarlo a tiempo real                               |

### Integrante 2 — Módulo: Tienda y Carrito

| Responsabilidad Técnica                                                         | Estado                                                                |
| ------------------------------------------------------------------------------- | --------------------------------------------------------------------- |
| Maquetación HTML/CSS de Tienda (Home, Nosotros, Blogs, Detalle Blogs, Contacto) | Completado y rediseñado                                               |
| Sistema de diseño: design tokens, paleta, tipografías y texturas                | Completado                                                            |
| Catálogo de 10 platos con fotos reales y video                                  | Completado                                                            |
| Validaciones JS del Formulario de Contacto (en tiempo real)                     | Completado                                                            |
| Detalle Blogs                                                                   | Pendiente: `blogs.html` ya lo enlaza, el archivo no existe            |
| Lógica de productos mediante arrays en JS                                       | Completado: catálogo en `catalogo.js`, render en `tienda.js`          |
| Render dinámico en la **vista de detalle** de producto                          | Pendiente: las tarjetas de `productos.html` todavía no son enlazables |
| Implementación del Carrito de Compras en JS en memoria (sin Web Storage)        | Pendiente, sin dueño asignado                                         |

### Integrante 3 — Módulo: Administrador y Roles

| Responsabilidad Técnica                                                                                    | Estado                                        |
| ---------------------------------------------------------------------------------------------------------- | --------------------------------------------- |
| Maquetación HTML/CSS del Dashboard Administrador, listados y mantenedores                                  | Pendiente: no existe ninguna de las 3 páginas |
| Validaciones del formulario Nuevo/Editar Producto (código, precios, stock entero, stock crítico, imágenes) | Pendiente                                     |
| Control de visualización según rol del sistema (Administrador, Vendedor, Cliente)                          | Pendiente: el perfil todavía no guarda el rol |

### Responsabilidades administrativas

| Integrante | Responsabilidad                                                                                                                                                       | Estado                              |
| ---------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------- |
| 1          | Configurar el repositorio público de GitHub y gestionar las ramas · Redactar la **sección 2** del ERS (Perspectiva, Funciones y Restricciones)                        | Repositorio creado; ERS sin empezar |
| 2          | Redactar la **sección 1** del ERS (Introducción, Propósito y Ámbito) · Preparar la estructura de la diapositiva/presentación del proyecto                             | Sin empezar                         |
| 3          | Redactar la **sección 3** del ERS (Requisitos Específicos: Funcionales y No Funcionales) · Empaquetado final y verificación del correcto envío del archivo comprimido | Sin empezar                         |

---

## 6. Convención de Commits

Cada integrante sube su propio código con commits individuales (commits directos o Pull Requests en su rama) para demostrar participación en el historial de Git. Usar el formato estándar de `COMMIT_GUIA.md`:

| Tipo        | Descripción                                 |
| ----------- | ------------------------------------------- |
| `feat:`     | Nueva característica o función              |
| `fix:`      | Corrección de un error (bug)                |
| `docs:`     | Cambios exclusivos en la documentación      |
| `style:`    | Cambios de formato que no afectan la lógica |
| `refactor:` | Refactorización sin cambiar funcionalidad   |
| `test:`     | Adición o corrección de pruebas             |
