# Guía de Proyecto de Frontend — E-Commerce de Comida Casera

> **Asignatura:** DSY1104 (Fullstack 2)
> **Proyecto:** E-commerce dedicado a restaurantes de comida casera chilena.
> **Tecnologías:** HTML, CSS, JavaScript y React

---

## 1. Visión del Proyecto

Tienda en línea de comida casera chilena con dos áreas principales:

- **Vistas de Tienda** (lado cliente): Home, Nosotros, Blogs, Detalle de Blogs, Contacto, Login y Registro de Usuarios.
- **Vistas de Administrador**: Dashboard, listados y mantenedores (Usuarios y Productos).

Todo el contenido (catálogo de productos, regiones/comunas, usuarios) se maneja mediante arreglos en JavaScript, y la persistencia del carrito y datos se hace con `localStorage`.

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

```
/
├── index.html                # Home (página principal de la tienda)
├── css/
│   └── home-styles.css       # Styles globales del sitio
├── js/
│   ├── app.js                # Lógica general de la tienda (catálogo, render de productos)
│   └── script.js             # Scripts adicionales
├── pages/
│   ├── home.html             # Home (alternativo)
│   ├── nosotros.html         # Sobre nosotros / historia
│   ├── blogs.html            # Listado de blogs
│   ├── detalle-blog.html     # Detalle de un blog
│   ├── contacto.html         # Formulario de contacto
│   ├── login.html            # Inicio de sesión
│   ├── registro.html         # Registro / mantenedor de usuarios
│   ├── admin-dashboard.html  # Dashboard del administrador
│   ├── admin-productos.html  # Mantenedor de productos
│   └── admin-usuarios.html   # Mantenedor de usuarios
├── assets/                   # Imágenes, íconos y recursos
├── PLAN.md
├── README.md
└── ERS.md                    # Especificación de Requisitos de Software (IEEE 830)
```

---

## 4. Fases de Desarrollo

### Fase 1 — Configuración inicial

- [ ] Crear el repositorio público en GitHub.
- [ ] Crear la estructura limpia de carpetas: `/css`, `/js`, `/assets`, `/pages`.
- [ ] Redactar la versión inicial (V1) del documento **ERS** (Especificación de Requisitos de Software) según la norma **IEEE 830** y la plantilla entregada.

### Fase 2 — Layout y vistas base (HTML/CSS)

- [ ] Maquetar el menú global y pie de página adaptativo/responsivo para mantener consistencia en todo el sitio.
- [ ] Crear la estructura HTML completa de las **Vistas de la Tienda** y las **Vistas del Administrador** basadas en los wireframes provistos.
- [ ] Aplicar el sistema de diseño: design tokens (variables CSS), paleta terracota/crema/verde oliva, tipografías Fraunces + DM Sans.

### Fase 3 — Lógica de productos y carrito (JavaScript)

- [ ] Crear el arreglo JS con el catálogo de productos inicial.
- [ ] Implementar el renderizado dinámico en la tienda y en la vista de detalle.
- [ ] Programar las funciones del carrito (agregar, modificar cantidades, calcular total) respaldadas en `localStorage`.

### Fase 4 — Validaciones de formularios y reglas de negocio

Validar campos en formularios con JavaScript en tiempo real:

- [ ] Formulario de Inicio de Sesión (dominio de correo `@duoc.cl`, `@profesor.duoc.cl`, `@gmail.com` y largo de contraseña).
- [ ] Formulario de Contacto.
- [ ] Formulario de Registro/Mantenedor de Usuarios (RUT sin puntos ni guion, largo de campos, Select de Regiones y Comunas desde arrays JS).
- [ ] Formulario de Nuevo/Editar Producto (código, precios, stock entero, stock crítico, imágenes).

### Fase 5 — Control de accesos según rol

- [ ] Implementar la lógica para restringir accesos según perfil: **Administrador**, **Vendedor**, **Cliente**.

### Fase 6 — Revisión, empaquetado y presentación

- [ ] Verificar que todos los cambios estén reflejados con commits claros en GitHub.
- [ ] Finalizar el documento ERS (Versión 1) y comprimir el código fuente para entrega.
- [ ] Ensayar la presentación (15 min) y prepararse para la ronda de preguntas individuales.

---

## 5. División de Trabajo (Equipo de 3 Integrantes)

### Integrante 1 — Módulo: Tienda y Carrito

| Responsabilidad Técnica                                                         | Responsabilidad Administrativa                                       |
| ------------------------------------------------------------------------------- | -------------------------------------------------------------------- |
| Maquetación HTML/CSS de Tienda (Home, Nosotros, Blogs, Detalle Blogs, Contacto) | Configurar el repositorio público de GitHub y gestionar las ramas    |
| Lógica de productos mediante arrays en JS                                       | Redactar la **sección 1** del ERS (Introducción, Propósito y Ámbito) |
| Implementación del Carrito de Compras en JS + LocalStorage                      |                                                                      |
| Validaciones JS del Formulario de Contacto                                      |                                                                      |

### Integrante 2 — Módulo: Usuarios y Autenticación (Encargado Ernesto)

| Responsabilidad Técnica                                                                                            | Responsabilidad Administrativa                                             |
| ------------------------------------------------------------------------------------------------------------------ | -------------------------------------------------------------------------- |
| Maquetación HTML/CSS de Login y Registro de Usuarios                                                               | Redactar la **sección 2** del ERS (Perspectiva, Funciones y Restricciones) |
| Validaciones de Login: dominio de correo y largo de contraseña                                                     | Preparar la estructura de la diapositiva/presentación del proyecto         |
| Validaciones de Registro/Mantenedor de Usuario: RUT, largo de campos, Select de Regiones y Comunas desde arrays JS |                                                                            |

### Integrante 3 — Módulo: Administrador y Roles

| Responsabilidad Técnica                                                           | Responsabilidad Administrativa                                                           |
| --------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------- |
| Maquetación HTML/CSS del Dashboard Administrador, listados y mantenedores         | Redactar la **sección 3** del ERS (Requisitos Específicos: Funcionales y No Funcionales) |
| Validaciones del formulario Nuevo/Editar Producto                                 | Empaquetado final y verificación del envío del archivo comprimido                        |
| Control de visualización según rol del sistema (Administrador, Vendedor, Cliente) |                                                                                          |

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
