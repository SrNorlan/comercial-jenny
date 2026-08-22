const router = require('express').Router();
const db = require('../../config/db');
const { verifyAuth } = require('../../middlewares/auth.middleware');
router.use(verifyAuth);
router.get('/summary', async (req, res, next) => {
  try {
    const [clients, products, sales, credit] = await Promise.all([
      db.query("SELECT COUNT(*)::int AS total FROM persona WHERE tipo_persona = 'Cliente'"),
      db.query('SELECT COUNT(*)::int AS total, COALESCE(SUM(existencia), 0)::int AS stock FROM productos'),
      db.query('SELECT COUNT(*)::int AS total, COALESCE(SUM(total_venta), 0) AS amount FROM venta WHERE fecha_venta >= date_trunc(\'month\', CURRENT_DATE)'),
      db.query('SELECT COALESCE(SUM(saldo_restante), 0) AS outstanding FROM showventascredito'),
    ]);
    res.json({ success: true, data: { clients: clients.rows[0], products: products.rows[0], sales: sales.rows[0], credit: credit.rows[0] } });
  } catch (error) { next(error); }
});
module.exports = router;