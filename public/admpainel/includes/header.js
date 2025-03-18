document.addEventListener("DOMContentLoaded", function () {
  fetch("header.js")
    .then((response) => response.text())
    .then((data) => {
      document.body.insertAdjacentHTML("afterbegin", data);
    })
    .catch((error) => console.error("Erro ao carregar o header:", error));
});
