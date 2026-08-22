const db = require('../../config/db');

async function list(category) {
  const query = category ? 'SELECT * FROM productos WHERE categoria = $1 ORDER BY id_producto DESC' : 'SELECT * FROM productos ORDER BY id_producto DESC';
  const { rows } = await db.query(query, category ? [category] : []);
  return rows;
}

async function getById(id) {
  const { rows } = await db.query('SELECT * FROM productos WHERE id_producto = $1', [id]);
  return rows[0] || null;
}

module.exports = { list, getById };