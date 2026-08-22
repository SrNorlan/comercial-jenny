// src/routes/reporte.routes.js
const express = require('express');
const router = express.Router();
const ReporteController = require('../controllers/ReporteController');

router.post('/ReporteVentas', ReporteController.generarReporteVentas);
router.post('/ReporteCompras', ReporteController.generarReporteCompras);
router.post('/ReporteVendedor', ReporteController.generarReporteVendedor);
router.get('/ReporteClientesDeuda', ReporteController.generarReporteMorosos);

module.exports = router;
