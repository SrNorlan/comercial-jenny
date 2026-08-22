const express = require('express');
const router = express.Router();
const ProductoController = require('../controllers/ProductoController');
const auth = require('../middlewares/auth.middleware');

router.get('/Productos', auth.isAuthenticated, ProductoController.vistaProductos);
router.get('/ShowProducts/:categoria', auth.isAuthenticated, ProductoController.mostrarPorCategoria);
router.get('/EditProduct/:Cat/p/:IdProd', auth.isAuthenticated, auth.isGerente, ProductoController.editarProducto);

router.post('/AddProduct', auth.isAuthenticated, ProductoController.agregarProducto);
router.post('/UpdateProduct', auth.isAuthenticated, ProductoController.actualizarProducto);

module.exports = router;
