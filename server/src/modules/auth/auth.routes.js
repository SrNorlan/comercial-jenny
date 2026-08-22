const router = require('express').Router();
const controller = require('./auth.controller');
const { verifyAuth } = require('../../middlewares/auth.middleware');

router.post('/login', controller.login);
router.post('/logout', controller.logout);
router.get('/me', verifyAuth, controller.me);

module.exports = router;