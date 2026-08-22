const router = require('express').Router();
const controller = require('./returns.controller');
const { verifyAuth } = require('../../middlewares/auth.middleware');
router.use(verifyAuth);
router.post('/', controller.create);
module.exports = router;