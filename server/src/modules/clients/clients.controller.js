const service = require('./clients.service');
const { normalizeListResponse } = require('../../utils/pagination');

async function list(req, res, next) {
  try {
    const page = Number(req.query.page || 1);
    const limit = Number(req.query.limit || 10);
    const result = await service.list(req.user, { page, limit });
    return res.json(normalizeListResponse(result, page, limit));
  } catch (e) {
    next(e);
  }
}
async function get(req, res, next) {
  try {
    const client = await service.getById(req.params.id, req.user);
    if (!client) return res.status(404).json({ success: false, message: 'Cliente no encontrado.' });
    return res.json({ success: true, data: client });
  } catch (e) {
    next(e);
  }
}
async function creditHistory(req, res, next) {
  try {
    res.json({ success: true, data: await service.creditHistory(req.params.id, req.user) });
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
async function update(req, res, next) {
  try {
    res.json({ success: true, data: await service.update(req.params.id, req.body, req.user) });
  } catch (e) {
    next(e);
  }
}
async function updateStatus(req, res, next) {
  try {
    res.json({ success: true, data: await service.updateStatus(req.params.id, req.body.estado, req.user) });
  } catch (e) {
    next(e);
  }
}

module.exports = { list, get, creditHistory, create, update, updateStatus };
