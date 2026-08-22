const express = require('express');
const router = express.Router();
const AbonoController = require('../controllers/AbonoController');
const auth = require('../middlewares/auth.middleware');

router.get('/Abonos', auth.isAuthenticated, AbonoController.vistaAbonos);
router.post('/AddAbono', auth.isAuthenticated, AbonoController.agregarAbono);
router.get('/buscar-abonos', auth.isAuthenticated, AbonoController.buscarAbonosPorVenta);


module.exports = router;
