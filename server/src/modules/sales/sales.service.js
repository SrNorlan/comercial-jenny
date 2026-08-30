const db = require('../../config/db');
const {
  requirePositiveInteger,
  requirePositiveNumber,
  validateItems,
  validationError,
} = require('../../utils/validation');

async function list(actor) {
  const sellerId = actor?.rol === 'Vendedor' ? actor.id_persona : null;
  const { rows } = await db.query(
    'SELECT mv.* FROM mostrarventas mv JOIN venta base ON base.id_venta = mv.id_venta WHERE ($1::int IS NULL OR base.id_vendedor = $1) ORDER BY mv.fecha_venta DESC',
    [sellerId],
  );
  return rows;
}

async function invoice(idVenta, actor) {
  const sellerId = actor?.rol === 'Vendedor' ? actor.id_persona : null;
  const sale = await db.query(
    `SELECT v.id_venta, v.fecha_venta, v.tipo_venta, v.total_venta,
    concat(c.nombre, ' ', c.apellido) AS cliente, concat(p.nombre, ' ', p.apellido) AS vendedor
    FROM venta v JOIN persona c ON c.id_persona = v.id_cliente JOIN persona p ON p.id_persona = v.id_vendedor
    WHERE v.id_venta = $1 AND ($2::int IS NULL OR v.id_vendedor = $2)`,
    [idVenta, sellerId],
  );
  if (!sale.rows.length) {
    const error = new Error('La venta no existe.');
    error.statusCode = 404;
    throw error;
  }
  const items = await db.query(
    `SELECT concat(pr.tipo, ' ', pr.marca) AS producto,
    d.cant_vendida AS cantidad, d.precio_unitario
    FROM detalle_venta d JOIN productos pr ON pr.id_producto = d.id_producto
    WHERE d.id_venta = $1 ORDER BY d.id_detalle_venta`,
    [idVenta],
  );
  return { ...sale.rows[0], items: items.rows };
}

async function create({
  idVenta,
  idCliente,
  idVendedor,
  tipoVenta,
  totalVenta,
  plazoCompra,
  frecuenciaAbonos,
  items,
}, actor) {
  requirePositiveInteger(idVenta, 'El identificador de venta');
  requirePositiveInteger(idCliente, 'El cliente');
  requirePositiveInteger(idVendedor, 'El vendedor');
  if (!['Contado', 'Credito'].includes(tipoVenta))
    throw validationError('El tipo de venta no es válido.');
  requirePositiveNumber(totalVenta, 'El total');
  validateItems(items, 'venta');
  if (actor?.rol === 'Vendedor' && Number(idVendedor) !== Number(actor.id_persona)) {
    const error = new Error('Solo puedes registrar ventas a tu nombre.');
    error.statusCode = 403;
    throw error;
  }
  const client = await db.pool.connect();
  try {
    await client.query('BEGIN');
    if (tipoVenta === 'Credito') {
      const result = await client.query(
        'SELECT credito_disponible FROM persona WHERE id_persona = $1 FOR UPDATE',
        [idCliente],
      );
      if (
        !result.rows.length ||
        Number(result.rows[0].credito_disponible || 0) < Number(totalVenta)
      ) {
        const error = new Error('Crédito disponible insuficiente.');
        error.statusCode = 400;
        throw error;
      }
    }
    await client.query(
      'INSERT INTO venta (id_venta,id_cliente,id_vendedor,tipo_venta,total_venta,plazo_compra,frecuencia_abonos) VALUES ($1,$2,$3,$4,$5,$6,$7)',
      [
        idVenta,
        idCliente,
        idVendedor,
        tipoVenta,
        totalVenta,
        plazoCompra || null,
        frecuenciaAbonos || null,
      ],
    );
    for (const item of items)
      await client.query(
        'INSERT INTO detalle_venta (id_venta,id_producto,cant_vendida,precio_unitario) VALUES ($1,$2,$3,$4)',
        [idVenta, item.idProducto, item.cantidad, item.precioUnitario],
      );
    await client.query('COMMIT');
    return { idVenta };
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
}

module.exports = { list, create, invoice };
