const express = require('express');
const router = express.Router();
const ClienteController = require('../controllers/ClienteController');
const auth = require('../middlewares/auth.middleware');

router.get('/Clientes', auth.isAuthenticated, ClienteController.getClientes);
router.get('/EditClient/:ID', auth.isAuthenticated, ClienteController.editCliente);
router.get('/buscar-records', auth.isAuthenticated, ClienteController.buscarRecords);

router.post('/AddClient', auth.isAuthenticated, ClienteController.addCliente);
router.post('/UpdateClient', auth.isAuthenticated, ClienteController.updateCliente);

module.exports = router;
