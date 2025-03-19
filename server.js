const express = require("express");
const db = require("./database/db");
const path = require("path");
const bodyParser = require("body-parser");
const cors = require("cors");
const newsRoutes = require("./routes/newsRoutes");
const categoryRoutes = require("./routes/categoryRoutes");
const userRoutes = require("./routes/userRoutes");
const { authenticate, isAdmin } = require("./middlewares/authMiddleware");

const app = express();
const PORT = 3000;

require("./initAdmin");
app.use(bodyParser.json());
app.use(cors());

app.use("/api/v1/auth", userRoutes);
app.use("/news", newsRoutes);
app.use("/categories", categoryRoutes);

app.use(express.static(path.join(__dirname, "public")));
app.get("*", (req, res, next) => {
  let filePath = path.join(__dirname, "public", req.path + ".html");

  res.sendFile(filePath, (err) => {
    if (err) {
      next();
    }
  });
});

app.get("/admpainel", authenticate, isAdmin, (req, res) => {
  res.sendFile(path.join(__dirname, "public", "admpainel", "index.html"));
  res.json({ message: "Bem-vindo ao painel admin!" });
});
app.get("/login", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "admpainel", "login.html"));
});
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});
app.get("/versao", (req, res) => {
  db.query("SELECT VERSION()", (err, results) => {
    if (err) {
      console.error("Erro ao obter versão: " + err.stack);
      return res
        .status(500)
        .json({ error: "Erro ao obter versão do banco de dados" });
    }
    res.json({ versao: results[0]["VERSION()"] });
  });
});

app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
