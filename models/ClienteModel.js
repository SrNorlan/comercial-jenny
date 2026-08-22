const conexion = require('../config/db');

const ClienteModel = 
{

  async findAll() 
  {
    const [rows] = await conexion.promise().query('SELECT * FROM MostrarClientes');
    return rows;
  },

  async findById(id) 
  {
    const [rows] = await conexion.promise().query('SELECT * FROM persona WHERE Id_Persona = ?', [id]);
    return rows[0];
  },

  async getRecords(id) 
  {
    const [rows] = await conexion.promise().query('SELECT * FROM record_crediticio WHERE Id_Cliente = ?', [id]);
    return rows;
  },

  async insert(data) 
  {
    const { Tipo_cl, Nombre_cl, Apellido_cl, Cedula_cl, Telefono_cl, Distrito_cl, Residencia_cl, PuntoReferencia_cl, Distancia_cl, Casa_cl} = data;

    await conexion.promise().query('CALL InsertarPersona(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [Tipo_cl, Nombre_cl, Apellido_cl, Cedula_cl, Telefono_cl, Distrito_cl, Residencia_cl, PuntoReferencia_cl, Distancia_cl, Casa_cl, null]
    );
  },

  async update(data, tipo, comercio)
  {
    const { Id_cl, Nombre_cl, Apellido_cl, Cedula_cl, Telefono_cl, Distrito_cl, Residencia_cl, PuntoReferencia_cl, Distancia_cl, Casa_cl } = data;

    await conexion.promise().query( 'CALL EditarPersona(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [Id_cl, Cedula_cl, Nombre_cl, Apellido_cl, Telefono_cl, Distrito_cl, Residencia_cl, PuntoReferencia_cl, Distancia_cl, Casa_cl, tipo, comercio]
    );
  }

};

module.exports = ClienteModel;
