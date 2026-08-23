const router = require('express').Router();
const controller = require('./suppliers.controller');
const { verifyAuth } = require('../../middlewares/auth.middleware');
const { requireRole } = require('../../middlewares/role.middleware');
router.use(verifyAuth);
router.get('/', controller.list);
router.post('/', requireRole('Gerente'), controller.create);
module.exports = router;