const openapi = {
  openapi: '3.0.3',
  info: {
    title: 'Comercial Jenny API',
    version: '1.0.0',
    description: 'API REST para ventas, inventario, clientes y administracion comercial.',
  },
  servers: [{ url: '/api/v1', description: 'Servidor actual' }],
  tags: [
    { name: 'Autenticacion' },
    { name: 'Clientes' },
    { name: 'Productos' },
    { name: 'Ventas' },
    { name: 'Compras' },
    { name: 'Abonos' },
    { name: 'Devoluciones' },
    { name: 'Colaboradores' },
    { name: 'Proveedores' },
    { name: 'Reportes' },
  ],
  components: {
    securitySchemes: {
      bearerAuth: { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' },
    },
    schemas: {
      ApiResponse: { type: 'object', properties: { success: { type: 'boolean' }, data: {} } },
      Error: { type: 'object', properties: { success: { type: 'boolean', example: false }, message: { type: 'string' } } },
    },
  },
  security: [{ bearerAuth: [] }],
  paths: {
    '/health': { get: operation('Salud', 'Comprobar disponibilidad de la API', false) },
    '/auth/login': { post: operation('Autenticacion', 'Iniciar sesion', false) },
    '/auth/logout': { post: operation('Autenticacion', 'Cerrar sesion') },
    '/auth/me': { get: operation('Autenticacion', 'Consultar sesion actual') },
    '/clients': { get: operation('Clientes', 'Listar clientes'), post: operation('Clientes', 'Crear cliente') },
    '/clients/{id}': item('Clientes', 'Consultar cliente'),
    '/clients/{id}/credit-history': item('Clientes', 'Consultar historial de credito'),
    '/clients/{id}/status': { patch: operation('Clientes', 'Activar o desactivar cliente') },
    '/products': { get: operation('Productos', 'Listar productos'), post: operation('Productos', 'Crear producto') },
    '/products/{id}': item('Productos', 'Consultar producto'),
    '/products/{id}/status': { patch: operation('Productos', 'Activar o desactivar producto') },
    '/sales': collection('Ventas', 'Listar y registrar ventas'),
    '/purchases': collection('Compras', 'Listar y registrar compras'),
    '/installments': collection('Abonos', 'Listar y registrar abonos'),
    '/returns': collection('Devoluciones', 'Listar y registrar devoluciones'),
    '/employees': { get: operation('Colaboradores', 'Listar colaboradores'), post: operation('Colaboradores', 'Crear colaborador') },
    '/employees/{id}/status': { patch: operation('Colaboradores', 'Activar o desactivar colaborador') },
    '/suppliers': collection('Proveedores', 'Listar y registrar proveedores'),
    '/reports/summary': { get: operation('Reportes', 'Consultar resumen comercial') },
  },
};

function operation(tag, summary, secured = true) {
  const result = { tags: [tag], summary, responses: { 200: { description: 'Operacion exitosa' }, 201: { description: 'Registro creado' }, 400: { description: 'Solicitud invalida' }, 401: { description: 'No autenticado' }, 403: { description: 'Permisos insuficientes' } } };
  if (!secured) delete result.responses[401];
  return result;
}

function collection(tag, summary) {
  return { get: operation(tag, `Listar ${summary.toLowerCase()}`), post: operation(tag, summary) };
}

function item(tag, summary) {
  return { get: operation(tag, summary), put: operation(tag, `Actualizar ${summary.toLowerCase()}`) };
}

module.exports = openapi;
