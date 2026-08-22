const ProveedorService = require('../services/ProveedorService');

const ProveedorController = {
  async getProveedores(req, res) {
    try {
      const proveedores = await ProveedorService.obtenerTodos();
      const errorMessage = req.cookies.errorMessage;
      res.clearCookie('errorMessage');

      res.render('Proveedores', {
        proveedores,
        Mensaje: errorMessage,
        UserRol: req.user.Rol
      });
    } catch (error) {
      console.error('Error al mostrar proveedores:', error);
    }
  },

  async editProveedor(req, res) {
    try {
      const id = req.params.ID;
      const proveedor = await ProveedorService.obtenerPorId(id);
      res.render('editClient', {
        cliente: proveedor,
        UserRol: req.user.Rol,
        tipo: 'Proveedor'
      });
    } catch (error) {
      console.error('Error al editar proveedor:', error);
    }
  },

  async addProveedor(req, res) {
    try {
      await ProveedorService.insertar(req.body);
      const lista = await ProveedorService.obtenerTodos();

      res.render('Proveedores', {
        proveedores: lista,
        alert: true,
        alertTitle: 'Proveedor agregado',
        alertMessage: '¡Se agregó al proveedor correctamente!',
        alertIcon: 'success',
        showConfirmButton: true,
        timer: false,
        ruta: 'Proveedores',
        UserRol: req.user.Rol
      });
    } catch (error) {
      console.error('Error al agregar proveedor:', error);
      const lista = await ProveedorService.obtenerTodos();

      res.render('Proveedores', {
        proveedores: lista,
        alert: true,
        alertTitle: 'No se pudo completar la operación',
        alertMessage: 'No se pudo agregar al proveedor, compruebe los datos e intente nuevamente',
        alertIcon: 'error',
        showConfirmButton: true,
        timer: false,
        ruta: 'Proveedores',
        UserRol: req.user.Rol
      });
    }
  }
};

module.exports = ProveedorController;
