const db = require('../../config/db');
const { requirePositiveNumber, requireNonNegativeNumber } = require('../../utils/validation');

async function list(category) {
  const query = category ? 'SELECT * FROM productos WHERE categoria = $1 ORDER BY id_producto DESC' : 'SELECT * FROM productos ORDER BY id_producto DESC';
  const { rows } = await db.query(query, category ? [category] : []);
  return rows;
}

async function getById(id) {
  const { rows } = await db.query('SELECT * FROM productos WHERE id_producto = $1', [id]);
  return rows[0] || null;
}

async function create({ marca, existencia = 0, precioVenta, precioCompra, color, tipo, categoria, talla, modelo, clasificacion, dimensiones, unidadMedida, fechaVencimiento }) {
  if (!marca || !color || !tipo || !categoria) {
    const error = new Error('Marca, color, tipo y categoría son requeridos.'); error.statusCode = 400; throw error;
  }
  requireNonNegativeNumber(existencia, 'La existencia');
  requirePositiveNumber(precioVenta, 'El precio de venta');
  if (precioCompra !== undefined && precioCompra !== null && precioCompra !== '') requireNonNegativeNumber(precioCompra, 'El precio de compra');
  const { rows } = await db.query(`INSERT INTO productos
    (marca, existencia, precio_venta, precio_compra, color, tipo, categoria, talla, modelo, clasificacion, dimensiones, unidad_medida, fecha_vencimiento, fecha_ingreso)
    VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,CURRENT_DATE) RETURNING *`,
  [marca, existencia, precioVenta || null, precioCompra || null, color, tipo, categoria, talla || null, modelo || null, clasificacion || null, dimensiones || null, unidadMedida || null, fechaVencimiento || null]);
  return rows[0];
}

async function update(id, data) {
  const { marca, existencia, precioVenta, precioCompra, color, tipo, categoria, talla, modelo, clasificacion, dimensiones, unidadMedida, fechaVencimiento } = data;
  if (!marca || !color || !tipo || !categoria) { const error = new Error('Marca, color, tipo y categoría son requeridos.'); error.statusCode = 400; throw error; }
  requireNonNegativeNumber(existencia, 'La existencia');
  requirePositiveNumber(precioVenta, 'El precio de venta');
  if (precioCompra !== undefined && precioCompra !== null && precioCompra !== '') requireNonNegativeNumber(precioCompra, 'El precio de compra');
  const { rows } = await db.query(`UPDATE productos SET marca=$1, existencia=$2, precio_venta=$3, precio_compra=$4, color=$5, tipo=$6, categoria=$7, talla=$8, modelo=$9, clasificacion=$10, dimensiones=$11, unidad_medida=$12, fecha_vencimiento=$13 WHERE id_producto=$14 RETURNING *`, [marca, existencia, precioVenta || null, precioCompra || null, color, tipo, categoria, talla || null, modelo || null, clasificacion || null, dimensiones || null, unidadMedida || null, fechaVencimiento || null, id]);
  if (!rows.length) { const error = new Error('Producto no encontrado.'); error.statusCode = 404; throw error; }
  return rows[0];
}

async function updateStatus(id, estadoProducto) {
  if (!['Activo', 'Inactivo'].includes(estadoProducto)) { const error = new Error('Estado no válido.'); error.statusCode = 400; throw error; }
  const { rows } = await db.query('UPDATE productos SET estado_producto=$1 WHERE id_producto=$2 RETURNING id_producto, estado_producto', [estadoProducto, id]);
  if (!rows.length) { const error = new Error('Producto no encontrado.'); error.statusCode = 404; throw error; }
  return rows[0];
}

module.exports = { list, getById, create, update, updateStatus };