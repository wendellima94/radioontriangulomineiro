const bcrypt = require("bcrypt");
const pool = require("./database/db");

// Função para criar usuário admin se ele não existir
const createAdminUser = async () => {
  try {
    const [results] = await pool
      .promise()
      .query("SELECT COUNT(*) AS count FROM users WHERE role = 'admin'");

    if (results[0].count === 0) {
      const hashedPassword = await bcrypt.hash("admin123", 10); // Criptografa a senha
      await pool
        .promise()
        .query(
          "INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)",
          ["Admin", "admin@email.com", hashedPassword, "admin"]
        );
      console.log("Usuário administrador criado com sucesso!");
    }
  } catch (error) {
    console.error("Erro ao criar usuário admin:", error);
  }
};

// Executa a função ao iniciar o servidor
createAdminUser();
