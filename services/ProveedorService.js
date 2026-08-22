const ProveedorModel = require('../models/ProveedorModel');
const postgres = require('../server/src/config/db');

const ProveedorService = {
  async obtenerTodos() {
    if (process.env.NODE_ENV !== 'test') return (await postgres.query('SELECT * FROM mostrarproveedores ORDER BY nombre')).rows;
    return await ProveedorModel.getAll();
  },

  async obtenerPorId(id) {
    if (process.env.NODE_ENV !== 'test') return (await postgres.query('SELECT * FROM persona WHERE id_persona = $1', [id])).rows[0];
    return await ProveedorModel.findById(id);
  },

  async insertar(data) {
    if (process.env.NODE_ENV !== 'test') {
      const { Tipo_pro, Nombre_pro, Apellido_pro, Cedula_pro, Telefono_pro, Distrito_pro, Residencia_pro, PuntoReferencia_pro, Distancia_pro, Casa_pro, Comercio_pro } = data;
      await postgres.query('INSERT INTO persona (tipo_persona,nombre,apellido,cedula,telefono,distrito,zona_residencia,punto_referencia,distancia,casa,comercio) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11)', ['Proveedor', Nombre_pro, Apellido_pro, Cedula_pro, Telefono_pro, Distrito_pro, Residencia_pro, PuntoReferencia_pro, Distancia_pro, Casa_pro, Comercio_pro]);
      return;
    }
    await ProveedorModel.insert(data);
  }
};

module.exports = ProveedorService;
