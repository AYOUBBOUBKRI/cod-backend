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

    // ✅ security: ممنوع أي واحد يسجل admin من API
    if (role === "admin") {
      return res.status(403).json({ ok: false, error: "Cannot register as admin" });
    }

    // role المسموحين فـ register
    const safeRole = role === "fournisseur" ? "fournisseur" : "acheteur";

    const exists = await findByEmail(email);
    if (exists) {
      return res.status(409).json({ ok: false, error: "Email already exists" });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    // ✅ acheteur/fournisseur = pending by default
    const isApproved = 0;

    const user = await createUser({
      name,
      email,
      passwordHash,
      role: safeRole,
      isApproved,
    });

    // ✅ ما نعطيوش token حتى يدوز approval
    return res.status(201).json({
      ok: true,
      user,
      message: "Account created. Waiting for admin approval.",
    });
  } catch (err) {
    return res.status(500).json({ ok: false, error: err.message });
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

    // ✅ مازال ما approved
    if (Number(userRow.is_approved) !== 1) {
      return res.status(403).json({
        ok: false,
        error: "Account not approved yet",
      });
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
    return res.json({ ok: true, user, token });
  } catch (err) {
    return res.status(500).json({ ok: false, error: err.message });
  }
}

module.exports = { register, login };
