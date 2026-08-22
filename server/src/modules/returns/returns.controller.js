const service = require('./returns.service');
async function create(req, res, next) { try { res.status(201).json({ success: true, data: await service.create(req.body) }); } catch (error) { next(error); } }
module.exports = { create };