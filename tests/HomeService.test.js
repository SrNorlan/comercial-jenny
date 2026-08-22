const HomeController = require('../controllers/HomeController');
const HomeService = require('../services/HomeService');

jest.mock('../services/HomeService');

describe('HomeController', () => {
  let req;
  let res;

  beforeEach(() => {
    req = {
      user: {
        NombreUsuario: 'kenth060',
        Rol: 'Gerente',
        Id_Persona: 1
      },
      cookies: {
        errorMessage: 'Hubo un error',
        successMessage: 'Respaldo exitoso',
        registerMessage: 'Usuario creado'
      }
    };

    res = {
      render: jest.fn(),
      clearCookie: jest.fn(),
      redirect: jest.fn()
    };
  });

  it('debe renderizar el dashboard con datos y mensajes de cookies', async () => {
    const mockData = {
      VentaContado: [],
      VentaCredito: [],
      Ingresos: 'C$ 0',
      Productos: 10,
      No_Clientes: 5,
      Ventas: [],
      Egresos: 0,
      Vendedores: []
    };

    HomeService.cargarEstadisticas.mockResolvedValue(mockData);

    await HomeController.showDashboard(req, res);

    expect(HomeService.cargarEstadisticas).toHaveBeenCalledWith(req.user);

    expect(res.clearCookie).toHaveBeenCalledWith('errorMessage');
    expect(res.clearCookie).toHaveBeenCalledWith('successMessage');
    expect(res.clearCookie).toHaveBeenCalledWith('registerMessage');

    expect(res.render).toHaveBeenCalledWith('inicio', expect.objectContaining({
      ...mockData,
      usuario: 'kenth060',
      UserRol: 'Gerente',
      Mensaje: 'Hubo un error',
      MensajeRespaldo: 'Respaldo exitoso',
      MensajeRegistro: 'Usuario creado'
    }));
  });

  it('debe redirigir a /login si ocurre un error', async () => {
    HomeService.cargarEstadisticas.mockRejectedValue(new Error('DB error'));

    await HomeController.showDashboard(req, res);

    expect(res.redirect).toHaveBeenCalledWith('/login');
  });
});
