const db = require('../../config/db');

async function create({ idVenta, idProducto, cantidadDevuelta, motivo }) {
  const client = await db.pool.connect();
  try {
    await client.query('BEGIN');
    const result = await client.query('INSERT INTO productos_devueltos (id_venta,id_producto,cantidad_devuelta,motivo) VALUES ($1,$2,$3,$4) RETURNING *', [idVenta, idProducto, cantidadDevuelta, motivo || null]);
    await client.query('COMMIT');
    return result.rows[0];
  } catch (error) { await client.query('ROLLBACK'); throw error; } finally { client.release(); }
}

module.exports = { create };