const service = require('./reports.service');

async function summary(req, res, next) {
  try {
    res.json({ success: true, data: await service.summary() });
  } catch (error) {
    next(error);
  }
}

module.exports = { summary };
