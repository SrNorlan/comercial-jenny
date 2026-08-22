const VentaController = require('../controllers/VentaController');
const VentaService = require('../services/VentaService');

jest.mock('../services/VentaService');

describe('VentaController', () => {
  let req, res;

  beforeEach(() => {
    req = {
      query: {},
      body: {},
      cookies: {},
      user: { Rol: 'Gerente' }
    };
    res = {
      render: jest.fn(),
      json: jest.fn(),
      status: jest.fn().mockReturnThis(),
      clearCookie: jest.fn()
    };
  });

  test('getVentas debe renderizar la vista ventas', async () => {
    VentaService.getDatosVista.mockResolvedValue([['venta1'], ['producto1'], ['cliente1'], ['vendedor1']]);

    await VentaController.getVentas(req, res);

    expect(res.render).toHaveBeenCalledWith('ventas', expect.objectContaining({
      ventas: ['venta1'],
      productos: ['producto1'],
      clientes: ['cliente1'],
      vendedores: ['vendedor1'],
      UserRol: 'Gerente'
    }));
  });

  test('buscarCliente debe devolver nombre si se encuentra', async () => {
    req.query.cedula = '123';
    VentaService.buscarPersonaPorCedula.mockResolvedValue('Carlos');

    await VentaController.buscarCliente(req, res);

    expect(res.json).toHaveBeenCalledWith({ nombreCliente: 'Carlos' });
  });

  test('buscarVendedor debe devolver nombre si se encuentra', async () => {
    req.query.cedula = '456';
    VentaService.buscarPersonaPorCedula.mockResolvedValue('Laura');

    await VentaController.buscarVendedor(req, res);

    expect(res.json).toHaveBeenCalledWith({ nombreVendedor: 'Laura' });
  });

  test('getDetalleVenta debe devolver los detalles de la venta', async () => {
    req.query.id = '789';
    VentaService.getDetalleVenta.mockResolvedValue(['detalle1']);

    await VentaController.getDetalleVenta(req, res);

    expect(res.json).toHaveBeenCalledWith({ DetallesVenta: ['detalle1'] });
  });

  test('addVenta debe responder con éxito', async () => {
    await VentaController.addVenta(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ success: true, message: 'Venta agregada correctamente' });
  });
});
