// Configuración e Inicialización de Supabase
const SUPABASE_URL = "https://TU_PROYECTO.supabase.co"; // Reemplazar con URL de Supabase
const SUPABASE_ANON_KEY = "TU_ANON_KEY"; // Reemplazar con anon key de Supabase

const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Elementos del DOM
const form = document.getElementById("form-producto");
const tablaBody = document.getElementById("tabla-productos-body");
const feedbackEl = document.getElementById("mensaje-feedback");
const btnCancelar = document.getElementById("btn-cancelar");
const formTitle = document.getElementById("form-title");

let editandoId = null;

// Cargar productos al iniciar la página
document.addEventListener("DOMContentLoaded", () => {
  obtenerProductos();
});

// FUNCIÓN: Mostrar mensajes dinámicos en pantalla
function mostrarFeedback(mensaje, tipo) {
  feedbackEl.style.display = "block";
  feedbackEl.textContent = mensaje;

  if (tipo === "error") {
    feedbackEl.style.backgroundColor = "#f8d7da";
    feedbackEl.style.color = "#721c24";
    feedbackEl.style.border = "1px solid #f5c6cb";
  } else {
    feedbackEl.style.backgroundColor = "#d4edda";
    feedbackEl.style.color = "#155724";
    feedbackEl.style.border = "1px solid #c3e6cb";
  }
}

// FUNCIÓN: Obtener y Listar Productos desde Supabase
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

  if (productos.length === 0) {
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
        <button class="btn-edit" onclick="prepararEdicion(${prod.id})">✏️</button>
        <button class="btn-delete" onclick="eliminarProducto(${prod.id})">🗑️</button>
      </td>
    `;
    tablaBody.appendChild(tr);
  });
}

// MANEJO DEL FORMULARIO (Crear / Editar con Validaciones)
form.addEventListener("submit", async (e) => {
  e.preventDefault();
  feedbackEl.style.display = "none";

  // Capturar y sanitizar datos
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

  // VALIDACIONES (Requerimiento R.9)
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
    // ACTUALIZAR PRODUCTO
    const { error } = await supabase
      .from("productos")
      .update(payload)
      .eq("id", editandoId);
    if (error) {
      mostrarFeedback("Error al actualizar: " + error.message, "error");
    } else {
      mostrarFeedback("¡Producto actualizado con éxito!", "exito");
      resetearFormulario();
      obtenerProductos();
    }
  } else {
    // CREAR PRODUCTO
    const { error } = await supabase.from("productos").insert([payload]);
    if (error) {
      mostrarFeedback("Error al guardar: " + error.message, "error");
    } else {
      mostrarFeedback("¡Producto creado con éxito!", "exito");
      resetearFormulario();
      obtenerProductos();
    }
  }
});

// FUNCIÓN: Eliminar Producto
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

// FUNCIÓN: Cargar datos en el formulario para editar
async function prepararEdicion(id) {
  const { data: prod, error } = await supabase
    .from("productos")
    .select("*")
    .eq("id", id)
    .single();
  if (error) return;

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
  btnCancelar.style.display = "block";
}

function resetearFormulario() {
  editandoId = null;
  form.reset();
  formTitle.textContent = "Agregar Nuevo Producto";
  btnCancelar.style.display = "none";
}

btnCancelar.addEventListener("click", resetearFormulario);
