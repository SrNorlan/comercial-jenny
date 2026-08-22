const service = require('./clients.service');

async function list(req, res, next) { try { res.json({ success: true, data: await service.list() }); } catch (e) { next(e); } }
async function get(req, res, next) {
  try { const client = await service.getById(req.params.id); if (!client) return res.status(404).json({ success: false, message: 'Cliente no encontrado.' }); return res.json({ success: true, data: client }); } catch (e) { next(e); }
}
async function creditHistory(req, res, next) { try { res.json({ success: true, data: await service.creditHistory(req.params.id) }); } catch (e) { next(e); } }

module.exports = { list, get, creditHistory };