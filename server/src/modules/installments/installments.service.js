const db = require('../../config/db');
const { requirePositiveInteger, requirePositiveNumber } = require('../../utils/validation');

async function listOpenCredit(actor) {
  const sellerId = actor?.rol === 'Vendedor' ? actor.id_persona : null;
  const { rows } = await db.query(`SELECT v.id_venta, concat(c.nombre, ' ', c.apellido) AS nombre_cliente,
    concat(p.nombre, ' ', p.apellido) AS nombre_vendedor, v.tipo_venta, v.fecha_venta, v.total_venta,
    v.total_venta - COALESCE(SUM(a.monto_abonado), 0) AS saldo_restante, v.plazo_compra, v.frecuencia_abonos
    FROM venta v JOIN persona c ON c.id_persona = v.id_cliente JOIN persona p ON p.id_persona = v.id_vendedor
    LEFT JOIN abonos a ON a.id_venta = v.id_venta
    WHERE v.tipo_venta = 'Credito' AND ($1::int IS NULL OR v.id_vendedor = $1)
    GROUP BY v.id_venta, c.nombre, c.apellido, p.nombre, p.apellido
    HAVING v.total_venta - COALESCE(SUM(a.monto_abonado), 0) > 0
    ORDER BY v.fecha_venta DESC`, [sellerId]);
  return rows;
}

async function create({ idVenta, montoAbonado, fechaAbono }, actor) {
  requirePositiveInteger(idVenta, 'La venta');
  requirePositiveNumber(montoAbonado, 'El monto abonado');
  const client = await db.pool.connect();
  try {
    await client.query('BEGIN');
    const sellerId = actor?.rol === 'Vendedor' ? actor.id_persona : null;
    const sale = await client.query(
      'SELECT tipo_venta FROM venta WHERE id_venta = $1 AND ($2::int IS NULL OR id_vendedor = $2) FOR UPDATE',
      [idVenta, sellerId],
    );
    if (!sale.rows.length) {
      const error = new Error('Venta no encontrada.');
      error.statusCode = 404;
      throw error;
    }
    if (sale.rows[0].tipo_venta !== 'Credito') {
      const error = new Error('Solo se pueden abonar ventas a crédito.');
      error.statusCode = 400;
      throw error;
    }
    const result = await client.query(
      'INSERT INTO abonos (id_venta,monto_abonado,fecha_abono) VALUES ($1,$2,COALESCE($3,CURRENT_DATE)) RETURNING *',
      [idVenta, montoAbonado, fechaAbono || null],
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

module.exports = { listOpenCredit, create };
