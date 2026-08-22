const ClienteModel = require('../models/ClienteModel');

const ClienteService = 
{
  async obtenerClientes() 
  { return await ClienteModel.findAll(); },

  async obtenerClientePorId(id) 
  { return await ClienteModel.findById(id); },

  async obtenerRecordCrediticio(id) 
  {
    const records = await ClienteModel.getRecords(id);

    return records.map( record => 
    {
      const fecha = new Date(record.Fecha_Compra);
      const opciones = { day: '2-digit', month: 'long', year: 'numeric' };
      return {
        ...record,
        Fecha_Compra: fecha.toLocaleDateString('es-ES', opciones)
      };
    });
  },

  async agregarCliente(data) 
  { await ClienteModel.insert(data);},

  async actualizarCliente(data, tipo, comercio) 
  {  await ClienteModel.update(data, tipo, comercio); }
};

module.exports = ClienteService;
