const db = require("../database/db");

// Função para obter todas as categorias
const getAllCategories = (req, res) => {
  db.query("SELECT * FROM categories", (err, results) => {
    if (err) {
      console.error("Erro ao obter categorias: " + err.stack);
      return res.status(500).json({ error: "Erro ao obter categorias" });
    }
    res.json({ categories: results });
  });
};

// Função para adicionar uma nova categoria
const addCategory = (req, res) => {
  const { name } = req.body;
  const query = "INSERT INTO categories (name) VALUES (?)";
  db.query(query, [name], (err, result) => {
    if (err) {
      console.error("Erro ao adicionar categoria: " + err.stack);
      return res.status(500).json({ error: "Erro ao adicionar categoria" });
    }
    res.status(201).json({ message: "Categoria adicionada com sucesso!", id: result.insertId });
  });
};

// Exportando as funções
module.exports = {
  getAllCategories,
  addCategory,
};
