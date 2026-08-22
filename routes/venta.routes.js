const express = require('express');
const router = express.Router();
const VentaController = require('../controllers/VentaController');
const auth = require('../middlewares/auth.middleware');

router.get('/Ventas', auth.isAuthenticated, VentaController.getVentas);
router.get('/buscar-cliente', auth.isAuthenticated, VentaController.buscarCliente);
router.get('/buscar-vendedor', auth.isAuthenticated, VentaController.buscarVendedor);
router.get('/buscar-detalleventa', auth.isAuthenticated, VentaController.getDetalleVenta);
router.post('/AddVenta', auth.isAuthenticated, VentaController.addVenta);

module.exports = router;
