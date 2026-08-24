const service = require('./products.service');
const { normalizeListResponse } = require('../../utils/pagination');

async function list(req, res, next) {
  try {
    const page = Number(req.query.page || 1);
    const limit = Number(req.query.limit || 10);
    const result = await service.list(req.query.categoria, { page, limit });
    res.json(normalizeListResponse(result, page, limit));
  } catch (e) {
    next(e);
  }
}

async function get(req, res, next) {
  try {
    const product = await service.getById(req.params.id);
    if (!product)
      return res.status(404).json({ success: false, message: 'Producto no encontrado.' });
    return res.json({ success: true, data: product });
  } catch (e) {
    next(e);
  }
}
async function create(req, res, next) {
  try {
    res.status(201).json({ success: true, data: await service.create(req.body) });
  } catch (e) {
    next(e);
  }
}
async function update(req, res, next) {
  try {
    res.json({ success: true, data: await service.update(req.params.id, req.body) });
  } catch (e) {
    next(e);
  }
}
async function updateStatus(req, res, next) {
  try {
    res.json({
      success: true,
      data: await service.updateStatus(req.params.id, req.body.estadoProducto),
    });
  } catch (e) {
    next(e);
  }
}
module.exports = { list, get, create, update, updateStatus };
