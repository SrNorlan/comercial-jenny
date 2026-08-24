const db = require('../../config/db');

async function list() {
  const { rows } = await db.query('SELECT * FROM mostrarproveedores ORDER BY nombre');
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
  comercio,
}) {
  if (!nombre || !apellido || !cedula || !telefono || !distrito || !zonaResidencia || !comercio) {
    const error = new Error(
      'Nombre, apellido, cédula, teléfono, distrito, zona y comercio son requeridos.',
    );
    error.statusCode = 400;
    throw error;
  }
  const { rows } = await db.query(
    `INSERT INTO persona (tipo_persona, nombre, apellido, cedula, telefono, distrito, zona_residencia, punto_referencia, distancia, casa, comercio)
    VALUES ('Proveedor',$1,$2,$3,$4,$5,$6,$7,$8,$9,$10) RETURNING id_persona`,
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
      comercio,
    ],
  );
  return rows[0];
}

module.exports = { list, create };
