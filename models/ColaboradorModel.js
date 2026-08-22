const conexion = require('../config/db');

const ColaboradorModel = 
{
  async getAll() 
  {
    const [rows] = await conexion.promise().query('SELECT * FROM mostrarcolaboradores ORDER BY Tipo_Persona');
    return rows;
  },

  async findById(id) 
  {
    const [rows] = await conexion.promise().query('SELECT * FROM persona WHERE Id_Persona = ?', [id]);
    return rows[0];
  },

  async insert(data) 
  {
    const { selectCargoC, Nombre_vd, Apellido_vd, Cedula_vd, Telefono_vd, Distrito_vd, Residencia_vd, PuntoReferencia_vd, Distancia_vd, Casa_vd } = data;

    await conexion.promise().query( 'CALL InsertarPersona(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [selectCargoC, Nombre_vd, Apellido_vd, Cedula_vd, Telefono_vd, Distrito_vd, Residencia_vd, PuntoReferencia_vd, Distancia_vd, Casa_vd, null]);
  },

  async update(data) 
  {
    const { Id_vd, Cedula_vd, Nombre_vd, Apellido_vd, Telefono_vd, Distrito_vd, Residencia_vd, PuntoReferencia_vd, Distancia_vd, Casa_vd, selectCargoC } = data;

    await conexion.promise().query( 'CALL EditarPersona(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [Id_vd, Cedula_vd, Nombre_vd, Apellido_vd, Telefono_vd, Distrito_vd, Residencia_vd, PuntoReferencia_vd, Distancia_vd, Casa_vd, selectCargoC, null] );
  }
};

module.exports = ColaboradorModel;
