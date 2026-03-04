const router = require("express").Router();
const validate = require("../middlewares/validate");
const { registerSchema, loginSchema } = require("../validators/auth.validator");
const ctrl = require("../controllers/auth.controller");

router.post("/auth/register", validate(registerSchema), ctrl.register);
router.post("/auth/login", validate(loginSchema), ctrl.login);

module.exports = router;