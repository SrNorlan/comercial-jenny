const ProveedorModel = require('../models/ProveedorModel');

const ProveedorService = {
  async obtenerTodos() {
    return await ProveedorModel.getAll();
  },

  async obtenerPorId(id) {
    return await ProveedorModel.findById(id);
  },

  async insertar(data) {
    await ProveedorModel.insert(data);
  }
};

module.exports = ProveedorService;
