const HomeService = require('../services/HomeService');

const HomeController = 
{
  async showDashboard(req, res) 
  {
    try 
    {
      const data = await HomeService.cargarEstadisticas(req.user);

      // Manejo de mensajes desde cookies
      const Mensaje = req.cookies.errorMessage;
      const MensajeRespaldo = req.cookies.successMessage;
      const MensajeRegistro = req.cookies.registerMessage;

      res.clearCookie('errorMessage');
      res.clearCookie('successMessage');
      res.clearCookie('registerMessage');

      res.render('inicio', 
    {
        ...data,
        usuario: req.user.NombreUsuario,
        UserRol: req.user.Rol,
        Mensaje,
        MensajeRespaldo,
        MensajeRegistro
      });
    } 
    catch (error) 
    {
      console.log('Hubo un error al mostrar el dashboard => ', error);
      res.redirect('/login');
    }
  },

  backupDatabase(req, res) 
  {
    const { exec } = require('child_process');

    const rutaMysqldump = 'C:/xampp/mysql/bin/mysqldump.exe';
    const comando = `${rutaMysqldump} -u ${process.env.DB_USER} comercial_jenny > ${process.env.RUTA}`;

    exec(comando, (error, stdout, stderr) => {
      if (error || stderr) {
        console.error('Error al respaldar:', error || stderr);
        return res.redirect('/inicio');
      }

      console.log('Respaldo exitoso.');
      res.cookie('successMessage', 'El respaldo de la base de datos ha sido creado exitosamente.', { httpOnly: true });
      res.redirect('/inicio');
    });
  }
};

module.exports = HomeController;
