const conexion = require('../config/db');

const VentaModel = {
  async getVentas() {
    const [rows] = await conexion.promise().query('SELECT * FROM mostrarventas');
    return rows;
  },

  async getProductos() {
    const [rows] = await conexion.promise().query('SELECT * FROM Productos');
    return rows;
  },

  async getClientes() {
    const [rows] = await conexion.promise().query('SELECT * FROM mostrarclientes');
    return rows;
  },

  async getVendedores() {
    const [rows] = await conexion.promise().query('SELECT * FROM mostrarvendedores');
    return rows;
  },

  async getPersonaByCedula(cedula, tipo) {
    const [rows] = await conexion.promise().query(
      "SELECT * FROM persona WHERE Tipo_Persona = ? AND Cedula = ?",
      [tipo, cedula]
    );
    return rows[0];
  },

  async getDetalleVenta(id) {
    const [rows] = await conexion.promise().query(
      'SELECT * FROM mostrardetalleventa WHERE Id_Venta = ?', [id]
    );
    return rows;
  },

  async insertVenta(data) {
    const {
      Id_Venta,
      Tipo_Venta,
      Cliente,
      Vendedor,
      Fecha_Venta,
      Total,
      Plazo,
      Frecuencia_Abonos
    } = data;

    await conexion.promise().query(
      'CALL InsertarVenta(?,?,?,?,?,?,?,?)',
      [Id_Venta, Tipo_Venta, Cliente, Vendedor, Fecha_Venta, Total, Plazo, Frecuencia_Abonos]
    );
  },

  async insertDetalleVenta(idVenta, producto) {
    const { IdProducto, Cantidad, Precio } = producto;
    await conexion.promise().query(
      'CALL InsertarDetallesVenta(?,?,?,?)',
      [idVenta, IdProducto, Cantidad, Precio]
    );
  }
};

module.exports = VentaModel;
