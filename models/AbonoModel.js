const conexion = require('../config/db');

const AbonoModel = {
  async getVentasCredito() {
    const [rows] = await conexion.promise().query('SELECT * FROM showventascredito');
    return rows;
  },

  async insert({ Id_Venta, Monto, Fecha }) {
    await conexion.promise().query(
      'INSERT INTO abonos (Id_Venta, Monto_Abonado, Fecha_Abono) VALUES (?, ?, ?)',
      [Id_Venta, Monto, Fecha]
    );
  },
  async findByVenta(id) {
    const [rows] = await conexion.promise().query(
      'SELECT * FROM historial_abonos WHERE Id_Venta = ?', [id]
    );
    return rows;
  }
  
};

module.exports = AbonoModel;
