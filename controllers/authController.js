const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { getUserByEmail } = require("../models/userModel");

const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await getUserByEmail(email);

    console.log(user.password); // Verifique o valor da senha armazenada

    if (!user) return res.status(401).json({ error: "Usuário não encontrado" });

    console.log(user); // Log para depuração

    const passwordMatch = await bcrypt.compare(password, user.password); // Verifica a senha
    if (!passwordMatch)
      return res.status(401).json({ error: "Senha incorreta" });

    const token = jwt.sign({ id: user.id, role: user.role }, "secreto", {
      expiresIn: "1h",
    });
    res.json({ token, role: user.role });
  } catch (error) {
    console.error("Erro no login:", error);
    res.status(500).json({ error: "Erro no login" });
  }
};

module.exports = { login };
