const db = require("../database/db");

const getAllCategories = (req, res) => {
  db.query("SELECT * FROM categories", (err, results) => {
    if (err) {
      console.error("Erro ao obter categorias: " + err.stack);
      return res.status(500).json({ error: "Erro ao obter categorias" });
    }
    res.json({ categories: results });
  });
};

const addCategory = (req, res) => {
  const { name } = req.body;
  const query = "INSERT INTO categories (name) VALUES (?)";
  db.query(query, [name], (err, result) => {
    if (err) {
      console.error("Erro ao adicionar categoria: " + err.stack);
      return res.status(500).json({ error: "Erro ao adicionar categoria" });
    }
    res.status(201).json({
      message: "Categoria adicionada com sucesso!",
      id: result.insertId,
    });
  });
};

const editCategory = (req, res) => {
  const { id } = req.params;
  const { name } = req.body;
  const query = "UPDATE categories SET name = ? WHERE id = ?";
  db.query(query, [name, id], (err, result) => {
    if (err) {
      console.error("Erro ao editar categoria: " + err.stack);
      return res.status(500).json({ error: "Erro ao editar categoria" });
    }
    res.json({ message: "Categoria editada com sucesso!" });
  });
};

const deleteCategory = (req, res) => {
  const { id } = req.params;
  const query = "DELETE FROM categories WHERE id = ?";
  db.query(query, [id], (err, result) => {
    if (err) {
      console.error("Erro ao deletar categoria: " + err.stack);
      return res.status(500).json({ error: "Erro ao deletar categoria" });
    }
    res.json({ message: "Categoria deletada com sucesso!" });
  });
};

module.exports = {
  getAllCategories,
  addCategory,
  editCategory,
  deleteCategory,
};
