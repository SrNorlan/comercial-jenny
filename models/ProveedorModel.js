const conexion = require('../config/db');

const ProveedorModel = {
  async getAll() {
    const [rows] = await conexion.promise().query('SELECT * FROM mostrarproveedores');
    return rows;
  },

  async findById(id) {
    const [rows] = await conexion.promise().query('SELECT * FROM persona WHERE Id_Persona = ?', [id]);
    return rows[0];
  },

  async insert(data) {
    const {
      Tipo_pro,
      Nombre_pro,
      Apellido_pro,
      Cedula_pro,
      Telefono_pro,
      Distrito_pro,
      Residencia_pro,
      PuntoReferencia_pro,
      Distancia_pro,
      Casa_pro,
      Comercio_pro
    } = data;

    await conexion.promise().query(
      'CALL InsertarPersona(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [
        Tipo_pro,
        Nombre_pro,
        Apellido_pro,
        Cedula_pro,
        Telefono_pro,
        Distrito_pro,
        Residencia_pro,
        PuntoReferencia_pro,
        Distancia_pro,
        Casa_pro,
        Comercio_pro
      ]
    );
  }
};

module.exports = ProveedorModel;
