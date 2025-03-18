const express = require("express");
const router = express.Router();
const categoryController = require("../controllers/categoryController");

// Rota para obter todas as categorias
router.get("/", categoryController.getAllCategories);

// Rota para adicionar uma nova categoria
router.post("/", categoryController.addCategory);

module.exports = router;
