import { supabase } from "./supabase.js";

// Elementos del DOM
const form = document.getElementById("form-producto");
const tablaBody = document.getElementById("tabla-productos-body");
const feedbackEl = document.getElementById("mensaje-feedback");
const btnCancelar = document.getElementById("btn-cancelar");
const formTitle = document.getElementById("form-title");
const btnSalir = document.getElementById("authSalir");

let editandoId = null;

// Inicialización con protección de ruta (RBAC)
document.addEventListener("DOMContentLoaded", async () => {
  const tieneAcceso = await verificarAccesoAdmin();
  if (!tieneAcceso) return;

  obtenerProductos();
  configurarEventos();
});

// GUARDIA DE RUTA: Verificar que el usuario tenga rol Administrador o Vendedor
async function verificarAccesoAdmin() {
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    alert("Debes iniciar sesión para acceder al panel de administración.");
    window.location.href = "/src/pages/login.html";
    return false;
  }

  // Consultar el rol en public.usuarios
  const { data: usuario, error } = await supabase
    .from("usuarios")
    .select("rol")
    .eq("id", session.user.id)
    .single();

  if (
    error ||
    !usuario ||
    !["Administrador", "Vendedor"].includes(usuario.rol)
  ) {
    alert("Acceso denegado: No tienes permisos para gestionar productos.");
    window.location.href = "/";
    return false;
  }

  return true;
}

// Configuración de listeners globales de la página
function configurarEventos() {
  if (btnSalir) {
    btnSalir.addEventListener("click", async () => {
      const { error } = await supabase.auth.signOut();
      if (error) {
        mostrarFeedback("Error al cerrar sesión: " + error.message, "error");
        return;
      }
      window.location.href = "/";
    });
  }

  btnCancelar.addEventListener("click", resetearFormulario);

  tablaBody.addEventListener("click", (e) => {
    const btnEdit = e.target.closest(".btn-edit");
    const btnDelete = e.target.closest(".btn-delete");

    if (btnEdit) {
      const id = btnEdit.dataset.id;
      prepararEdicion(id);
    } else if (btnDelete) {
      const id = btnDelete.dataset.id;
      eliminarProducto(id);
    }
  });
}

function mostrarFeedback(mensaje, tipo) {
  feedbackEl.className = "";
  feedbackEl.classList.add(tipo === "error" ? "error" : "exito");
  feedbackEl.textContent = mensaje;
  feedbackEl.style.display = "block";
}

