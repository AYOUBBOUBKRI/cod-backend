const router = require("express").Router();
const auth = require("../middlewares/auth");
const requireRole = require("../middlewares/requireRole");
const ctrl = require("../controllers/products.controller");

// Public/Authenticated listing (على حساب شنو بغيتي)
// هنا خليناه public:
router.get("/products", ctrl.list);
router.get("/products/:id", ctrl.getById);

// Supplier/Admin فقط:
router.post("/products", auth, requireRole("admin", "fournisseur"), ctrl.create);
router.put("/products/:id", auth, requireRole("admin", "fournisseur"), ctrl.update);
router.delete("/products/:id", auth, requireRole("admin", "fournisseur"), ctrl.remove);

module.exports = router;
