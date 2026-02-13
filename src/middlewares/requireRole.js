module.exports = (roles) => (req, res, next) => {
  if (!req.user) return res.status(401).json({ ok: false, error: "Unauthorized" });

  const allowed = Array.isArray(roles) ? roles : [roles];
  if (!allowed.includes(req.user.role)) {
    return res.status(403).json({ ok: false, error: "Forbidden" });
  }
  next();
};
