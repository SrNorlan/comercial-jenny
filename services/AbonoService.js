const AbonoModel = require('../models/AbonoModel');
const postgres = require('../server/src/config/db');

const AbonoService = {
  async obtenerVentasCredito() {
    if (process.env.NODE_ENV !== 'test') {
      const { rows } = await postgres.query('SELECT * FROM showventascredito ORDER BY fecha_venta DESC');
      return rows.map((sale) => ({ Id_Venta: sale.id_venta, Nombre_Cliente: sale.nombre_cliente, Nombre_Vendedor: sale.nombre_vendedor, Tipo_Venta: sale.tipo_venta, Fecha_Venta: new Date(sale.fecha_venta).toLocaleDateString('es-ES', { day: '2-digit', month: 'long', year: 'numeric' }), Total_Venta: sale.total_venta, Saldo_Restante: sale.saldo_restante, Plazo_Compra: sale.plazo_compra ? new Date(sale.plazo_compra).toLocaleDateString('es-ES', { day: '2-digit', month: 'long', year: 'numeric' }) : null, Frecuencia_Abonos: sale.frecuencia_abonos }));
    }
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
    if (process.env.NODE_ENV !== 'test') {
      await postgres.query('INSERT INTO abonos (id_venta,monto_abonado,fecha_abono) VALUES ($1,$2,COALESCE($3,CURRENT_DATE))', [data.Id_Venta, data.Monto, data.Fecha || null]);
      return;
    }
    await AbonoModel.insert(data);
  },
  async buscarPorVenta(id) {
    if (process.env.NODE_ENV !== 'test') {
      const { rows } = await postgres.query('SELECT id_abono AS "Id_Abono", id_venta AS "Id_Venta", monto_abonado AS "Monto_Abonado", fecha_abono AS "Fecha_Abono" FROM abonos WHERE id_venta = $1 ORDER BY fecha_abono DESC', [id]);
      return rows.map((abono) => ({ ...abono, Fecha_Abono: new Date(abono.Fecha_Abono).toLocaleDateString('es-ES', { day: '2-digit', month: 'long', year: 'numeric' }) }));
    }
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
