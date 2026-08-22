const express = require('express');
const router = express.Router();
const AuthController = require('../controllers/AuthController');

router.get('/login', AuthController.showLogin);
router.post('/auth', AuthController.login);
router.get('/logout', AuthController.logout);
router.get('/register', AuthController.showRegister);
router.post('/register', AuthController.registerUser);

module.exports = router;
