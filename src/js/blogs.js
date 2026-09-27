// Filtros del blog por categoría — solo memoria, sin Web Storage.
(function () {
  const botones = document.querySelectorAll(".filtro");
  const posts = document.querySelectorAll(".post[data-categoria]");
  if (!botones.length || !posts.length) return;

  botones.forEach((btn) => {
    btn.addEventListener("click", () => {
      botones.forEach((b) => {
        b.classList.remove("is-activo");
        b.setAttribute("aria-pressed", "false");
      });
      btn.classList.add("is-activo");
      btn.setAttribute("aria-pressed", "true");
      const filtro = btn.dataset.filtro;
      posts.forEach((post) => {
        const visible = filtro === "todas" || post.dataset.categoria === filtro;
        post.hidden = !visible;
        post.classList.toggle("is-visible", visible);
      });
    });
  });
})();
