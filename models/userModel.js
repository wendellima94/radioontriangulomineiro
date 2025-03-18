const pool = require("../database/db");
const bcrypt = require("bcrypt");

const createUser = async (name, email, password, role) => {
  const hashedPassword = await bcrypt.hash(password, 10);
  return new Promise((resolve, reject) => {
    pool.query(
      "INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)",
      [name, email, hashedPassword, role],
      (err, result) => {
        if (err) reject(err);
        else resolve(result.insertId);
      }
    );
  });
};

const getUserByEmail = async (email) => {
  const [rows] = await pool
    .promise()
    .query("SELECT * FROM users WHERE email = ?", [email]);
  return rows[0]; // Retorna o primeiro usuário encontrado
};

module.exports = { createUser, getUserByEmail };
