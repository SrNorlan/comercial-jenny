const db = require('../../config/db');
const bcrypt = require('bcryptjs');
const allowedRoles = new Set(['Vendedor', 'Gerente', 'Sub-Gerente', 'Supervisor']);

async function list() {
  const { rows } = await db.query('SELECT * FROM mostrarcolaboradores ORDER BY tipo_persona, nombre');
  return rows;
}

async function create({ tipoPersona = 'Vendedor', nombre, apellido, cedula, telefono, distrito, zonaResidencia, puntoReferencia, distancia, casa, usuario, contrasena }) {
  if (!allowedRoles.has(tipoPersona)) { const error = new Error('El cargo seleccionado no es válido.'); error.statusCode = 400; throw error; }
  if (!nombre || !apellido || !cedula || !telefono || !distrito || !zonaResidencia || !usuario || !contrasena) { const error = new Error('Nombre, apellido, cédula, teléfono, distrito, zona, usuario y contraseña son requeridos.'); error.statusCode = 400; throw error; }
  const client = await db.pool.connect();
  try {
    await client.query('BEGIN');
    const personResult = await client.query(`INSERT INTO persona (tipo_persona, nombre, apellido, cedula, telefono, distrito, zona_residencia, punto_referencia, distancia, casa)
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10) RETURNING id_persona`, [tipoPersona, nombre, apellido, cedula, telefono, distrito, zonaResidencia, puntoReferencia || null, distancia || null, casa || null]);
    const passwordHash = await bcrypt.hash(contrasena, 12);
    await client.query('INSERT INTO usuarios (usuario, contrasena, rol, id_persona) VALUES ($1,$2,$3,$4)', [usuario, passwordHash, tipoPersona === 'Vendedor' ? 'Vendedor' : 'Gerente', personResult.rows[0].id_persona]);
    await client.query('COMMIT');
    return personResult.rows[0];
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
}

async function update(id, { tipoPersona, nombre, apellido, cedula, telefono, distrito, zonaResidencia, puntoReferencia, distancia, casa }) {
  if (!allowedRoles.has(tipoPersona) || !nombre || !apellido || !cedula || !telefono || !distrito || !zonaResidencia) { const error = new Error('Los datos del colaborador no son válidos.'); error.statusCode = 400; throw error; }
  const { rows } = await db.query(`UPDATE persona SET tipo_persona=$1, nombre=$2, apellido=$3, cedula=$4, telefono=$5, distrito=$6, zona_residencia=$7, punto_referencia=$8, distancia=$9, casa=$10 WHERE id_persona=$11 AND tipo_persona <> 'Cliente' RETURNING id_persona`, [tipoPersona, nombre, apellido, cedula, telefono, distrito, zonaResidencia, puntoReferencia || null, distancia || null, casa || null, id]);
  if (!rows.length) { const error = new Error('Colaborador no encontrado.'); error.statusCode = 404; throw error; }
  return rows[0];
}

async function updateStatus(id, estado) {
  if (!['Activo', 'Inactivo'].includes(estado)) { const error = new Error('Estado no válido.'); error.statusCode = 400; throw error; }
  const { rows } = await db.query(`UPDATE persona SET estado=$1 WHERE id_persona=$2 AND tipo_persona <> 'Cliente' RETURNING id_persona, estado`, [estado, id]);
  if (!rows.length) { const error = new Error('Colaborador no encontrado.'); error.statusCode = 404; throw error; }
  return rows[0];
}

module.exports = { list, create, update, updateStatus };
