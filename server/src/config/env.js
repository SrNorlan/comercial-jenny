const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: process.env.ENV_FILE || path.resolve(__dirname, '../../../.env') });

const required = ['JWT_SECRET'];
for (const key of required) {
  if (!process.env[key] && process.env.NODE_ENV === 'production') {
    throw new Error(`Missing required environment variable: ${key}`);
  }
}

module.exports = {
  NODE_ENV: process.env.NODE_ENV || 'development',
  PORT: Number(process.env.API_PORT || 4500),
  CLIENT_URL: process.env.CLIENT_URL || 'http://localhost:5173',
  DB_HOST: process.env.DB_HOST || 'localhost',
  DB_PORT: Number(process.env.DB_PORT || 5432),
  DB_USER: process.env.DB_USER || 'postgres',
  DB_PASSWORD: process.env.DB_PASSWORD || '',
  DB_DATABASE: process.env.DB_DATABASE || 'comercial_jenny',
  JWT_SECRET: process.env.JWT_SECRET || process.env.JWT_SECRETO || 'development-only-change-me',
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || process.env.JWT_EXPIRES_TIME || '8h',
};