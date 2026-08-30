const db = require('../../config/db');

async function list(actor) {
  const sellerId = actor?.rol === 'Vendedor' ? actor.id_persona : null;
  const { rows } = await db.query(`SELECT c.* FROM mostrarclientes c
    WHERE ($1::int IS NULL OR EXISTS (
      SELECT 1 FROM venta v
      WHERE v.id_cliente = c.id_cliente AND v.id_vendedor = $1 AND v.tipo_venta = 'Credito'
        AND v.total_venta - COALESCE((SELECT SUM(a.monto_abonado) FROM abonos a WHERE a.id_venta = v.id_venta), 0) > 0
    ) OR c.id_vendedor = $1)) ORDER BY c.nombre`, [sellerId]);
  return rows;
}

async function getById(id, actor) {
  const sellerId = actor?.rol === 'Vendedor' ? actor.id_persona : null;
  const { rows } = await db.query(`SELECT c.* FROM mostrarclientes c
    WHERE c.id_cliente = $1 AND ($2::int IS NULL OR EXISTS (
      SELECT 1 FROM venta v WHERE v.id_cliente = c.id_cliente AND v.id_vendedor = $2
    ) OR c.id_vendedor = $2))`, [id, sellerId]);
  return rows[0] || null;
}

async function creditHistory(id, actor) {
  const sellerId = actor?.rol === 'Vendedor' ? actor.id_persona : null;
  const { rows } = await db.query(
    `SELECT r.* FROM record_crediticio r
     JOIN venta v ON v.id_venta = r.id_venta
     WHERE r.id_cliente = $1 AND ($2::int IS NULL OR v.id_vendedor = $2)
     ORDER BY r.fecha_compra DESC`,
    [id, sellerId],
  );
  return rows;
}

async function create({
  nombre,
  apellido,
  cedula,
  telefono,
  distrito,
  zonaResidencia,
  puntoReferencia,
  distancia,
  casa,
}, actor) {
  if (!nombre || !apellido || !cedula || !telefono || !distrito || !zonaResidencia) {
    const error = new Error('Nombre, apellido, cédula, teléfono, distrito y zona son requeridos.');
    error.statusCode = 400;
    throw error;
  }
  const { rows } = await db.query(
    `INSERT INTO persona
    (tipo_persona, nombre, apellido, cedula, telefono, credito_disponible, distrito, zona_residencia, punto_referencia, distancia, casa, id_vendedor)
    VALUES ('Cliente',$1,$2,$3,$4,6000,$5,$6,$7,$8,$9,$10) RETURNING id_persona`,
    [
      nombre,
      apellido,
      cedula,
      telefono,
      distrito,
      zonaResidencia,
      puntoReferencia || null,
      distancia || null,
      casa || null,
      actor?.rol === 'Vendedor' ? actor.id_persona : null,
    ],
  );
  return getById(rows[0].id_persona, actor);
}

async function update(
  id,
  {
    nombre,
    apellido,
    cedula,
    telefono,
    distrito,
    zonaResidencia,
    puntoReferencia,
    distancia,
    casa,
  },
  actor,
) {
  if (!nombre || !apellido || !cedula || !telefono || !distrito || !zonaResidencia) {
    const error = new Error('Los datos del cliente no son válidos.');
    error.statusCode = 400;
    throw error;
  }
  const { rows } = await db.query(
    `UPDATE persona SET nombre=$1, apellido=$2, cedula=$3, telefono=$4, distrito=$5, zona_residencia=$6, punto_referencia=$7, distancia=$8, casa=$9
     WHERE id_persona=$10 AND tipo_persona='Cliente' AND ($11::int IS NULL OR EXISTS (
       SELECT 1 FROM venta v WHERE v.id_cliente = persona.id_persona AND v.id_vendedor = $11
     ) OR persona.id_vendedor = $11)) RETURNING id_persona`,
    [
      nombre,
      apellido,
      cedula,
      telefono,
      distrito,
      zonaResidencia,
      puntoReferencia || null,
      distancia || null,
      casa || null,
      id,
      actor?.rol === 'Vendedor' ? actor.id_persona : null,
    ],
  );
  if (!rows.length) {
    const error = new Error('Cliente no encontrado.');
    error.statusCode = 404;
    throw error;
  }
  return getById(id, actor);
}

async function updateStatus(id, estado, actor) {
  if (!['Activo', 'Inactivo'].includes(estado)) {
    const error = new Error('Estado no válido.');
    error.statusCode = 400;
    throw error;
  }
  const { rows } = await db.query(
    `UPDATE persona SET estado=$1 WHERE id_persona=$2 AND tipo_persona='Cliente' AND ($3::int IS NULL OR EXISTS (
      SELECT 1 FROM venta v WHERE v.id_cliente = persona.id_persona AND v.id_vendedor = $3
    ) OR persona.id_vendedor = $3)) RETURNING id_persona, estado`,
    [estado, id, actor?.rol === 'Vendedor' ? actor.id_persona : null],
  );
  if (!rows.length) {
    const error = new Error('Cliente no encontrado.');
    error.statusCode = 404;
    throw error;
  }
  return rows[0];
}

module.exports = { list, getById, creditHistory, create, update, updateStatus };
