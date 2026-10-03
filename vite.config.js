import { defineConfig } from "vite";
import { resolve } from "path";

export default defineConfig({
  root: "./",
  build: {
    outDir: "dist",
    rollupOptions: {
      input: {
        main: resolve(__dirname, "index.html"),
        admin: resolve(__dirname, "src/pages/admin-productos.html"),
        blogs: resolve(__dirname, "src/pages/blogs.html"),
        contacto: resolve(__dirname, "src/pages/contacto.html"),
        login: resolve(__dirname, "src/pages/login.html"),
        nosotros: resolve(__dirname, "src/pages/nosotros.html"),
        productos: resolve(__dirname, "src/pages/productos.html"),
        registros: resolve(__dirname, "src/pages/registros.html"),
      },
    },
  },
});
