const express = require("express");
const router = express.Router();
const categoryController = require("../controllers/categoryController");

// Rota para obter todas as categorias
router.get("/", categoryController.getAllCategories);

// Rota para adicionar uma nova categoria
router.post("/", categoryController.addCategory);

// Rota para editar uma categoria
router.put("/:id", categoryController.editCategory);

// Rota para excluir uma categoria
router.delete("/:id", categoryController.deleteCategory);

module.exports = router;
