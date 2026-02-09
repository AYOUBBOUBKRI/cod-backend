const router = require("express").Router();
const pool = require("../db");

// Health check
router.get("/health", (req, res) => {
  res.json({ ok: true, message: "API routes OK ✅" });
});

// Test DB
router.get("/test-db", async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT 1 + 1 AS result");
    res.json({ ok: true, db: "connected", result: rows[0].result });
  } catch (err) {
    res.status(500).json({ ok: false, error: err.message });
  }
});

module.exports = router;

