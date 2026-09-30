# E-Commerce — Proyecto Fullstack 2

Proyecto académico de la asignatura **DSY1104 (Fullstack 2)**: un e-commerce dinámico construido con HTML, CSS, JavaScript, React y Bootstrap.

> **Estado del stack (2026-09-29):** lo que hay en el repositorio es HTML + CSS + JS puro, sin framework y sin build. React y Bootstrap son el siguiente paso (Fase 7 del `PLAN.md`) y todavía no están implementados.

## Descripción

El sitio será una tienda en línea con dos áreas principales:

- **Vistas de Tienda** (lado cliente): Home, Nosotros, Blogs, Detalle de Blogs, Contacto, Productos, Login y Registro de Usuarios.
- **Vistas de Administrador**: Dashboard, listados y mantenedores (Usuarios y Productos).

Todo el contenido (catálogo de productos, regiones/comunas, usuarios) se manejará mediante arreglos en JavaScript. El carrito se mantiene solo en memoria durante la sesión (sin Web Storage). **Por seguridad, en Login/Registro no se debe utilizar `localStorage` ni `sessionStorage` para credenciales, tokens o datos personales (riesgo XSS); solo memoria o backend seguro.**

## Características

- Layout responsivo: menú global y pie de página consistentes en todo el sitio.
- Catálogo de productos renderizado dinámicamente desde arrays JS.
- Carrito de compras funcional: agregar, modificar cantidades y calcular total, mantenido en memoria durante la sesión (sin persistencia local por seguridad).
- Validación de formularios (Login, Contacto, Usuarios, Productos), incluyendo RUT y dominios de correo restringidos.
- Control de acceso según rol: **Administrador**, **Vendedor** y **Cliente**.
- Autenticación con Supabase Auth, con confirmación de correo.
- Documentación de requisitos (ERS) según norma **IEEE 830**.

## Estructura de Carpetas

Todo cuelga de `src/`. La estructura pedida (`/css`, `/js`, `/assets`, `/pages`) existe un nivel más abajo.

```
/src
├── pages      # HTML: tienda, auth y (pendiente) administrador
├── css        # Un archivo de estilos por página; home-styles.css es el sistema compartido
├── js         # Lógica: catálogo, render, validaciones, auth con Supabase
└── assets     # Fotos .webp de los platos y video del catálogo
```

Para ver el sitio, servir la raíz del repositorio y entrar por `src/pages/home.html`.

## Roles en el Equipo

- **Integrante 1** — Módulo Usuarios y Autenticación (Login/Registro con Supabase Auth, validaciones de RUT y correo, select de Regiones/Comunas, maquetación de las páginas de auth).
- **Integrante 2** — Módulo Tienda y Carrito (HTML/CSS del sitio, sistema de diseño, validaciones de contacto, productos en arrays, carrito en memoria sin Web Storage).
- **Integrante 3** — Módulo Administrador y Roles (Dashboard, mantenedores, validaciones de productos, control de acceso por rol).

Cada integrante trabaja en su rama y sube sus cambios con commits individuales para demostrar participación en el historial de Git.

> **Nota:** este README es una versión temporal y será reemplazado por la documentación definitiva del proyecto.
