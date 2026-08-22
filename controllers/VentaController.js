const VentaService = require('../services/VentaService');

const VentaController = {
  async getVentas(req, res) {
    try {
      const tipoVenta = req.query.tipoVenta;

      const [ventas, productos, clientes, vendedores] = await VentaService.getDatosVista();

      const errorMessage = req.cookies.errorMessage;
      res.clearCookie('errorMessage');

      res.render('ventas', {
        ventas,
        productos,
        Tipo: tipoVenta,
        clientes,
        vendedores,
        Mensaje: errorMessage,
        UserRol: req.user.Rol
      });
    } catch (error) {
      console.error('Error al obtener datos para vista de ventas:', error);
    }
  },

  async buscarCliente(req, res) {
    const cedula = req.query.cedula;
    try {
      const cliente = await VentaService.buscarPersonaPorCedula(cedula, 'Cliente');
      res.json({ nombreCliente: cliente });
    } catch {
      res.json({ nombreCliente: 'No se encontro al Cliente' });
    }
  },

  async buscarVendedor(req, res) {
    const cedula = req.query.cedula;
    try {
      const vendedor = await VentaService.buscarPersonaPorCedula(cedula, 'Vendedor');
      res.json({ nombreVendedor: vendedor });
    } catch {
      res.json({ nombreVendedor: 'No se encontro al Vendedor' });
    }
  },

  async getDetalleVenta(req, res) {
    const id = req.query.id;
    try {
      const detalles = await VentaService.getDetalleVenta(id);
      res.json({ DetallesVenta: detalles });
    } catch (error) {
      console.error('Error al obtener detalles de venta:', error);
      res.status(500).json({ error: 'Error al buscar detalles' });
    }
  },

  async addVenta(req, res) {
    try {
      await VentaService.insertarVenta(req.body);
      res.status(200).json({ success: true, message: 'Venta agregada correctamente' });
    } catch (error) {
      console.error('Error al agregar venta:', error);
      res.status(500).json({ success: false, message: 'Hubo un error al agregar la Venta' });
    }
  }
};

module.exports = VentaController;
