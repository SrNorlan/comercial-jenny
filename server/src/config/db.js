const { Pool } = require('pg');
const env = require('./env');

const pool = new Pool({
  host: env.DB_HOST,
  port: env.DB_PORT,
  user: env.DB_USER,
  password: env.DB_PASSWORD,
  database: env.DB_DATABASE,
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 5000,
});

pool.on('error', (error) => console.error('PostgreSQL pool error:', error.message));

module.exports = {
  pool,
  query: (text, params) => pool.query(text, params),
};
