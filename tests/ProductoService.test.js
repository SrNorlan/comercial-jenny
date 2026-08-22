const ProductoService = require('../services/ProductoService');
const ProductoModel = require('../models/ProductoModel');

jest.mock('../models/ProductoModel');

describe('ProductoService', () => {
  it('debe obtener productos por categoría y formatear fecha', async () => {
    ProductoModel.findByCategoria.mockResolvedValue([
      { Fecha_Ingreso: '2023-04-01' }
    ]);

    const productos = await ProductoService.obtenerPorCategoria('Electrónica');
    expect(productos[0]).toHaveProperty('Fecha_Ingreso');
    expect(ProductoModel.findByCategoria).toHaveBeenCalledWith('Electrónica');
  });

  it('debe buscar un producto por categoría e ID', async () => {
    ProductoModel.findById.mockResolvedValue([
      { Fecha_Ingreso: '2023-04-01' }
    ]);

    const producto = await ProductoService.buscarProducto('Electrónica', 5);
    expect(producto).toHaveProperty('Fecha_Ingreso');
  });

  it('debe agregar producto', async () => {
    const data = { nombre: 'TV' };
    await ProductoService.agregar(data);
    expect(ProductoModel.insert).toHaveBeenCalledWith(data);
  });

  it('debe actualizar producto', async () => {
    const data = { nombre: 'Radio' };
    await ProductoService.actualizar(data);
    expect(ProductoModel.update).toHaveBeenCalledWith(data);
  });
});
