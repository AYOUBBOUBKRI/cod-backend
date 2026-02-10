const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { findByEmail, createUser } = require("../services/user.service");

function signToken(user) {
  return jwt.sign(
    { id: user.id, role: user.role, email: user.email },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || "7d" }
  );
}

async function register(req, res) {
  try {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ ok: false, error: "name, email, password are required" });
    }

    const exists = await findByEmail(email);
    if (exists) {
      return res.status(409).json({ ok: false, error: "Email already exists" });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const user = await createUser({
      name,
      email,
      passwordHash,
      role: role || "acheteur",
    });

    const token = signToken(user);
    res.status(201).json({ ok: true, user, token });
  } catch (err) {
    res.status(500).json({ ok: false, error: err.message });
  }
}

async function login(req, res) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ ok: false, error: "email, password are required" });
    }

    const userRow = await findByEmail(email);
    if (!userRow) {
      return res.status(401).json({ ok: false, error: "Invalid credentials" });
    }

    const okPass = await bcrypt.compare(password, userRow.password_hash);
    if (!okPass) {
      return res.status(401).json({ ok: false, error: "Invalid credentials" });
    }

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
}

module.exports = { register, login };
