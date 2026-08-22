const express = require('express');
const router = express.Router();
const ColaboradorController = require('../controllers/ColaboradorController');
const auth = require('../middlewares/auth.middleware');

router.get('/Colaboradores', auth.isAuthenticated, auth.isGerente, ColaboradorController.getColaboradores);
router.get('/EditColaborador/:ID', auth.isAuthenticated, auth.isGerente, ColaboradorController.editColaborador);
router.post('/AddColaborador', auth.isAuthenticated, ColaboradorController.addColaborador);
router.post('/UpdateColaborador', auth.isAuthenticated, ColaboradorController.updateColaborador);

module.exports = router;
