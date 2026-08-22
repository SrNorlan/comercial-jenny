const service = require('./sales.service');
async function list(req, res, next) { try { res.json({ success: true, data: await service.list() }); } catch (e) { next(e); } }
async function create(req, res, next) { try { res.status(201).json({ success: true, data: await service.create(req.body) }); } catch (e) { next(e); } }
module.exports = { list, create };