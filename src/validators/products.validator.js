const Joi = require("joi");

exports.createProductSchema = Joi.object({
  name: Joi.string().min(2).max(180).required(),
  description: Joi.string().allow("", null).max(2000),
  price: Joi.number().positive().required(),
  stock: Joi.number().integer().min(0).required(),
  status: Joi.string().valid("draft", "active", "inactive").default("draft"),
});

exports.updateProductSchema = Joi.object({
  name: Joi.string().min(2).max(180),
  description: Joi.string().allow("", null).max(2000),
  price: Joi.number().positive(),
  stock: Joi.number().integer().min(0),
  status: Joi.string().valid("draft", "active", "inactive"),
}).min(1); // لازم يجي شي field واحد على الأقل