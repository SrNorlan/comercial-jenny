const conexion = require('../config/db');

const CompraModel = {
  async getCompras() {
    const [rows] = await conexion.promise().query('SELECT * FROM mostrarcompras');
    return rows;
  },

  async getProductos() {
    const [rows] = await conexion.promise().query('SELECT * FROM productos');
    return rows;
  },

  async getProveedores() {
    const [rows] = await conexion.promise().query('SELECT * FROM mostrarproveedores');
    return rows;
  },

  async getGerentes() {
    const [rows] = await conexion.promise().query("SELECT * FROM persona WHERE Tipo_Persona = 'Gerente'");
    return rows;
  },

  async getPersonaByCedula(cedula, tipo) {
    const [rows] = await conexion.promise().query(
      'SELECT * FROM persona WHERE Tipo_Persona = ? AND Cedula = ?',
      [tipo, cedula]
    );
    return rows[0];
  },

  async insertCompra(data) {
    const { Id_Compra, Proveedor, Comprador, Fecha_Compra, Total_compra } = data;
    await conexion.promise().query(
      'CALL InsertarCompra(?,?,?,?,?)',
      [Id_Compra, Proveedor, Comprador, Fecha_Compra, Total_compra]
    );
  },

  async insertDetalleCompra(idCompra, producto) {
    const { IdProducto, Cantidad, Precio_Compra, Precio_Venta } = producto;
    await conexion.promise().query(
      'CALL InsertarDetallesCompra(?,?,?,?,?)',
      [idCompra, IdProducto, Cantidad, Precio_Compra, Precio_Venta]
    );
  },

  async getDetalleCompra(id) {
    const [rows] = await conexion.promise().query(
      'SELECT * FROM mostrardetallecompras WHERE Id_Compra = ?', [id]
    );
    return rows;
  },

  async getInfoCompra(id) {
    const [rows] = await conexion.promise().query(
      'SELECT * FROM InfoProovedorCompra WHERE Id_Compra = ?', [id]
    );
    return rows;
  }
};

module.exports = CompraModel;
