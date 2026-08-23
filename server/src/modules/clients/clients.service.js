const db = require('../../config/db');

async function list() {
  const { rows } = await db.query('SELECT * FROM mostrarclientes ORDER BY nombre');
  return rows;
}

async function getById(id) {
  const { rows } = await db.query('SELECT * FROM mostrarclientes WHERE id_cliente = $1', [id]);
  return rows[0] || null;
}

async function creditHistory(id) {
  const { rows } = await db.query('SELECT * FROM record_crediticio WHERE id_cliente = $1 ORDER BY fecha_compra DESC', [id]);
  return rows;
}

async function create({ nombre, apellido, cedula, telefono, distrito, zonaResidencia, puntoReferencia, distancia, casa }) {
  if (!nombre || !apellido || !cedula || !telefono || !distrito || !zonaResidencia) {
    const error = new Error('Nombre, apellido, cédula, teléfono, distrito y zona son requeridos.'); error.statusCode = 400; throw error;
  }
  const { rows } = await db.query(`INSERT INTO persona
    (tipo_persona, nombre, apellido, cedula, telefono, credito_disponible, distrito, zona_residencia, punto_referencia, distancia, casa)
    VALUES ('Cliente',$1,$2,$3,$4,6000,$5,$6,$7,$8,$9) RETURNING id_persona`,
  [nombre, apellido, cedula, telefono, distrito, zonaResidencia, puntoReferencia || null, distancia || null, casa || null]);
  return getById(rows[0].id_persona);
}

async function update(id, { nombre, apellido, cedula, telefono, distrito, zonaResidencia, puntoReferencia, distancia, casa }) {
  if (!nombre || !apellido || !cedula || !telefono || !distrito || !zonaResidencia) { const error = new Error('Los datos del cliente no son válidos.'); error.statusCode = 400; throw error; }
  const { rows } = await db.query(`UPDATE persona SET nombre=$1, apellido=$2, cedula=$3, telefono=$4, distrito=$5, zona_residencia=$6, punto_referencia=$7, distancia=$8, casa=$9 WHERE id_persona=$10 AND tipo_persona='Cliente' RETURNING id_persona`, [nombre, apellido, cedula, telefono, distrito, zonaResidencia, puntoReferencia || null, distancia || null, casa || null, id]);
  if (!rows.length) { const error = new Error('Cliente no encontrado.'); error.statusCode = 404; throw error; }
  return getById(id);
}

async function updateStatus(id, estado) {
  if (!['Activo', 'Inactivo'].includes(estado)) { const error = new Error('Estado no válido.'); error.statusCode = 400; throw error; }
  const { rows } = await db.query(`UPDATE persona SET estado=$1 WHERE id_persona=$2 AND tipo_persona='Cliente' RETURNING id_persona, estado`, [estado, id]);
  if (!rows.length) { const error = new Error('Cliente no encontrado.'); error.statusCode = 404; throw error; }
  return rows[0];
}

module.exports = { list, getById, creditHistory, create, update, updateStatus };