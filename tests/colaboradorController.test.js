const ColaboradorController = require('../controllers/ColaboradorController');
const ColaboradorService = require('../services/ColaboradorService');

jest.mock('../services/ColaboradorService');

describe('ColaboradorController', () => {
  let req, res;

  beforeEach(() => {
    req = {
      body: {},
      params: {},
      cookies: {},
      user: { Rol: 'Admin' },
    };
    res = {
      render: jest.fn(),
      redirect: jest.fn(),
      clearCookie: jest.fn(),
      cookie: jest.fn(),
    };
  });

  test('getColaboradores - should render vendedores with data and clear errorMessage cookie', async () => {
    const mockColaboradores = [{ id: 1, nombre: 'Pedro' }];
    req.cookies.errorMessage = 'Some error';
    ColaboradorService.obtenerTodos.mockResolvedValue(mockColaboradores);

    await ColaboradorController.getColaboradores(req, res);

    expect(res.clearCookie).toHaveBeenCalledWith('errorMessage');
    expect(res.render).toHaveBeenCalledWith('vendedores', {
      vendedores: mockColaboradores,
      Mensaje: 'Some error',
      UserRol: 'Admin',
    });
  });

  test('editColaborador - should render editvendedor with selected colaborador', async () => {
    const mockColaborador = { id: 1, nombre: 'Luis' };
    req.params.ID = 1;
    ColaboradorService.obtenerPorId.mockResolvedValue(mockColaborador);

    await ColaboradorController.editColaborador(req, res);

    expect(res.clearCookie).toHaveBeenCalledWith('errorMessage');
    expect(res.render).toHaveBeenCalledWith('editvendedor', {
      vendedor: mockColaborador,
      UserRol: 'Admin',
    });
  });

  test('addColaborador - should add colaborador and render vendedores with success alert', async () => {
    req.body = {
      uservd: 'usuario123',
      Cedula_vd: '12345678',
    };
    ColaboradorService.agregar.mockResolvedValue({
      usuario: 'usuario123',
      cedula: '12345678',
    });
    ColaboradorService.obtenerTodos.mockResolvedValue([]);

    await ColaboradorController.addColaborador(req, res);

    expect(res.cookie).toHaveBeenCalledWith('username', 'usuario123', { httpOnly: true });
    expect(res.cookie).toHaveBeenCalledWith('cedula', '12345678', { httpOnly: true });
    expect(res.render).toHaveBeenCalledWith('vendedores', expect.objectContaining({
      alert: true,
      alertTitle: 'Colaborador agregado',
      alertMessage: expect.stringContaining('correctamente'),
      alertIcon: 'success',
      ruta: 'register',
      UserRol: 'Admin',
    }));
  });

  test('addColaborador - should handle error and render vendedores with error alert', async () => {
    ColaboradorService.agregar.mockRejectedValue(new Error('DB Error'));
    ColaboradorService.obtenerTodos.mockResolvedValue([]);

    await ColaboradorController.addColaborador(req, res);

    expect(res.render).toHaveBeenCalledWith('vendedores', expect.objectContaining({
      alertIcon: 'error',
      ruta: 'colaboradores',
      UserRol: 'Admin',
    }));
  });

  test('updateColaborador - should update and render vendedores with success alert', async () => {
    ColaboradorService.actualizar.mockResolvedValue();
    ColaboradorService.obtenerTodos.mockResolvedValue([]);

    await ColaboradorController.updateColaborador(req, res);

    expect(res.render).toHaveBeenCalledWith('vendedores', expect.objectContaining({
      alertIcon: 'success',
      ruta: 'colaboradores',
      UserRol: 'Admin',
    }));
  });

  test('updateColaborador - should handle error and render vendedores with error alert', async () => {
    ColaboradorService.actualizar.mockRejectedValue(new Error('DB Error'));
    ColaboradorService.obtenerTodos.mockResolvedValue([]);

    await ColaboradorController.updateColaborador(req, res);

    expect(res.render).toHaveBeenCalledWith('vendedores', expect.objectContaining({
      alertIcon: 'error',
      ruta: 'colaboradores',
      UserRol: 'Admin',
    }));
  });
});
