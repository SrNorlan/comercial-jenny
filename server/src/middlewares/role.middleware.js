function requireRole(...roles) {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.rol)) return res.status(403).json({ success: false, message: 'Permisos insuficientes.' });
    return next();
  };
}

module.exports = { requireRole };