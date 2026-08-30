const service = require('./sales.service');
const { normalizeListResponse } = require('../../utils/pagination');
const { buildFacturaVenta } = require('../../../../pdf/ReportePDFBuilder');

async function list(req, res, next) {
  try {
    const page = Number(req.query.page || 1);
    const limit = Number(req.query.limit || 10);
    const result = await service.list(req.user, { page, limit });
    res.json(normalizeListResponse(result, page, limit));
  } catch (e) {
    next(e);
  }
}
async function create(req, res, next) {
  try {
    res.status(201).json({ success: true, data: await service.create(req.body, req.user) });
  } catch (e) {
    next(e);
  }
}
async function invoice(req, res, next) {
  try {
    const venta = await service.invoice(Number(req.params.id), req.user);
    const chunks = [];
    buildFacturaVenta(
      (chunk) => chunks.push(chunk),
      () => {
        res.set({
          'Content-Type': 'application/pdf',
          'Content-Disposition': `attachment; filename="factura-${venta.id_venta}.pdf"`,
        });
        res.send(Buffer.concat(chunks));
      },
      venta,
    );
  } catch (e) {
    next(e);
  }
}
module.exports = { list, create, invoice };
