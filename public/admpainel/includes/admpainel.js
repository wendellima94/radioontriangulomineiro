document.addEventListener("DOMContentLoaded", async () => {
  const token = localStorage.getItem("token");

  if (!token) {
    alert("Acesso não autorizado. Faça login primeiro.");
    window.location.href = "/login";
    return;
  }

  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    if (payload.exp * 1000 < Date.now()) {
      alert("Sessão expirada. Faça login novamente.");
      localStorage.removeItem("token");
      window.location.href = "/login";
      return;
    }
  } catch (error) {
    alert("Token inválido. Faça login novamente.");
    localStorage.removeItem("token");
    window.location.href = "/login";
    return;
  }

  try {
    const response = await fetch("http://localhost:3000/admpainel", {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!response.ok) {
      throw new Error(
        response.status === 403 ? "Acesso restrito" : "Erro de autenticação"
      );
    }
  } catch (error) {
    alert(error.message);
    localStorage.removeItem("token");
    window.location.href = "/login";
  }
});
