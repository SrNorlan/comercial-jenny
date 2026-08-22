const express = require('express');
const router = express.Router();
const HomeController = require('../controllers/HomeController');
const auth = require('../middlewares/auth.middleware');

router.get('/inicio', auth.isAuthenticated, HomeController.showDashboard);
router.get('/respaldar', auth.isAuthenticated, auth.isGerente, HomeController.backupDatabase);

module.exports = router;
