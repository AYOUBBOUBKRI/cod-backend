const router = require("express").Router();

router.use(require("./health.routes"));
router.use(require("./db.routes"));
router.use(require("./auth.routes"));
router.use(require("./admin.routes"));

module.exports = router;
