const jwt = require('jsonwebtoken');
const env = require('../config/env');
const db = require('../config/db');

async function verifyAuth(req, res, next) {
  try {
    const header = req.headers.authorization;
    const token =
      req.cookies?.token || (header && header.startsWith('Bearer ') ? header.slice(7) : null);
    if (!token) return res.status(401).json({ success: false, message: 'Token requerido.' });

    const decoded = jwt.verify(token, env.JWT_SECRET);
    const { rows } = await db.query(
      `SELECT u.userid, u.usuario, u.rol, u.id_persona, p.nombre, p.apellido
       FROM usuarios u JOIN persona p ON p.id_persona = u.id_persona WHERE u.userid = $1`,
      [decoded.userId],
    );
    if (!rows.length) return res.status(401).json({ success: false, message: 'Sesión no válida.' });
    req.user = rows[0];
    return next();
  } catch (error) {
    return res.status(401).json({ success: false, message: 'Token inválido o expirado.' });
  }
}

module.exports = { verifyAuth };
