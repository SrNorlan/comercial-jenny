const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const env = require('./config/env');
const apiRoutes = require('./routes/api.routes');
const errorHandler = require('./middlewares/error.middleware');

const app = express();
app.use(cors({ origin: env.CLIENT_URL, credentials: true }));
app.use(express.json({ limit: '1mb' }));
app.use(cookieParser());
app.use('/api/v1', apiRoutes);
app.use((req, res) => res.status(404).json({ success: false, message: 'Endpoint no encontrado.' }));
app.use(errorHandler);

module.exports = app;