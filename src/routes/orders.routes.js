const router = require("express").Router();
const auth = require("../middlewares/auth");
const requireRole = require("../middlewares/requireRole");
const validate = require("../middlewares/validate");

const ctrl = require("../controllers/orders.controller");
const { createOrderSchema, updateStatusSchema } = require("../validators/orders.validator");

// Acheteur: create order (with validation)
router.post(
  "/orders",
  auth,
  requireRole(["acheteur"]),
  validate(createOrderSchema),
  ctrl.create
);

// Acheteur: my orders
router.get("/orders/my", auth, requireRole(["acheteur"]), ctrl.myOrders);

// List orders (admin / fournisseur / acheteur with rules)
router.get("/orders", auth, requireRole(["admin", "fournisseur", "acheteur"]), ctrl.list);

// Admin: update order status (with validation)
router.patch(
  "/orders/:id/status",
  auth,
  requireRole(["admin"]),
  validate(updateStatusSchema),
  ctrl.updateStatus
);

// Order details (admin / fournisseur / acheteur with rules)
router.get("/orders/:id", auth, requireRole(["admin", "fournisseur", "acheteur"]), ctrl.show);

module.exports = router;