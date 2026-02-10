module.exports = (...roles) => (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ ok: false, error: "Unauthorized" });
  }

  // roles يمكن تكون ["admin","fournisseur"] أو "admin"
  const allowed = Array.isArray(roles[0]) ? roles[0] : roles;

  if (!allowed.includes(req.user.role)) {
    return res.status(403).json({ ok: false, error: "Forbidden" });
  }

  next();
};
