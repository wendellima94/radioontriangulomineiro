document
  .getElementById("login-form")
  .addEventListener("submit", async function (event) {
    event.preventDefault();

    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    const errorMessage = document.getElementById("error-message");

    errorMessage.textContent = "";

    try {
      const response = await fetch("http://localhost:3000/api/v1/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "E-mail ou senha incorretos!");
      }

      // Armazena o token no localStorage
      localStorage.setItem("token", data.token);

      alert("Login realizado com sucesso!");
      window.location.href = "/admpainel"; // Redireciona para a página principal
    } catch (error) {
      errorMessage.textContent = error.message;
    }
  });
