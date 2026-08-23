function validationError(message) {
  const error = new Error(message);
  error.statusCode = 400;
  return error;
}

function requirePositiveNumber(value, field) {
  if (!Number.isFinite(Number(value)) || Number(value) <= 0) {
    throw validationError(`${field} debe ser un número mayor que cero.`);
  }
}

function requirePositiveInteger(value, field) {
  if (!Number.isInteger(Number(value)) || Number(value) <= 0) {
    throw validationError(`${field} debe ser un entero mayor que cero.`);
  }
}

function requireNonNegativeNumber(value, field) {
  if (!Number.isFinite(Number(value)) || Number(value) < 0) {
    throw validationError(`${field} debe ser un número mayor o igual que cero.`);
  }
}

function validateItems(items, type) {
  if (!Array.isArray(items) || items.length === 0) {
    throw validationError(`La ${type} debe incluir productos.`);
  }
  items.forEach((item) => {
    requirePositiveInteger(item.idProducto, 'El producto');
    requirePositiveInteger(item.cantidad, 'La cantidad');
    requirePositiveNumber(type === 'venta' ? item.precioUnitario : item.precioCompra, 'El precio');
    if (type === 'compra') requirePositiveNumber(item.precioVenta, 'El precio de venta');
  });
}

module.exports = { validationError, requirePositiveNumber, requirePositiveInteger, requireNonNegativeNumber, validateItems };
