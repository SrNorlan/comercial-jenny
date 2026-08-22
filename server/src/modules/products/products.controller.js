const service = require('./products.service');
async function list(req, res, next) { try { res.json({ success: true, data: await service.list(req.query.categoria) }); } catch (e) { next(e); } }
async function get(req, res, next) { try { const product = await service.getById(req.params.id); if (!product) return res.status(404).json({ success: false, message: 'Producto no encontrado.' }); return res.json({ success: true, data: product }); } catch (e) { next(e); } }
module.exports = { list, get };