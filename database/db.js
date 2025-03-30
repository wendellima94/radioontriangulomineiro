const mysql = require("mysql2");

const dbConfig = {
  host: "127.0.0.1",
  user: "root",
  password: "",
  database: "radioon",
  charset: "utf8mb4",
};

const pool = mysql.createPool(dbConfig);

module.exports = pool;
