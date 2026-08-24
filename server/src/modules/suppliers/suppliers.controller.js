const service = require('./suppliers.service');
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

module.exports = { list, create };
