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

module.exports = { list, getById, creditHistory };