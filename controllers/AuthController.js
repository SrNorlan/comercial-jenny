const AuthService = require('../services/AuthService');

const AuthController = 
{
  showLogin(req, res) 
  { res.render('login');},

  async login(req, res) 
  {
    const { user, pass } = req.body;

    if (!user || !pass) 
    {
      return res.render('login', 
      {
        alert: true,
        alertTitle: '¡Faltan Datos!',
        alertMessage: 'Por favor Ingrese un usuario y contraseña',
        alertIcon: 'warning',
        showConfirmButton: true,
        timer: false,
        ruta: 'login'
      });
    }

    try 
    {
      const result = await AuthService.login(user, pass);

      if (!result.success) 
      {
        return res.render('login', 
        {
          alert: true,
          alertTitle: 'Compruebe los Datos',
          alertMessage: result.message,
          alertIcon: 'error',
          showConfirmButton: true,
          timer: false,
          ruta: 'login'
        });
      }

      res.cookie('jwt', result.token, result.cookieOptions);
      return res.redirect('/inicio');
    } catch (error) 
    { 
      console.error('Error en login: ', error);
      res.redirect('/login');
    }
  },

  logout(req, res) 
  {
    res.clearCookie('jwt');
    res.redirect('/login');
  },

  async showRegister(req, res)
  {
    const username = req.cookies.username;
    const cedula = req.cookies.cedula;

    res.clearCookie('username');
    res.clearCookie('cedula');

    try 
    {
      const colaboradores = await AuthService.obtenerColaboradorPorCedula(cedula);
      res.render('register', 
      {
        Colaboradores: colaboradores,
        username: username,
        Tipo: colaboradores[0]?.Tipo_Persona || 'Desconocido'
      });
    } 
    catch (error) 
    {
      console.error('Error al mostrar formulario de registro:', error);
      res.redirect('/login');
    }
  },

  async registerUser(req, res) 
  {
    try 
    {
      await AuthService.registrarUsuario(req.body);
      res.cookie('registerMessage', 'Se ha registrado el usuario del Colaborador Correctamente', { httpOnly: true });
      res.redirect('/inicio');
    } 
    catch (error) 
    {
      console.error('Error al registrar usuario:', error);
      res.redirect('/register');
    }
  }
};

module.exports = AuthController;
