const router = require("express").Router();

router.get("/health", (req, res) => {
  res.json({ ok: true, message: "API OK ✅" });
});

module.exports = router;
