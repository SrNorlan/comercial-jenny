const ColaboradorService = require('../services/ColaboradorService');
const ColaboradorModel = require('../models/ColaboradorModel');

jest.mock('../models/ColaboradorModel');

describe('ColaboradorService', () => {
  it('debe obtener todos los colaboradores', async () => {
    ColaboradorModel.getAll.mockResolvedValue([{ id: 1, nombre: 'Pedro' }]);

    const resultado = await ColaboradorService.obtenerTodos();
    expect(resultado).toEqual([{ id: 1, nombre: 'Pedro' }]);
  });

  it('debe obtener colaborador por ID', async () => {
    ColaboradorModel.findById.mockResolvedValue({ id: 1, nombre: 'Ana' });

    const resultado = await ColaboradorService.obtenerPorId(1);
    expect(resultado).toEqual({ id: 1, nombre: 'Ana' });
  });

  it('debe agregar un colaborador y retornar usuario y cedula', async () => {
    const data = { uservd: 'juan123', Cedula_vd: '001-010101-0001A' };
    const resultado = await ColaboradorService.agregar(data);
    expect(resultado).toEqual({ usuario: 'juan123', cedula: '001-010101-0001A' });
    expect(ColaboradorModel.insert).toHaveBeenCalledWith(data);
  });

  it('debe actualizar un colaborador', async () => {
    const data = { nombre: 'Ana' };
    await ColaboradorService.actualizar(data);
    expect(ColaboradorModel.update).toHaveBeenCalledWith(data);
  });
});
