const pool = require("../db");

async function findByEmail(email) {
  const [rows] = await pool.query(
    "SELECT id, name, email, password_hash, role FROM users WHERE email = ? LIMIT 1",
    [email]
  );
  return rows[0] || null;
}

async function createUser({ name, email, passwordHash, role }) {
  const [result] = await pool.query(
    "INSERT INTO users (name, email, password_hash, role) VALUES (?, ?, ?, ?)",
    [name, email, passwordHash, role]
  );

  return {
    id: result.insertId,
    name,
    email,
    role,
  };
}

module.exports = { findByEmail, createUser };
