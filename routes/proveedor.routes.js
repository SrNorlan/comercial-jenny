const express = require('express');
const router = express.Router();
const ProveedorController = require('../controllers/ProveedorController');
const auth = require('../middlewares/auth.middleware');

router.get('/Proveedores', auth.isAuthenticated, auth.isGerente, ProveedorController.getProveedores);
router.get('/EditProveedor/:ID', auth.isAuthenticated, ProveedorController.editProveedor);
router.post('/AddProveedor', auth.isAuthenticated, ProveedorController.addProveedor);

module.exports = router;
