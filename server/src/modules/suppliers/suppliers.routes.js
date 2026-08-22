const router = require('express').Router();
const db = require('../../config/db');
const { verifyAuth } = require('../../middlewares/auth.middleware');
router.use(verifyAuth);
router.get('/', async (req, res, next) => { try { const { rows } = await db.query('SELECT * FROM mostrarproveedores ORDER BY nombre'); res.json({ success: true, data: rows }); } catch (error) { next(error); } });
module.exports = router;