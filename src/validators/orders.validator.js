const Joi = require("joi");

exports.createOrderSchema = Joi.object({
  product_id: Joi.number().integer().positive().required(),
  qty: Joi.number().integer().positive().required(),
  address: Joi.string().min(5).max(255).required(),
  phone: Joi.string().min(6).max(30).required(),
});

exports.updateStatusSchema = Joi.object({
  status: Joi.string().valid("pending", "confirmed", "shipped", "delivered", "cancelled").required(),
});