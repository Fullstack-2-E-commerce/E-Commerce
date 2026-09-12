# Fullstack 2 — Guía del Proyecto (DSY1104)

Evaluación de la asignatura DSY1104: guía paso a paso y estrategia óptima de distribución del trabajo en un equipo de 3 integrantes.

---

## 1. Paso a Paso del Proyecto

### Paso 1: Configuración inicial del entorno y repositorio
- [ ] Crear el repositorio público en GitHub.
- [ ] Crear una estructura limpia de carpetas: `/css`, `/js`, `/assets`, `/pages`.
- [ ] Redactar la versión inicial (V1) del documento **ERS** (Especificación de Requisitos de Software) siguiendo la norma **IEEE 830** y la plantilla entregada.

### Paso 2: Construcción del layout y vistas base (HTML/CSS)
- [ ] Maquetar el menú global y pie de página en CSS adaptativo/responsivo para mantener consistencia en todo el sitio.
- [ ] Crear la estructura HTML completa de las **Vistas de la Tienda** y las **Vistas del Administrador** basadas en los wireframes provistos.

### Paso 3: Lógica de productos y carrito de compras (JavaScript)
- [ ] Crear el arreglo JS con el catálogo de productos inicial.
- [ ] Implementar el renderizado dinámico en la tienda y en la vista de detalle.
- [ ] Programar las funciones del carrito (agregar, modificar cantidades, calcular total) respaldadas en `localStorage`.

### Paso 4: Validaciones de formularios y reglas de negocio
Validar campos en formularios con JavaScript en tiempo real:
- [ ] Formulario de Inicio de Sesión.
- [ ] Formulario de Contacto.
- [ ] Formulario de Registro/Mantenedor de Usuarios (validación de RUT, dominios de correo, etc.).
- [ ] Formulario de Nuevo/Editar Producto.

### Paso 5: Control de accesos según rol
- [ ] Implementar la lógica para restringir accesos según perfil: **Administrador**, **Vendedor**, **Cliente**.

### Paso 6: Revisión, empaquetado y preparación de la presentación
- [ ] Verificar que todos los cambios estén reflejados con commits claros en GitHub.
- [ ] Finalizar el documento ERS (Versión 1) y comprimir el código fuente para entrega.
- [ ] Ensayar la presentación (15 min) y prepararse para la ronda de preguntas individuales.

---

## 2. División de Trabajo (Equipo de 3 Integrantes)

Para lograr un avance simultáneo y equitativo en GitHub, se estructuran los módulos por responsabilidades balanceadas en carga administrativa y técnica.

### Integrante 1 — Módulo: Tienda y Carrito

| Responsabilidad Técnica | Responsabilidad Administrativa |
|---|---|
| Maquetación HTML/CSS de Tienda (Home, Nosotros, Blogs, Detalle Blogs, Contacto) | Configurar el repositorio público de GitHub y gestionar las ramas |
| Lógica de productos mediante arrays en JS | Redactar la **sección 1** del ERS (Introducción, Propósito y Ámbito) |
| Implementación del Carrito de Compras en JS + LocalStorage | |
| Validaciones JS del Formulario de Contacto | |

### Integrante 2 — Módulo: Usuarios y Autenticación (Encargado Ernesto)

| Responsabilidad Técnica | Responsabilidad Administrativa |
|---|---|
| Maquetación HTML/CSS de Login y Registro de Usuarios | Redactar la **sección 2** del ERS (Perspectiva, Funciones y Restricciones) |
| Validaciones de Login: dominio de correo (`@duoc.cl`, `@profesor.duoc.cl`, `@gmail.com`) y largo de contraseña | Preparar la estructura de la diapositiva/presentación del proyecto |
| Validaciones de Registro/Mantenedor de Usuario: RUT sin puntos ni guion, largo de campos, Select de Regiones y Comunas desde arrays JS | |

### Integrante 3 — Módulo: Administrador y Roles

| Responsabilidad Técnica | Responsabilidad Administrativa |
|---|---|
| Maquetación HTML/CSS del Dashboard Administrador, listados y mantenedores | Redactar la **sección 3** del ERS (Requisitos Específicos: Funcionales y No Funcionales) |
| Validaciones del formulario Nuevo/Editar Producto (código, precios, stock entero, stock crítico, imágenes) | Empaquetado final y verificación del correcto envío del archivo comprimido |
| Control de visualización según rol del sistema (Administrador, Vendedor, Cliente) | |

---

## 3. Consejos para la Evaluación Individual

- **Commits individuales:** cada participante debe subir su propio código a GitHub a través de *pull requests* o commits directos en su rama de trabajo, para demostrar participación directa en la revisión del docente.
- **Defensa técnica:** en la ronda de preguntas, el docente evaluará los cambios registrados en el historial de Git, por lo que cada integrante debe dominar el código de sus funciones asignadas.