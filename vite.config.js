import { defineConfig } from "vite";
import { resolve } from "path";
import react from "@vitejs/plugin-react";

export default defineConfig({
  root: "./",
  plugins: [react()],
  build: {
    outDir: "dist",
    rollupOptions: {
      input: {
        main: resolve(__dirname, "index.html"),
        admin: resolve(__dirname, "src/pages/admin-productos.html"),
        blogs: resolve(__dirname, "src/pages/blogs.html"),
        carrito: resolve(__dirname, "src/pages/carrito.html"),
        checkout: resolve(__dirname, "src/pages/checkout.html"),
        cuenta: resolve(__dirname, "src/pages/cuenta.html"),
        contacto: resolve(__dirname, "src/pages/contacto.html"),
        login: resolve(__dirname, "src/pages/login.html"),
        nosotros: resolve(__dirname, "src/pages/nosotros.html"),
        productos: resolve(__dirname, "src/pages/productos.html"),
        registros: resolve(__dirname, "src/pages/registros.html"),
      },
    },
  },
});
