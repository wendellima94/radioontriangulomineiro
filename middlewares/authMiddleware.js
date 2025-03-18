const jwt = require("jsonwebtoken");

const authenticate = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ error: "Acesso negado" });

  jwt.verify(token, "secreto", (err, decoded) => {
    if (err) return res.status(403).json({ error: "Token inválido" });

    req.user = decoded;
    next();
  });
};

const isAdmin = (req, res, next) => {
  if (req.user.role !== "admin") return res.status(403).json({ error: "Acesso restrito a admins" });
  next();
};

module.exports = { authenticate, isAdmin };
