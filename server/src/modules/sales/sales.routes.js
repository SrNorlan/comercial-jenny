const router = require('express').Router();
const controller = require('./sales.controller');
const { verifyAuth } = require('../../middlewares/auth.middleware');
router.use(verifyAuth);
router.get('/', controller.list);
router.get('/:id/invoice', controller.invoice);
router.post('/', controller.create);
module.exports = router;
