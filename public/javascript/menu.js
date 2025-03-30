function initializeMenu() {
  const menu = document.getElementById("menu");
  const menuButton = document.getElementById("menu-toggle");

  if (menu && menuButton) {
      menuButton.addEventListener("click", function () {
          menu.classList.toggle("active");
          menuButton.innerHTML = menu.classList.contains("active") ? "✖ FECHAR" : "☰ MENU";
      });
  }
}
document.addEventListener("DOMContentLoaded", function () {
  initializeMenu();
});
