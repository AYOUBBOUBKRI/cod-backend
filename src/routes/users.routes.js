const router = require("express").Router();
const auth = require("../middlewares/auth");
const requireRole = require("../middlewares/requireRole");
const ctrl = require("../controllers/users.controller");

// Admin: list pending users
router.get("/users/pending", auth, requireRole(["admin"]), ctrl.pending);

// Admin: approve user
router.patch("/users/:id/approve", auth, requireRole(["admin"]), ctrl.approve);

module.exports = router;