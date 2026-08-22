const AbonoModel = require('../models/AbonoModel');

const AbonoService = {
  async obtenerVentasCredito() {
    const ventas = await AbonoModel.getVentasCredito();
    return ventas.map(venta => {
      const opciones = { day: '2-digit', month: 'long', year: 'numeric' };
      return {
        ...venta,
        Fecha_Venta: new Date(venta.Fecha_Venta).toLocaleDateString('es-ES', opciones),
        Plazo_Compra: new Date(venta.Plazo_Compra).toLocaleDateString('es-ES', opciones)
      };
    });
  },

  async agregar(data) {
    await AbonoModel.insert(data);
  },
  async buscarPorVenta(id) {
    const abonos = await AbonoModel.findByVenta(id);
    
    return abonos.map(abono => {
      const fecha = new Date(abono.Fecha_Abono);
      return {
        ...abono,
        Fecha_Abono: fecha.toLocaleDateString('es-ES', {
          day: '2-digit',
          month: 'long',
          year: 'numeric'
        })
      };
    });
  }
  
};

module.exports = AbonoService;
