const ColaboradorModel = require('../models/ColaboradorModel');
const postgres = require('../server/src/config/db');

const ColaboradorService = 
{
  async obtenerTodos() 
  { if (process.env.NODE_ENV !== 'test') return (await postgres.query('SELECT * FROM mostrarcolaboradores ORDER BY tipo_persona, nombre')).rows; return await ColaboradorModel.getAll(); },

  async obtenerPorId(id) 
  { if (process.env.NODE_ENV !== 'test') return (await postgres.query('SELECT * FROM persona WHERE id_persona = $1', [id])).rows[0]; return await ColaboradorModel.findById(id); },

  async agregar(data) 
  {
    if (process.env.NODE_ENV !== 'test') {
      await postgres.query('INSERT INTO persona (tipo_persona,nombre,apellido,cedula,telefono,distrito,zona_residencia,punto_referencia,distancia,casa) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)', [data.selectCargoC, data.Nombre_vd, data.Apellido_vd, data.Cedula_vd, data.Telefono_vd, data.Distrito_vd, data.Residencia_vd, data.PuntoReferencia_vd, data.Distancia_vd, data.Casa_vd]);
      return { usuario: data.uservd, cedula: data.Cedula_vd };
    }
    await ColaboradorModel.insert(data);
    return {
      usuario: data.uservd,
      cedula: data.Cedula_vd
    };
  },

  async actualizar(data) 
  { if (process.env.NODE_ENV !== 'test') { await postgres.query('UPDATE persona SET cedula=$1,nombre=$2,apellido=$3,telefono=$4,distrito=$5,zona_residencia=$6,punto_referencia=$7,distancia=$8,casa=$9,tipo_persona=$10 WHERE id_persona=$11', [data.Cedula_vd, data.Nombre_vd, data.Apellido_vd, data.Telefono_vd, data.Distrito_vd, data.Residencia_vd, data.PuntoReferencia_vd, data.Distancia_vd, data.Casa_vd, data.selectCargoC, data.Id_vd]); return; } await ColaboradorModel.update(data); }
  
};

module.exports = ColaboradorService;
