const ClienteService = require('../services/ClienteService');

const ClienteController = 
{
  async getClientes(req, res) 
  {
    try 
    {
      const clientes = await ClienteService.obtenerClientes();
      res.render('clientes', 
      {
        clientes,
        usuario: req.user.NombreUsuario,
        UserRol: req.user.Rol
      });
    } catch (error) 
    {  console.error('Error al mostrar clientes:', error); }
  },

  async editCliente(req, res) 
  {
    try 
    {
      const id = req.params.ID;
      const cliente = await ClienteService.obtenerClientePorId(id);
      res.render('editClient', 
      {
        cliente,
        UserRol: req.user.Rol,
        tipo: 'Cliente'
      });
    } 
    catch (error) 
    { console.error('Error al editar cliente:', error); }
  },

  async buscarRecords(req, res) 
  {
    try 
    {
      const id = req.query.id;
      const records = await ClienteService.obtenerRecordCrediticio(id);
      res.json({ Records: records });
    } 
    catch (error) 
    {  console.error('Error al buscar records crediticios:', error); }
  },

  async addCliente(req, res) 
  {
    try 
    {
      await ClienteService.agregarCliente(req.body);

      const clientes = await ClienteService.obtenerClientes();
      res.render('clientes', 
      {
        clientes,
        alert: true,
        alertTitle: 'Cliente agregado',
        alertMessage: '¡Se agregó al cliente correctamente!',
        alertIcon: 'success',
        showConfirmButton: true,
        timer: false,
        ruta: 'clientes',
        UserRol: req.user.Rol
      });
    } 
    catch (error) 
    {
      console.error('Error al agregar cliente:', error);
      const clientes = await ClienteService.obtenerClientes();
      res.render('clientes', 
      {
        clientes,
        alert: true,
        alertTitle: 'No se pudo completar la operación',
        alertMessage: 'No se pudo agregar al cliente, compruebe los datos e intente nuevamente',
        alertIcon: 'error',
        showConfirmButton: true,
        timer: false,
        ruta: 'clientes',
        UserRol: req.user.Rol
      });
    }
  },

  async updateCliente(req, res) 
  {
    const tipo = req.body.tipo_edit;
    const ruta = tipo === 'Proveedor' ? 'proveedores' : 'clientes';
    const comercio = tipo === 'Proveedor' ? req.body.Comercio_pv : null;

    try 
    {
      await ClienteService.actualizarCliente(req.body, tipo, comercio);
      const clientes = await ClienteService.obtenerClientes();
      res.render('clientes', 
      {
        clientes,
        alert: true,
        alertTitle: `${tipo} editado`,
        alertMessage: `¡Se editó al ${tipo} correctamente!`,
        alertIcon: 'success',
        showConfirmButton: true,
        timer: false,
        ruta,
        UserRol: req.user.Rol
      });
    } 
    catch (error) 
    {
      console.error(`Error al editar ${tipo}:`, error);
      const clientes = await ClienteService.obtenerClientes();
      res.render('clientes', 
      {
        clientes,
        alert: true,
        alertTitle: 'No se pudo completar la operación',
        alertMessage: `No se pudo editar al ${tipo}, compruebe los datos e intente nuevamente`,
        alertIcon: 'error',
        showConfirmButton: true,
        timer: false,
        ruta,
        UserRol: req.user.Rol
      });
    }
  }

};

module.exports = ClienteController;
