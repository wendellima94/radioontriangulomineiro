const mysql = require("mysql2");

// Configurações de conexão com o banco de dados
const dbConfig = {
  host: "127.0.0.1",       // Endereço do servidor
  user: "root",            // Usuário do banco
  password: "",            // Senha do banco (deixe vazio se não houver senha)
  database: "radioon", // Substitua pelo nome do seu banco de dados
  charset: "utf8mb4",       // Charset
};

// Criando o pool de conexões (melhor prática)
const pool = mysql.createPool(dbConfig);

// Exportando a conexão para ser reutilizada em outras partes do projeto
module.exports = pool;
