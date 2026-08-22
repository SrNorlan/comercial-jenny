const CompraService = require('../services/CompraService');
const CompraModel = require('../models/CompraModel');

jest.mock('../models/CompraModel');

describe('CompraService', () => {
  it('debe obtener vista de compras formateada', async () => {
    CompraModel.getCompras.mockResolvedValue([{ Fecha_Compra: '2023-05-01' }]);
    CompraModel.getProductos.mockResolvedValue(['prod1']);
    CompraModel.getProveedores.mockResolvedValue(['prov1']);
    CompraModel.getGerentes.mockResolvedValue(['ger1']);

    const resultado = await CompraService.obtenerVistaCompras();
    expect(resultado[0][0].Fecha_Compra).toContain('2023'); // depende de formato local
  });

  it('debe insertar una compra con productos', async () => {
    const data = { Id_Compra: 1, Productos: [{ id: 1 }] };
    await CompraService.insertarCompra(data);
    expect(CompraModel.insertCompra).toHaveBeenCalledWith(data);
    expect(CompraModel.insertDetalleCompra).toHaveBeenCalledWith(1, { id: 1 });
  });

  it('debe buscar persona por cédula y tipo', async () => {
    CompraModel.getPersonaByCedula.mockResolvedValue(['persona']);
    const resultado = await CompraService.buscarPersonaPorCedula('123', 'cliente');
    expect(resultado).toEqual(['persona']);
  });

  it('debe obtener detalle de compra', async () => {
    CompraModel.getDetalleCompra.mockResolvedValue(['detalle']);
    const resultado = await CompraService.obtenerDetalleCompra(1);
    expect(resultado).toEqual(['detalle']);
  });

  it('debe obtener info de compra', async () => {
    CompraModel.getInfoCompra.mockResolvedValue({ id: 1 });
    const resultado = await CompraService.obtenerInfoCompra(1);
    expect(resultado).toEqual({ id: 1 });
  });
});
