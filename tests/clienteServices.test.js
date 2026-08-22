jest.mock('../models/ClienteModel');
const ClienteModel = require('../models/ClienteModel');
const ClienteService = require('../services/ClienteService');

describe('ClienteService', () => {
  beforeEach(() => jest.clearAllMocks());

  test('obtenerClientes devuelve resultado', async () => {
    ClienteModel.findAll.mockResolvedValue([{ id: 1 }]);
    const res = await ClienteService.obtenerClientes();
    expect(res).toEqual([{ id: 1 }]);
  });

  test('obtenerClientePorId llama al modelo', async () => {
    await ClienteService.obtenerClientePorId(5);
    expect(ClienteModel.findById).toHaveBeenCalledWith(5);
  });

  test('obtenerRecordCrediticio formatea fechas', async () => {
    ClienteModel.getRecords.mockResolvedValue([
      { Fecha_Compra: '2024-01-01' }
    ]);
    const res = await ClienteService.obtenerRecordCrediticio(1);
    expect(res[0].Fecha_Compra).toMatch(/^\d{2} de/);
  });

  test('agregarCliente llama al insert', async () => {
    const cliente = { nombre: 'Juan' };
    await ClienteService.agregarCliente(cliente);
    expect(ClienteModel.insert).toHaveBeenCalledWith(cliente);
  });

  test('actualizarCliente llama al update', async () => {
    await ClienteService.actualizarCliente({ id: 1 }, 'tipo', 'comercio');
    expect(ClienteModel.update).toHaveBeenCalledWith({ id: 1 }, 'tipo', 'comercio');
  });
});
