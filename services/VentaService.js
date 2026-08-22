const VentaModel = require('../models/VentaModel');

const VentaService = {
  async getDatosVista() {
    const [ventas, productos, clientes, vendedores] = await Promise.all([
      VentaModel.getVentas(),
      VentaModel.getProductos(),
      VentaModel.getClientes(),
      VentaModel.getVendedores()
    ]);

    const ventasFormateadas = ventas.map(venta => ({
      ...venta,
      Fecha_Venta: new Date(venta.Fecha_Venta).toLocaleDateString('es-ES', {
        day: '2-digit', month: 'long', year: 'numeric'
      })
    }));

    return [ventasFormateadas, productos, clientes, vendedores];
  },

  async buscarPersonaPorCedula(cedula, tipo) {
    const persona = await VentaModel.getPersonaByCedula(cedula, tipo);
    if (persona) return `${persona.Nombre} ${persona.Apellido}`;
    throw new Error('No encontrado');
  },

  async getDetalleVenta(id) {
    return await VentaModel.getDetalleVenta(id);
  },

  async insertarVenta(data) {
    await VentaModel.insertVenta(data);
    for (const producto of data.Productos) {
      await VentaModel.insertDetalleVenta(data.Id_Venta, producto);
    }
  }
};

module.exports = VentaService;
