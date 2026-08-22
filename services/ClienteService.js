const ClienteModel = require('../models/ClienteModel');
const postgres = require('../server/src/config/db');

const ClienteService = 
{
  async obtenerClientes() 
  {
    if (process.env.NODE_ENV !== 'test') {
      const { rows } = await postgres.query('SELECT * FROM mostrarclientes ORDER BY nombre');
      return rows.map((row) => ({ Id_Cliente: row.id_cliente, Nombre: row.nombre, Cedula: row.cedula, Telefono: row.telefono, Direccion: row.direccion, Credito_Disponible: row.credito_disponible, Estado_Cliente: row.estado_cliente }));
    }
    return await ClienteModel.findAll();
  },

  async obtenerClientePorId(id) 
  {
    if (process.env.NODE_ENV !== 'test') {
      const { rows } = await postgres.query('SELECT * FROM persona WHERE id_persona = $1', [id]);
      return rows[0];
    }
    return await ClienteModel.findById(id);
  },

  async obtenerRecordCrediticio(id) 
  {
    const records = process.env.NODE_ENV !== 'test'
      ? (await postgres.query('SELECT * FROM record_crediticio WHERE id_cliente = $1 ORDER BY fecha_compra DESC', [id])).rows
      : await ClienteModel.getRecords(id);

    return records.map( record => 
    {
      const fecha = new Date(record.Fecha_Compra);
      const opciones = { day: '2-digit', month: 'long', year: 'numeric' };
      return {
        ...record,
        Fecha_Compra: fecha.toLocaleDateString('es-ES', opciones),
        Id_Record: record.id_record ?? record.Id_Record,
      };
    });
  },

  async agregarCliente(data) 
  { await ClienteModel.insert(data);},

  async actualizarCliente(data, tipo, comercio) 
  {  await ClienteModel.update(data, tipo, comercio); }
};

module.exports = ClienteService;
