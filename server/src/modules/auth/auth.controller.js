const authService = require('./auth.service');

async function login(req, res, next) {
  try {
    const { usuario, contrasena } = req.body;
    if (!usuario || !contrasena)
      return res
        .status(400)
        .json({ success: false, message: 'Usuario y contraseña son requeridos.' });
    const result = await authService.login(usuario, contrasena);
    res.cookie('token', result.token, {
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      maxAge: 8 * 60 * 60 * 1000,
    });
    return res.json({ success: true, data: result.user });
  } catch (error) {
    return next(error);
  }
}

function logout(req, res) {
  res.clearCookie('token');
  res.json({ success: true, message: 'Sesión cerrada.' });
}

function me(req, res) {
  res.json({ success: true, data: req.user });
}

module.exports = { login, logout, me };
