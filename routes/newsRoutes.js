const express = require("express");
const router = express.Router();
const newsController = require("../controllers/newsController");

// Rota para obter todas as notícias com suas categorias
router.get("/", newsController.getAllNews);

// Rota para obter uma notícia específica
router.get("/:id", newsController.getNewsById);

// Rota para adicionar uma nova notícia com múltiplas categorias
router.post("/", newsController.addNews);

// Rota para atualizar uma notícia
router.put("/:id", newsController.updateNews);

// Rota para excluir uma notícia (corrigido)
router.delete("/:id", newsController.deleteNews);
module.exports = router;
