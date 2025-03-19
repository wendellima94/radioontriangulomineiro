const jwt = require("jsonwebtoken");
const pool = require("../database/db");

const authenticate = async (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ error: "Acesso negado" });

  jwt.verify(token, "secreto", async (err, decoded) => {
    if (err) return res.status(403).json({ error: "Token inválido" });

    try {
      const [rows] = await pool
        .promise()
        .query("SELECT * FROM users WHERE id = ?", [decoded.id]);

      const user = rows[0];

      if (!user)
        return res.status(401).json({ error: "Usuário não encontrado" });

      req.user = user;
      next();
    } catch (error) {
      res.status(500).json({ error: "Erro interno do servidor" });
    }
  });
};

const isAdmin = (req, res, next) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({ error: "Acesso restrito a admins" });
  }
  next();
};

module.exports = { authenticate, isAdmin };
