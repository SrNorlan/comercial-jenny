const db = require('../../config/db');
const { requirePositiveInteger } = require('../../utils/validation');

async function list() {
  const { rows } = await db.query(`SELECT d.id_productodevuelto, d.id_venta, d.id_producto,
    d.cantidad_devuelta, d.fecha_devolucion, d.motivo,
    concat(c.nombre, ' ', c.apellido) AS cliente,
    concat(p.tipo, ' ', p.marca) AS producto
    FROM productos_devueltos d
    LEFT JOIN venta v ON v.id_venta = d.id_venta
    LEFT JOIN persona c ON c.id_persona = v.id_cliente
    LEFT JOIN productos p ON p.id_producto = d.id_producto
    ORDER BY d.fecha_devolucion DESC, d.id_productodevuelto DESC`);
  return rows;
}

async function create({ idVenta, idProducto, cantidadDevuelta, motivo }) {
  requirePositiveInteger(idVenta, 'La venta');
  requirePositiveInteger(idProducto, 'El producto');
  requirePositiveInteger(cantidadDevuelta, 'La cantidad devuelta');
  const client = await db.pool.connect();
  try {
    await client.query('BEGIN');
    const result = await client.query(
      'INSERT INTO productos_devueltos (id_venta,id_producto,cantidad_devuelta,motivo) VALUES ($1,$2,$3,$4) RETURNING *',
      [idVenta, idProducto, cantidadDevuelta, motivo || null],
    );
    await client.query('COMMIT');
    return result.rows[0];
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
}

module.exports = { list, create };
