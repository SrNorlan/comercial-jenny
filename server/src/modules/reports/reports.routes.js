const router = require('express').Router();
const controller = require('./reports.controller');
const { verifyAuth } = require('../../middlewares/auth.middleware');
router.use(verifyAuth);
router.get('/summary', controller.summary);
module.exports = router;
