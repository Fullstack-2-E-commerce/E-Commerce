# E-Commerce — Proyecto Fullstack 2

Proyecto académico de la asignatura **DSY1104 (Fullstack 2)**: un e-commerce dinámico construido con HTML, CSS y JavaScript.

## Descripción

El sitio será una tienda en línea con dos áreas principales:

- **Vistas de Tienda** (lado cliente): Home, Nosotros, Blogs, Detalle de Blogs, Contacto, Login y Registro de Usuarios.
- **Vistas de Administrador**: Dashboard, listados y mantenedores (Usuarios y Productos).

Todo el contenido (catálogo de productos, regiones/comunas, usuarios) se manejará mediante arreglos en JavaScript, y la persistencia del carrito y datos se hará con `localStorage`.

## Características

- Layout responsivo: menú global y pie de página consistentes en todo el sitio.
- Catálogo de productos renderizado dinámicamente desde arrays JS, con vista de detalle.
- Carrito de compras funcional: agregar, modificar cantidades y calcular total, respaldado en `localStorage`.
- Validación de formularios en tiempo real (Login, Contacto, Usuarios, Productos), incluyendo RUT y dominios de correo restringidos.
- Control de acceso según rol: **Administrador**, **Vendedor** y **Cliente**.
- Documentación de requisitos (ERS) según norma **IEEE 830**.

## Estructura de Carpetas

```
/css
/js
/assets
/pages
```

## Roles en el Equipo

- **Integrante 1** — Módulo Tienda y Carrito (HTML/CSS del sitio, productos en arrays, carrito + localStorage, validaciones de contacto).
- **Integrante 2** — Módulo Usuarios y Autenticación (Login/Registro, validaciones de RUT y correo, select de Regiones/Comunas).
- **Integrante 3** — Módulo Administrador y Roles (Dashboard, mantenedores, validaciones de productos, control de acceso por rol).

Cada integrante trabaja en su rama y sube sus cambios con commits individuales para demostrar participación en el historial de Git.

> **Nota:** este README es una versión temporal y será reemplazado por la documentación definitiva del proyecto.
