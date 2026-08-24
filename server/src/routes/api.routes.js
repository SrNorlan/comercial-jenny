const router = require('express').Router();
const authRoutes = require('../modules/auth/auth.routes');
const clientsRoutes = require('../modules/clients/clients.routes');
const productsRoutes = require('../modules/products/products.routes');
const salesRoutes = require('../modules/sales/sales.routes');
const purchasesRoutes = require('../modules/purchases/purchases.routes');
const installmentsRoutes = require('../modules/installments/installments.routes');
const returnsRoutes = require('../modules/returns/returns.routes');
const employeesRoutes = require('../modules/employees/employees.routes');
const suppliersRoutes = require('../modules/suppliers/suppliers.routes');
const reportsRoutes = require('../modules/reports/reports.routes');

router.get('/health', (req, res) =>
  res.json({ success: true, data: { service: 'comercial-jenny-api', status: 'ok' } }),
);
router.use('/auth', authRoutes);
router.use('/clients', clientsRoutes);
router.use('/products', productsRoutes);
router.use('/sales', salesRoutes);
router.use('/purchases', purchasesRoutes);
router.use('/installments', installmentsRoutes);
router.use('/returns', returnsRoutes);
router.use('/employees', employeesRoutes);
router.use('/suppliers', suppliersRoutes);
router.use('/reports', reportsRoutes);

module.exports = router;
