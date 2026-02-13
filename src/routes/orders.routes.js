const router = require("express").Router();
const auth = require("../middlewares/auth");
const requireRole = require("../middlewares/requireRole");
const ctrl = require("../controllers/orders.controller");

// Acheteur: create order
router.post("/orders", auth, requireRole(["acheteur"]), ctrl.create);

// Acheteur: my orders
router.get("/orders/my", auth, requireRole(["acheteur"]), ctrl.myOrders);

// Admin/Fournisseur: list all orders
router.get("/orders", auth, requireRole(["admin", "fournisseur"]), ctrl.list);

// Admin: update order status
router.patch("/orders/:id/status", auth, requireRole(["admin"]), ctrl.updateStatus);

module.exports = router;
