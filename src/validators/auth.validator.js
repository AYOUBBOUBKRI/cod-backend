const Joi = require("joi");

exports.registerSchema = Joi.object({
  name: Joi.string().min(2).max(120).required(),
  email: Joi.string().email().max(190).required(),
  password: Joi.string().min(6).max(100).required(),
  role: Joi.string().valid("acheteur", "fournisseur").required(),
});

exports.loginSchema = Joi.object({
  email: Joi.string().email().max(190).required(),
  password: Joi.string().min(6).max(100).required(),
});