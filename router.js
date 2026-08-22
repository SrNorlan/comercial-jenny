const express = require('express');
const router = express.Router();

// Importación de rutas por módulos
router.use('/', require('./routes/cliente.routes'));
router.use('/', require('./routes/colaborador.routes'));
router.use('/', require('./routes/producto.routes'));
router.use('/', require('./routes/proveedor.routes'));
router.use('/', require('./routes/abono.routes'));
router.use('/', require('./routes/venta.routes'));
router.use('/', require('./routes/compra.routes'));

// Rutas básicas (login, register, inicio, respaldar)
router.use('/', require('./routes/auth.routes'));
router.use('/', require('./routes/home.routes'));
router.use('/', require('./routes/reporte.routes'));



//Ruta raíz
router.get('/inicio', (req, res) => res.render('inicio'));
router.get ("/", (req, res) => { res.redirect("inicio");});


module.exports = router;
