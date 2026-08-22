const router = require('express').Router();
const controller = require('./products.controller');
const { verifyAuth } = require('../../middlewares/auth.middleware');
router.use(verifyAuth);
router.get('/', controller.list);
router.get('/:id', controller.get);
module.exports = router;