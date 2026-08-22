const ColaboradorModel = require('../models/ColaboradorModel');

const ColaboradorService = 
{
  async obtenerTodos() 
  {  return await ColaboradorModel.getAll(); },

  async obtenerPorId(id) 
  { return await ColaboradorModel.findById(id); },

  async agregar(data) 
  {
    await ColaboradorModel.insert(data);
    return {
      usuario: data.uservd,
      cedula: data.Cedula_vd
    };
  },

  async actualizar(data) 
  {  await ColaboradorModel.update(data); }
  
};

module.exports = ColaboradorService;
