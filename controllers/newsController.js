const db = require("../database/db");

// Função para obter todas as notícias com suas categorias
const getAllNews = (req, res) => {
  const query = `
    SELECT news.id, news.title, news.description, news.image, news.url, GROUP_CONCAT(categories.name) AS categories
    FROM news
    LEFT JOIN news_categories ON news.id = news_categories.news_id
    LEFT JOIN categories ON news_categories.category_id = categories.id
    GROUP BY news.id
  `;

  db.query(query, (err, results) => {
    if (err) {
      console.error("Erro ao obter notícias: " + err.stack);
      return res.status(500).json({ error: "Erro ao obter notícias" });
    }
    res.json({ news: results });
  });
};

const getNewsById = (req, res) => {
  const { id } = req.params;

  const query = `
      SELECT news.id, news.title, news.description, news.image, news.url, 
      GROUP_CONCAT(categories.name) AS categories
      FROM news
      LEFT JOIN news_categories ON news.id = news_categories.news_id
      LEFT JOIN categories ON news_categories.category_id = categories.id
      WHERE news.id = ?
      GROUP BY news.id
  `;

  db.query(query, [id], (err, results) => {
    if (err) {
      console.error("Erro ao obter notícia:", err);
      return res.status(500).json({ error: "Erro ao obter notícia" });
    }

    if (results.length === 0) {
      return res.status(404).json({ error: "Notícia não encontrada" });
    }

    res.json(results[0]);
  });
};

// Função para adicionar uma nova notícia com múltiplas categorias
const addNews = (req, res) => {
  const { title, description, image, url, categories } = req.body;

  // Adicionar a notícia na tabela de notícias
  const query =
    "INSERT INTO news (title, description, image, url) VALUES (?, ?, ?, ?)";

  db.query(query, [title, description, image, url], (err, result) => {
    if (err) {
      console.error("Erro ao adicionar notícia: " + err.stack);
      return res.status(500).json({ error: "Erro ao adicionar notícia" });
    }

    // Obter o ID da notícia recém-adicionada
    const newsId = result.insertId;

    // Adicionar as categorias associadas à notícia
    if (categories && categories.length > 0) {
      const categoryValues = categories.map((categoryId) => [
        newsId,
        categoryId,
      ]);
      const insertCategoriesQuery =
        "INSERT INTO news_categories (news_id, category_id) VALUES ?";

      db.query(insertCategoriesQuery, [categoryValues], (err, result) => {
        if (err) {
          console.error("Erro ao associar categorias à notícia: " + err.stack);
          return res
            .status(500)
            .json({ error: "Erro ao associar categorias à notícia" });
        }
        res
          .status(201)
          .json({ message: "Notícia adicionada com sucesso!", id: newsId });
      });
    } else {
      res.status(201).json({
        message: "Notícia adicionada com sucesso, mas sem categorias!",
      });
    }
  });
};

const updateNews = (req, res) => {
  const { id } = req.params;
  const { title, description, image, url, categories } = req.body;

  // Atualiza a notícia
  const query = `UPDATE news SET title = ?, description = ?, image = ?, url = ? WHERE id = ?`;

  db.query(query, [title, description, image, url, id], (err, result) => {
    if (err) {
      console.error("Erro ao atualizar notícia:", err);
      return res.status(500).json({ error: "Erro ao atualizar notícia" });
    }

    // Remove categorias existentes para evitar duplicação
    const deleteCategoriesQuery = `DELETE FROM news_categories WHERE news_id = ?`;
    db.query(deleteCategoriesQuery, [id], (err) => {
      if (err) {
        console.error("Erro ao remover categorias antigas:", err);
        return res.status(500).json({ error: "Erro ao atualizar categorias" });
      }

      // Adiciona as novas categorias associadas
      if (categories && categories.length > 0) {
        const categoryValues = categories.map((categoryId) => [id, categoryId]);
        const insertCategoriesQuery = `INSERT INTO news_categories (news_id, category_id) VALUES ?`;

        db.query(insertCategoriesQuery, [categoryValues], (err) => {
          if (err) {
            console.error("Erro ao associar categorias à notícia:", err);
            return res
              .status(500)
              .json({ error: "Erro ao atualizar categorias" });
          }
          res.json({ message: "Notícia atualizada com sucesso!" });
        });
      } else {
        res.json({ message: "Notícia atualizada sem categorias!" });
      }
    });
  });
};

const deleteNews = (req, res) => {
  const { id } = req.params;

  // Primeiro, remove as associações de categorias
  const deleteCategoriesQuery = `DELETE FROM news_categories WHERE news_id = ?`;

  db.query(deleteCategoriesQuery, [id], (err) => {
    if (err) {
      console.error("Erro ao remover categorias da notícia:", err);
      return res.status(500).json({ error: "Erro ao excluir categorias" });
    }

    // Depois, exclui a notícia
    const deleteNewsQuery = `DELETE FROM news WHERE id = ?`;

    db.query(deleteNewsQuery, [id], (err, result) => {
      if (err) {
        console.error("Erro ao excluir notícia:", err);
        return res.status(500).json({ error: "Erro ao excluir notícia" });
      }

      res.json({ message: "Notícia excluída com sucesso!" });
    });
  });
};

// Exportando as funções
module.exports = { getAllNews, addNews, updateNews, deleteNews, getNewsById };
