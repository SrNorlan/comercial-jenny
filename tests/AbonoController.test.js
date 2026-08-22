const AbonoController = require('../controllers/AbonoController');
const AbonoService = require('../services/AbonoService');

jest.mock('../services/AbonoService');

const mockRequest = (body = {}, query = {}, cookies = {}, user = {}) => ({ body, query, cookies, user });

const mockResponse = () => {
  const res = {};
  res.render = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  res.status = jest.fn().mockReturnValue(res);
  res.clearCookie = jest.fn().mockReturnValue(res);
  return res;
};

describe('AbonoController', () => 
{
  beforeAll(() => {
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => { jest.clearAllMocks(); });

  afterAll(() => {
    console.error.mockRestore();
  });

  test('vistaAbonos - debe renderizar la vista con ventas a crédito y mensaje', async () => 
  {
    const fakeVentasCredito = [{ id: 217581, cliente: 'Carlos' }];
    AbonoService.obtenerVentasCredito.mockResolvedValue(fakeVentasCredito);

    const req = mockRequest({}, {}, { errorMessage: 'Mensaje de error' }, { Rol: 'Admin' });
    const res = mockResponse();

    await AbonoController.vistaAbonos(req, res);

    expect(AbonoService.obtenerVentasCredito).toHaveBeenCalled();
    expect(res.clearCookie).toHaveBeenCalledWith('errorMessage');
    expect(res.render).toHaveBeenCalledWith('abonos', {
      Ventas_Credito: fakeVentasCredito,
      Mensaje: 'Mensaje de error',
      UserRol: 'Admin'
    });
  });

  test('agregarAbono - debe agregar un abono y renderizar la vista con éxito', async () => {
    AbonoService.agregar.mockResolvedValue();
    AbonoService.obtenerVentasCredito.mockResolvedValue([{ id: 217581 }]);

    const req = mockRequest({
      Id_Venta_Abono: 217581,
      Monto_Abono: 100,
      Fecha_Abono: '2025-05-04'
    }, {}, {}, { Rol: 'Admin' });

    const res = mockResponse();

    await AbonoController.agregarAbono(req, res);

    expect(AbonoService.agregar).toHaveBeenCalledWith({
      Id_Venta: 217581,
      Monto: 100,
      Fecha: '2025-05-04'
    });

    expect(res.render).toHaveBeenCalledWith('abonos', expect.objectContaining({
      alert: true,
      alertTitle: 'Abono Agregado',
      alertMessage: expect.stringContaining('ha sido agregado'),
      alertIcon: 'success',
      UserRol: 'Admin'
    }));
  });

  test('buscarAbonosPorVenta - debe devolver abonos en formato JSON', async () => {
    const abonosMock = [{ id: 217581, monto: 50 }];
    AbonoService.buscarPorVenta.mockResolvedValue(abonosMock);

    const req = mockRequest({}, { id: 10 });
    const res = mockResponse();

    await AbonoController.buscarAbonosPorVenta(req, res);

    expect(AbonoService.buscarPorVenta).toHaveBeenCalledWith(10);
    expect(res.json).toHaveBeenCalledWith({ Abonos: abonosMock });
  });

  test('buscarAbonosPorVenta - debe manejar errores con status 500', async () => 
  {
    AbonoService.buscarPorVenta.mockRejectedValue(new Error('Fallo'));

    const req = mockRequest({}, { id: 615147 });
    const res = mockResponse();

    await AbonoController.buscarAbonosPorVenta(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ error: 'Error al obtener abonos.' });
  });
});
