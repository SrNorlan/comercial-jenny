const service = require('./installments.service');

async function list(req, res, next) {
  try {
    const result = await service.listOpenCredit(req.user);
    res.json({ success: true, data: Array.isArray(result) ? result : [] });
  } catch (error) {
    next(error);
  }
}
async function create(req, res, next) {
  try {
    res.status(201).json({ success: true, data: await service.create(req.body, req.user) });
  } catch (error) {
    next(error);
  }
}
module.exports = { list, create };
