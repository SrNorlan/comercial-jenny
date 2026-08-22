jest.mock('../models/AbonoModel');
const AbonoModel = require('../models/AbonoModel');
const AbonoService = require('../services/AbonoService');

describe('AbonoService', () => {
  beforeEach(() => jest.clearAllMocks());

  test('obtenerVentasCredito formatea fechas correctamente', async () => {
    AbonoModel.getVentasCredito.mockResolvedValue([
      { Fecha_Venta: '2023-01-01', Plazo_Compra: '2023-01-10' }
    ]);

    const result = await AbonoService.obtenerVentasCredito();

    expect(result[0].Fecha_Venta).toMatch(/^\d{2} de/);
    expect(result[0].Plazo_Compra).toMatch(/^\d{2} de/);
  });

  test('agregar llama al modelo insert', async () => {
    const data = { valor: 100 };
    await AbonoService.agregar(data);
    expect(AbonoModel.insert).toHaveBeenCalledWith(data);
  });

  test('buscarPorVenta devuelve fechas formateadas', async () => {
    AbonoModel.findByVenta.mockResolvedValue([
      { Fecha_Abono: '2024-05-01' }
    ]);

    const result = await AbonoService.buscarPorVenta(1);
    expect(result[0].Fecha_Abono).toMatch(/^\d{2} de/);
  });
});
