const express = require('express');
const router = express.Router();
const CompraController = require('../controllers/CompraController');
const auth = require('../middlewares/auth.middleware');

router.get('/Compras', auth.isAuthenticated, auth.isGerente, CompraController.vistaCompras);
router.post('/AddCompra', auth.isAuthenticated, CompraController.addCompra);

router.get('/buscar-prov', auth.isAuthenticated, auth.isGerente, CompraController.buscarProveedor);
router.get('/buscar-gerente', auth.isAuthenticated, auth.isGerente, CompraController.buscarGerente);
router.get('/buscar-detallecompra', auth.isAuthenticated, auth.isGerente, CompraController.buscarDetalleCompra);
router.get('/buscar-Compra', auth.isAuthenticated, auth.isGerente, CompraController.buscarCompra);

module.exports = router;
