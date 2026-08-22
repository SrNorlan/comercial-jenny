const CompraModel = require('../models/CompraModel');

const CompraService = {
  async obtenerVistaCompras() {
    const [compras, productos, proveedores, gerentes] = await Promise.all([
      CompraModel.getCompras(),
      CompraModel.getProductos(),
      CompraModel.getProveedores(),
      CompraModel.getGerentes()
    ]);

    const comprasFormateadas = compras.map(compra => ({
      ...compra,
      Fecha_Compra: new Date(compra.Fecha_Compra).toLocaleDateString('es-ES', {
        day: '2-digit', month: 'long', year: 'numeric'
      })
    }));

    return [comprasFormateadas, productos, proveedores, gerentes];
  },

  async insertarCompra(data) {
    await CompraModel.insertCompra(data);
    for (const producto of data.Productos) {
      await CompraModel.insertDetalleCompra(data.Id_Compra, producto);
    }
  },

  async buscarPersonaPorCedula(cedula, tipo) {
    return await CompraModel.getPersonaByCedula(cedula, tipo);
  },

  async obtenerDetalleCompra(id) {
    return await CompraModel.getDetalleCompra(id);
  },

  async obtenerInfoCompra(id) {
    return await CompraModel.getInfoCompra(id);
  }
};

module.exports = CompraService;
