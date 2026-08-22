const ColaboradorService = require('../services/ColaboradorService');

const ColaboradorController = 
{
  async getColaboradores(req, res) 
  {
    try 
    {
      const colaboradores = await ColaboradorService.obtenerTodos();
      const errorMessage = req.cookies.errorMessage;
      res.clearCookie('errorMessage');

      res.render('vendedores', 
      {
        vendedores: colaboradores,
        Mensaje: errorMessage,
        UserRol: req.user.Rol
      });
    } catch (error) 
    {  console.error('Error al mostrar colaboradores:', error); }
  },

  async editColaborador(req, res) 
  {
    try 
    {
      const id = req.params.ID;
      const colaborador = await ColaboradorService.obtenerPorId(id);
      res.clearCookie('errorMessage');

      res.render('editvendedor', 
      {
        vendedor: colaborador,
        UserRol: req.user.Rol
      });
    } catch (error) 
    {  console.error('Error al editar colaborador:', error);}
  },

  async addColaborador(req, res) 
  {

    try 
    {
      const { cedula, usuario } = await ColaboradorService.agregar(req.body);

      const lista = await ColaboradorService.obtenerTodos();

      res.cookie('username', usuario, { httpOnly: true });
      res.cookie('cedula', cedula, { httpOnly: true });

      res.render('vendedores', 
      {
        vendedores: lista,
        alert: true,
        alertTitle: 'Colaborador agregado',
        alertMessage: '¡Se agregó al colaborador correctamente!',
        alertIcon: 'success',
        showConfirmButton: true,
        timer: false,
        ruta: 'register',
        UserRol: req.user.Rol
      });
    } 
    catch (error) 
    {
      console.error('Error al agregar colaborador:', error);
      const lista = await ColaboradorService.obtenerTodos();

      res.render('vendedores', 
      {
        vendedores: lista,
        alert: true,
        alertTitle: 'No se pudo completar la operación',
        alertMessage: 'No se pudo agregar al colaborador, compruebe los datos e intente nuevamente',
        alertIcon: 'error',
        showConfirmButton: true,
        timer: false,
        ruta: 'colaboradores',
        UserRol: req.user.Rol
      });
    }

  },

  async updateColaborador(req, res) 
  {
    try 
    {
      await ColaboradorService.actualizar(req.body);
      const lista = await ColaboradorService.obtenerTodos();

      res.render('vendedores', 
      {
        vendedores: lista,
        alert: true,
        alertTitle: 'Colaborador editado',
        alertMessage: '¡Se editó al colaborador correctamente!',
        alertIcon: 'success',
        showConfirmButton: true,
        timer: false,
        ruta: 'colaboradores',
        UserRol: req.user.Rol
      });
    } 
    catch (error) 
    {

      console.error('Error al actualizar colaborador:', error);
      const lista = await ColaboradorService.obtenerTodos();

      res.render('vendedores', 
      {
        vendedores: lista,
        alert: true,
        alertTitle: 'No se pudo completar la operación',
        alertMessage: 'No se pudo editar al colaborador, compruebe los datos e intente nuevamente',
        alertIcon: 'error',
        showConfirmButton: true,
        timer: false,
        ruta: 'colaboradores',
        UserRol: req.user.Rol
      });

    }
  }

};

module.exports = ColaboradorController;
