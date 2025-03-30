const express = require("express");
const { createUser } = require("../models/userModel");
const { login } = require("../controllers/authController");
const { authenticate, isAdmin } = require("../middlewares/authMiddleware");

const router = express.Router();

router.post("/login", login);

// Rota para criar usuário (somente admin)
router.post("/create", authenticate, isAdmin, async (req, res) => {
  const { name, email, password, role } = req.body;
  if (!["admin", "editor"].includes(role))
    return res.status(400).json({ error: "Role inválido" });

  try {
    const userId = await createUser(name, email, password, role);
    res.status(201).json({ message: "Usuário criado", id: userId });
  } catch (error) {
    res.status(500).json({ error: "Erro ao criar usuário" });
  }
});

module.exports = router;
