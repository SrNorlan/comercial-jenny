const router = require('express').Router();
const controller = require('./clients.controller');
const { verifyAuth } = require('../../middlewares/auth.middleware');
router.use(verifyAuth);
router.get('/', controller.list);
router.get('/:id', controller.get);
router.get('/:id/credit-history', controller.creditHistory);
module.exports = router;