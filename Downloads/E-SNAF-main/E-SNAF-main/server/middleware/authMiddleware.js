function requireUser(req, res, next) {
  if (!req.session.user) {
    return res.status(401).json({ mesaj: "Giriş yapmanız gerekiyor" });
  }
  next();
}

function requireAdmin(req, res, next) {
  if (!req.session.admin) {
    return res.status(401).json({ mesaj: "Admin girişi gerekiyor" });
  }
  next();
}

module.exports = { requireUser, requireAdmin };