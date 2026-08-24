const db = require('../../config/db');
const { requirePositiveInteger, requirePositiveNumber } = require('../../utils/validation');

async function listOpenCredit() {
  const { rows } = await db.query('SELECT * FROM showventascredito ORDER BY fecha_venta DESC');
  return rows;
}

async function create({ idVenta, montoAbonado, fechaAbono }) {
  requirePositiveInteger(idVenta, 'La venta');
  requirePositiveNumber(montoAbonado, 'El monto abonado');
  const client = await db.pool.connect();
  try {
    await client.query('BEGIN');
    const sale = await client.query('SELECT tipo_venta FROM venta WHERE id_venta = $1 FOR UPDATE', [
      idVenta,
    ]);
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
