const router = require("express").Router();
const auth = require("../middlewares/auth");
const requireRole = require("../middlewares/requireRole");
const ctrl = require("../controllers/products.controller");

// Public listing
router.get("/products", ctrl.list);

// ✅ خاصها تكون قبل /products/:id
router.get("/products/mine", auth, requireRole(["admin", "fournisseur"]), ctrl.mine);

// Product by id
router.get("/products/:id", ctrl.getById);

// Supplier/Admin
router.post("/products", auth, requireRole(["admin", "fournisseur"]), ctrl.create);
router.put("/products/:id", auth, requireRole(["admin", "fournisseur"]), ctrl.update);
router.delete("/products/:id", auth, requireRole(["admin", "fournisseur"]), ctrl.remove);

module.exports = router;