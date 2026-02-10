const router = require("express").Router();

router.use(require("./health.routes"));
router.use(require("./db.routes"));

module.exports = router;
