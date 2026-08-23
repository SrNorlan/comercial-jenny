const service = require('./suppliers.service');

async function list(req, res, next) { try { res.json({ success: true, data: await service.list() }); } catch (error) { next(error); } }
async function create(req, res, next) { try { res.status(201).json({ success: true, data: await service.create(req.body) }); } catch (error) { next(error); } }

module.exports = { list, create };
