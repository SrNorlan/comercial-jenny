const express = require('express');
const path = require('path');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const env = require('./config/env');
const apiRoutes = require('./routes/api.routes');
const errorHandler = require('./middlewares/error.middleware');
const swaggerUi = require('swagger-ui-express');
const openapi = require('./docs/openapi');

const app = express();
app.use(cors({ origin: env.CLIENT_URL, credentials: true }));
app.use(express.json({ limit: '1mb' }));
app.use(cookieParser());
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(openapi));
app.use('/api/v1', apiRoutes);
const clientDist = path.resolve(__dirname, '../../client/dist');
app.use(express.static(clientDist));
app.get('*', (req, res, next) => {
	if (req.path.startsWith('/api/')) return next();
	return res.sendFile(path.join(clientDist, 'index.html'), (error) => error && next());
});
app.use((req, res) => res.status(404).json({ success: false, message: 'Endpoint no encontrado.' }));
app.use(errorHandler);

module.exports = app;