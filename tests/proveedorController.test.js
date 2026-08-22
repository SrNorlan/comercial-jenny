const ProveedorController = require('../controllers/ProveedorController');
const ProveedorService = require('../services/ProveedorService');

jest.mock('../services/ProveedorService');

describe('ProveedorController', () => {
  let req, res;

  beforeEach(() => {
    req = {
      params: {},
      body: {},
      cookies: {},
      user: { Rol: 'Gerente' }
    };
    res = {
      render: jest.fn(),
      clearCookie: jest.fn()
    };
  });

  test('getProveedores debe renderizar la vista con proveedores', async () => {
    ProveedorService.obtenerTodos.mockResolvedValue(['prov1']);

    await ProveedorController.getProveedores(req, res);

    expect(res.render).toHaveBeenCalledWith('Proveedores', expect.objectContaining({
      proveedores: ['prov1'],
      UserRol: 'Gerente'
    }));
  });

  test('editProveedor debe renderizar la vista de edición', async () => {
    req.params.ID = '1';
    ProveedorService.obtenerPorId.mockResolvedValue({ Nombre: 'Pedro' });

    await ProveedorController.editProveedor(req, res);

    expect(res.render).toHaveBeenCalledWith('editClient', expect.objectContaining({
      cliente: { Nombre: 'Pedro' },
      tipo: 'Proveedor'
    }));
  });

  test('addProveedor debe renderizar con alerta de éxito', async () => {
    ProveedorService.obtenerTodos.mockResolvedValue(['prov1']);
    ProveedorService.insertar.mockResolvedValue();

    await ProveedorController.addProveedor(req, res);

    expect(res.render).toHaveBeenCalledWith('Proveedores', expect.objectContaining({
      alertTitle: 'Proveedor agregado',
      alertIcon: 'success'
    }));
  });

  test('addProveedor debe manejar errores y renderizar con alerta de fallo', async () => {
    ProveedorService.insertar.mockRejectedValue(new Error('fallo'));
    ProveedorService.obtenerTodos.mockResolvedValue(['prov1']);

    await ProveedorController.addProveedor(req, res);

    expect(res.render).toHaveBeenCalledWith('Proveedores', expect.objectContaining({
      alertIcon: 'error',
      alertTitle: 'No se pudo completar la operación'
    }));
  });
});
