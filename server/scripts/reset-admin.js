const path = require('path');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');
const { Pool } = require('pg');

dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const password = process.env.ADMIN_PASSWORD;
if (!password) throw new Error('Define ADMIN_PASSWORD antes de ejecutar este script.');

const pool = new Pool({
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT || 5432),
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
});

(async () => {
  const hash = await bcrypt.hash(password, 12);
  const result = await pool.query(
    'UPDATE usuarios SET usuario = $1, contrasena = $2, rol = $3 WHERE usuario = $4',
    ['admin', hash, 'Gerente', 'kenth060'],
  );
  if (!result.rowCount) throw new Error('No se encontró el usuario kenth060.');
  const verification = await pool.query(
    'SELECT usuario, rol, contrasena FROM usuarios WHERE usuario = $1',
    ['admin'],
  );
  console.log({
    updated: result.rowCount,
    usuario: verification.rows[0].usuario,
    rol: verification.rows[0].rol,
    passwordValid: await bcrypt.compare(password, verification.rows[0].contrasena),
  });
})()
  .catch((error) => {
    console.error(error.message);
    process.exitCode = 1;
  })
  .finally(() => pool.end());
