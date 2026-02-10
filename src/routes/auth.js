const router = require("express").Router();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const pool = require("../db"); // تأكد شنو كتصدّر ف src/db/index.js

function signToken(user) {
  return jwt.sign(
    { id: user.id, role: user.role, email: user.email },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || "7d" }
  );
}

// POST /api/auth/register
router.post("/register", async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ ok: false, error: "Missing fields" });
    }

    const [exists] = await pool.query("SELECT id FROM users WHERE email = ?", [
      email,
    ]);
    if (exists.length) {
      return res.status(409).json({ ok: false, error: "Email already used" });
    }

    const password_hash = await bcrypt.hash(password, 10);
    const userRole = role || "acheteur";

    const [result] = await pool.query(
      "INSERT INTO users (name, email, password_hash, role) VALUES (?, ?, ?, ?)",
      [name, email, password_hash, userRole]
    );

    const user = { id: result.insertId, name, email, role: userRole };
    const token = signToken(user);

    res.status(201).json({ ok: true, user, token });
  } catch (err) {
    res.status(500).json({ ok: false, error: err.message });
  }
});

// POST /api/auth/login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password)
      return res.status(400).json({ ok: false, error: "Missing fields" });

    const [rows] = await pool.query(
      "SELECT id, name, email, role, password_hash FROM users WHERE email = ?",
      [email]
    );
    if (!rows.length)
      return res.status(401).json({ ok: false, error: "Invalid credentials" });

    const userRow = rows[0];
    const match = await bcrypt.compare(password, userRow.password_hash);
    if (!match)
      return res.status(401).json({ ok: false, error: "Invalid credentials" });

    const user = {
      id: userRow.id,
      name: userRow.name,
      email: userRow.email,
      role: userRow.role,
    };
    const token = signToken(user);

    res.json({ ok: true, user, token });
  } catch (err) {
    res.status(500).json({ ok: false, error: err.message });
  }
});

module.exports = router;
