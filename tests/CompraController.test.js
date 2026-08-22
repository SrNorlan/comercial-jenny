const CompraController = require('../controllers/CompraController');
const CompraService = require('../services/CompraService');

jest.mock('../services/CompraService');

describe('CompraController', () => {
  let req, res;

  beforeEach(() => {
    req = {
      body: {},
      query: {},
      cookies: {},
      user: { Rol: 'Gerente' }
    };
    res = {
      render: jest.fn(),
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
      clearCookie: jest.fn()
    };
  });

  test('vistaCompras debe renderizar la vista con datos de compras', async () => {
    CompraService.obtenerVistaCompras.mockResolvedValue([['compra1'], ['producto1'], ['proveedor1'], ['gerente1']]);

    await CompraController.vistaCompras(req, res);

    expect(res.render).toHaveBeenCalledWith('compras', expect.objectContaining({
      productos: ['producto1'],
      compras: ['compra1'],
      proveedores: ['proveedor1'],
      gerentes: ['gerente1'],
      UserRol: 'Gerente'
    }));
  });

  test('addCompra debe responder con éxito si se agrega la compra', async () => {
    CompraService.insertarCompra.mockResolvedValue();

    await CompraController.addCompra(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ success: true, message: 'Compra agregada correctamente' });
  });

  test('buscarProveedor debe devolver el nombre del proveedor', async () => {
    req.query.cedula = '123';
    CompraService.buscarPersonaPorCedula.mockResolvedValue({ Nombre: 'Juan', Apellido: 'Perez', Comercio: 'JP' });

    await CompraController.buscarProveedor(req, res);

    expect(res.json).toHaveBeenCalledWith({ nombreProveedor: 'Juan Perez', comercio: 'JP' });
  });

  test('buscarGerente debe devolver el nombre del gerente', async () => {
    req.query.cedula = '456';
    CompraService.buscarPersonaPorCedula.mockResolvedValue({ Nombre: 'Ana', Apellido: 'Lopez' });

    await CompraController.buscarGerente(req, res);

    expect(res.json).toHaveBeenCalledWith({ nombreGerente: 'Ana Lopez' });
  });

  test('buscarDetalleCompra debe devolver los detalles de la compra', async () => {
    req.query.id = '1';
    CompraService.obtenerDetalleCompra.mockResolvedValue(['detalle1']);

    await CompraController.buscarDetalleCompra(req, res);

    expect(res.json).toHaveBeenCalledWith({ DetallesCompra: ['detalle1'] });
  });

  test('buscarCompra debe devolver la información de la compra', async () => {
    req.query.id = '1';
    CompraService.obtenerInfoCompra.mockResolvedValue({ id: 1 });

    await CompraController.buscarCompra(req, res);

    expect(res.json).toHaveBeenCalledWith({ Info: { id: 1 } });
  });
});
