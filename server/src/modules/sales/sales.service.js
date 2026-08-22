const db = require('../../config/db');

async function list() { const { rows } = await db.query('SELECT * FROM mostrarventas ORDER BY fecha_venta DESC'); return rows; }

async function create({ idVenta, idCliente, idVendedor, tipoVenta, totalVenta, plazoCompra, frecuenciaAbonos, items }) {
  if (!Array.isArray(items) || items.length === 0) { const error = new Error('La venta debe incluir productos.'); error.statusCode = 400; throw error; }
  const client = await db.pool.connect();
  try {
    await client.query('BEGIN');
    if (tipoVenta === 'Credito') {
      const result = await client.query('SELECT credito_disponible FROM persona WHERE id_persona = $1 FOR UPDATE', [idCliente]);
      if (!result.rows.length || Number(result.rows[0].credito_disponible || 0) < Number(totalVenta)) { const error = new Error('Crédito disponible insuficiente.'); error.statusCode = 400; throw error; }
    }
    await client.query('INSERT INTO venta (id_venta,id_cliente,id_vendedor,tipo_venta,total_venta,plazo_compra,frecuencia_abonos) VALUES ($1,$2,$3,$4,$5,$6,$7)', [idVenta, idCliente, idVendedor, tipoVenta, totalVenta, plazoCompra || null, frecuenciaAbonos || null]);
    for (const item of items) await client.query('INSERT INTO detalle_venta (id_venta,id_producto,cant_vendida,precio_unitario) VALUES ($1,$2,$3,$4)', [idVenta, item.idProducto, item.cantidad, item.precioUnitario]);
    await client.query('COMMIT');
    return { idVenta };
  } catch (error) { await client.query('ROLLBACK'); throw error; } finally { client.release(); }
}

module.exports = { list, create };