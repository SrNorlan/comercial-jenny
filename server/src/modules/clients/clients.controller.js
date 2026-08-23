const service = require('./clients.service');

async function list(req, res, next) { try { res.json({ success: true, data: await service.list() }); } catch (e) { next(e); } }
async function get(req, res, next) {
  try { const client = await service.getById(req.params.id); if (!client) return res.status(404).json({ success: false, message: 'Cliente no encontrado.' }); return res.json({ success: true, data: client }); } catch (e) { next(e); }
}
async function creditHistory(req, res, next) { try { res.json({ success: true, data: await service.creditHistory(req.params.id) }); } catch (e) { next(e); } }
async function create(req, res, next) { try { res.status(201).json({ success: true, data: await service.create(req.body) }); } catch (e) { next(e); } }
async function update(req, res, next) { try { res.json({ success: true, data: await service.update(req.params.id, req.body) }); } catch (e) { next(e); } }
async function updateStatus(req, res, next) { try { res.json({ success: true, data: await service.updateStatus(req.params.id, req.body.estado) }); } catch (e) { next(e); } }

module.exports = { list, get, creditHistory, create, update, updateStatus };