module.exports = (schema) => (req, res, next) => {
  const { error, value } = schema.validate(req.body, {
    abortEarly: false,
    stripUnknown: true,
  });

  if (error) {
    return res.status(422).json({
      ok: false,
      error: error.details.map((d) => d.message).join(", "),
    });
  }

  req.body = value;
  next();
};