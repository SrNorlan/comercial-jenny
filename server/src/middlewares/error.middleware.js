function errorHandler(error, req, res, next) {
  if (res.headersSent) return next(error);
  const status = error.statusCode || (error.code === '23505' ? 409 : 500);
  const message = status === 500 ? 'Error interno del servidor.' : error.message;
  if (status === 500) console.error(error);
  res.status(status).json({ success: false, message });
}

module.exports = errorHandler;
