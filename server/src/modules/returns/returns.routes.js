const router = require('express').Router();
const controller = require('./returns.controller');
const { verifyAuth } = require('../../middlewares/auth.middleware');
router.use(verifyAuth);
router.get('/', controller.list);
router.post('/', controller.create);
module.exports = router;
