// src/middlewares/auth.middleware.js
const jwt = require('jsonwebtoken');
const { promisify } = require('util');
const conexion = process.env.NODE_ENV === 'test' ? require('../config/db') : require('../server/src/config/db');

const authMiddleware = {
  isAuthenticated: async (req, res, next) => {
    const token = req.cookies.jwt;
    if (!token) return res.redirect('/login');

    try {
      const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRETO);

      const { rows } = await conexion.query(
        `SELECT u.usuario, concat(p.nombre, ' ', p.apellido) AS nombre, u.id_persona, u.rol
         FROM usuarios u JOIN persona p ON p.id_persona = u.id_persona WHERE u.id_persona = $1`,
        [decoded.Id]
      );
      if (!rows.length) return res.redirect('/login');
      const usuario = rows[0];
      req.user = { Usuario: usuario.usuario, NombreUsuario: usuario.nombre, Id_Persona: usuario.id_persona, Rol: usuario.rol };
      return next();
    } catch (error) {
      console.log('Error al verificar token JWT:', error);
      res.redirect('/login');
    }
  },

  isGerente: (req, res, next) => {
    if (req.user?.Rol === 'Gerente') {
      return next();
    }

    res.cookie('errorMessage', 'Solo los gerentes pueden acceder a esta ruta', { httpOnly: true });
    res.redirect('/inicio');
  }
};

module.exports = authMiddleware;
