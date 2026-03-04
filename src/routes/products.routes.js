const router = require("express").Router();
const auth = require("../middlewares/auth");
const requireRole = require("../middlewares/requireRole");
const validate = require("../middlewares/validate");

const ctrl = require("../controllers/products.controller");
const { createProductSchema, updateProductSchema } = require("../validators/products.validator");

// Public listing
router.get("/products", ctrl.list);

// ✅ خاصها تكون قبل /products/:id
router.get("/products/mine", auth, requireRole(["admin", "fournisseur"]), ctrl.mine);

// Product by id (public)
router.get("/products/:id", ctrl.getById);

// Supplier/Admin CRUD + validation
router.post(
  "/products",
  auth,
  requireRole(["admin", "fournisseur"]),
  validate(createProductSchema),
  ctrl.create
);

router.put(
  "/products/:id",
  auth,
  requireRole(["admin", "fournisseur"]),
  validate(updateProductSchema),
  ctrl.update
);

router.delete(
  "/products/:id",
  auth,
  requireRole(["admin", "fournisseur"]),
  ctrl.remove
);

module.exports = router;