const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../../config/db');
const env = require('../../config/env');

async function login(usuario, contrasena) {
  const { rows } = await db.query(
    'SELECT userid, usuario, contrasena, rol, id_persona FROM usuarios WHERE usuario = $1',
    [usuario]
  );
  if (!rows.length || !(await bcrypt.compare(contrasena, rows[0].contrasena))) {
    const error = new Error('Credenciales inválidas.');
    error.statusCode = 401;
    throw error;
  }
  const user = rows[0];
  const token = jwt.sign({ userId: user.userid, role: user.rol }, env.JWT_SECRET, { expiresIn: env.JWT_EXPIRES_IN });
  return { token, user: { id: user.userid, usuario: user.usuario, rol: user.rol, idPersona: user.id_persona } };
}

module.exports = { login };