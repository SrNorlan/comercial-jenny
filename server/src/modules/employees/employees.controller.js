const service = require('./employees.service');
const { normalizeListResponse } = require('../../utils/pagination');

async function list(req, res, next) {
  try {
    const page = Number(req.query.page || 1);
    const limit = Number(req.query.limit || 10);
    const result = await service.list({ page, limit });
    res.json(normalizeListResponse(result, page, limit));
  } catch (error) {
    next(error);
  }
}

async function create(req, res, next) {
  try {
    res.status(201).json({ success: true, data: await service.create(req.body) });
  } catch (error) {
    next(error);
  }
}
async function update(req, res, next) {
  try {
    res.json({ success: true, data: await service.update(req.params.id, req.body) });
  } catch (error) {
    next(error);
  }
}
async function updateStatus(req, res, next) {
  try {
    res.json({ success: true, data: await service.updateStatus(req.params.id, req.body.estado) });
  } catch (error) {
    next(error);
  }
}

module.exports = { list, create, update, updateStatus };
