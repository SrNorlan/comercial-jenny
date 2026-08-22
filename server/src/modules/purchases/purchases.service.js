const db = require('../../config/db');

async function list() {
  const { rows } = await db.query('SELECT * FROM compras ORDER BY fecha_compra DESC, id_compra DESC');
  return rows;
}

async function create({ idCompra, idProveedor, idComprador, totalCompra, items }) {
  if (!Array.isArray(items) || items.length === 0) {
    const error = new Error('La compra debe incluir productos.'); error.statusCode = 400; throw error;
  }
  const client = await db.pool.connect();
  try {
    await client.query('BEGIN');
    await client.query('INSERT INTO compras (id_compra,id_proveedor,id_comprador,total_compra) VALUES ($1,$2,$3,$4)', [idCompra, idProveedor, idComprador, totalCompra]);
    for (const item of items) {
      await client.query('INSERT INTO detalle_compra (id_compra,id_producto,cantidad_comprada,precio_compra,precio_venta) VALUES ($1,$2,$3,$4,$5)', [idCompra, item.idProducto, item.cantidad, item.precioCompra, item.precioVenta]);
    }
    await client.query('COMMIT');
    return { idCompra };
  } catch (error) { await client.query('ROLLBACK'); throw error; } finally { client.release(); }
}

module.exports = { list, create };