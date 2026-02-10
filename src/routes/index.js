const router = require("express").Router();

router.use(require("./health.routes"));
router.use(require("./db.routes"));
router.use(require("./auth.routes"));
router.use(require("./admin.routes"));
router.use(require("./products.routes"));

const auth = require("../middlewares/auth");

// ✅ /api/me
router.get("/me", auth, (req, res) => {
  res.json({ ok: true, user: req.user });
});

module.exports = router;
