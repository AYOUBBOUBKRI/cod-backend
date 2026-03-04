module.exports = (err, req, res, next) => {
  console.error("ERROR:", err);

  const status = err.statusCode || 500;
  const message = err.message || "Server error";

  res.status(status).json({ ok: false, error: message });
};