// Obtener y Listar Productos desde Supabase
async function obtenerProductos() {
  tablaBody.innerHTML = `<tr><td colspan="6" style="text-align:center;">Cargando inventario...</td></tr>`;

  const { data: productos, error } = await supabase
    .from("productos")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    mostrarFeedback("Error al cargar productos: " + error.message, "error");
    return;
  }

  tablaBody.innerHTML = "";

  if (!productos || productos.length === 0) {
    tablaBody.innerHTML = `<tr><td colspan="6" style="text-align:center;">No hay productos registrados.</td></tr>`;
    return;
  }

  productos.forEach((prod) => {
    const esCritico = prod.stock <= (prod.stock_critico || 5);
    const badgeClass = esCritico ? "stock-critico" : "stock-normal";
    const badgeTexto = esCritico ? `${prod.stock} ⚠️` : `${prod.stock}`;

    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td><strong>${prod.codigo}</strong></td>
      <td>${prod.nombre}</td>
      <td>${prod.categoria}</td>
      <td>$${Number(prod.precio).toLocaleString("es-CL")}</td>
      <td><span class="stock-badge ${badgeClass}">${badgeTexto}</span></td>
      <td>
        <button class="btn-edit" data-id="${prod.id}" title="Editar">✏️</button>
        <button class="btn-delete" data-id="${prod.id}" title="Eliminar">🗑️</button>
      </td>
    `;
    tablaBody.appendChild(tr);
  });
}

// MANEJO DEL FORMULARIO (Crear / Editar)
form.addEventListener("submit", async (e) => {
  e.preventDefault();
  feedbackEl.style.display = "none";

  const codigo = document.getElementById("prod-codigo").value.trim();
  const nombre = document.getElementById("prod-nombre").value.trim();
  const categoria = document.getElementById("prod-categoria").value;
  const precioInput = document.getElementById("prod-precio").value.trim();
  const stockInput = document.getElementById("prod-stock").value.trim();
  const stockCriticoInput = document
    .getElementById("prod-stock-critico")
    .value.trim();
  const imagen = document.getElementById("prod-imagen").value.trim();
  const descripcion = document.getElementById("prod-descripcion").value.trim();

  const precio = Number(precioInput);
  const stock = Number(stockInput);
  const stockCritico = stockCriticoInput !== "" ? Number(stockCriticoInput) : 5;

  if (codigo.length < 3) {
    mostrarFeedback("El código debe tener al menos 3 caracteres.", "error");
    return;
  }

  if (nombre === "" || nombre.length > 100) {
    mostrarFeedback(
      "Ingresa un nombre válido (máximo 100 caracteres).",
      "error",
    );
    return;
  }

  if (categoria === "") {
    mostrarFeedback("Por favor, selecciona una categoría.", "error");
    return;
  }

  if (precioInput === "" || isNaN(precio) || precio < 0) {
    mostrarFeedback("El precio debe ser un número positivo.", "error");
    return;
  }

  if (
    stockInput === "" ||
    isNaN(stock) ||
    stock < 0 ||
    !Number.isInteger(stock)
  ) {
    mostrarFeedback(
      "El stock debe ser un número entero mayor o igual a 0.",
      "error",
    );
    return;
  }

  const payload = {
    codigo,
    nombre,
    categoria,
    precio,
    stock,
    stock_critico: stockCritico,
    imagen_url: imagen,
    descripcion,
  };

  if (editandoId) {
    const { error } = await supabase
      .from("productos")
      .update(payload)
      .eq("id", editandoId);

    if (error) {
      mostrarFeedback(
        "Error al actualizar producto: " + error.message,
        "error",
      );
    } else {
      mostrarFeedback("¡Producto actualizado con éxito!", "exito");
      resetearFormulario();
      obtenerProductos();
    }
  } else {
    const { error } = await supabase.from("productos").insert([payload]);

    if (error) {
      mostrarFeedback("Error al guardar producto: " + error.message, "error");
    } else {
      mostrarFeedback("¡Producto creado con éxito!", "exito");
      resetearFormulario();
      obtenerProductos();
    }
  }
});

// Eliminar Producto
async function eliminarProducto(id) {
  if (confirm("¿Estás seguro de que deseas eliminar este producto?")) {
    const { error } = await supabase.from("productos").delete().eq("id", id);
    if (error) {
      mostrarFeedback("Error al eliminar: " + error.message, "error");
    } else {
      mostrarFeedback("Producto eliminado correctamente.", "exito");
      obtenerProductos();
    }
  }
}

// Preparar edición
async function prepararEdicion(id) {
  const { data: prod, error } = await supabase
    .from("productos")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    mostrarFeedback(
      "No se pudo obtener el producto: " + error.message,
      "error",
    );
    return;
  }

  editandoId = id;
  document.getElementById("prod-codigo").value = prod.codigo;
  document.getElementById("prod-nombre").value = prod.nombre;
  document.getElementById("prod-categoria").value = prod.categoria;
  document.getElementById("prod-precio").value = prod.precio;
  document.getElementById("prod-stock").value = prod.stock;
  document.getElementById("prod-stock-critico").value = prod.stock_critico;
  document.getElementById("prod-imagen").value = prod.imagen_url || "";
  document.getElementById("prod-descripcion").value = prod.descripcion || "";

  formTitle.textContent = "Editar Producto";
  btnCancelar.classList.remove("is-hidden");
}

function resetearFormulario() {
  editandoId = null;
  form.reset();
  formTitle.textContent = "Agregar Nuevo Producto";
  btnCancelar.classList.add("is-hidden");
}
