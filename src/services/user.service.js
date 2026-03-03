const pool = require("../db");

exports.findByEmail = async (email) => {
  const [rows] = await pool.query("SELECT * FROM users WHERE email = ? LIMIT 1", [email]);
  return rows[0] || null;
};

exports.createUser = async ({ name, email, passwordHash, role, isApproved }) => {
  const [r] = await pool.query(
    "INSERT INTO users (name, email, password_hash, role, is_approved) VALUES (?, ?, ?, ?, ?)",
    [name, email, passwordHash, role, isApproved]
  );

  // رجّع user بنفس الشكل
  return {
    id: r.insertId,
    name,
    email,
    role,
    is_approved: isApproved,
  };
};

exports.listPending = async () => {
  const [rows] = await pool.query(
    "SELECT id, name, email, role, is_approved, created_at FROM users WHERE is_approved = 0 ORDER BY id DESC"
  );
  return rows;
};

exports.approveUser = async ({ userId, adminId }) => {
  const [r] = await pool.query(
    "UPDATE users SET is_approved = 1, approved_at = CURRENT_TIMESTAMP, approved_by = ? WHERE id = ?",
    [adminId, userId]
  );

  if (r.affectedRows === 0) return null;

  const [rows] = await pool.query(
    "SELECT id, name, email, role, is_approved, approved_at, approved_by FROM users WHERE id = ?",
    [userId]
  );
  return rows[0];
};




