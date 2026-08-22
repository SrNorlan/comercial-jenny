const AuthController = require('../controllers/AuthController');
const AuthService = require('../services/AuthService');
jest.mock('../services/AuthService');

describe('AuthController', () => {
  let req, res;

  beforeEach(() => {
    req = {
      body: {},
      cookies: {},
      user: {}
    };
    res = {
      render: jest.fn(),
      redirect: jest.fn(),
      cookie: jest.fn(),
      clearCookie: jest.fn()
    };
  });

  test('showLogin should render login view', () => {
    AuthController.showLogin(req, res);
    expect(res.render).toHaveBeenCalledWith('login');
  });

  test('login should handle missing credentials', async () => {
    req.body = {};
    await AuthController.login(req, res);
    expect(res.render).toHaveBeenCalledWith('login', expect.objectContaining({ alert: true }));
  });

  test('login should handle incorrect login', async () => {
    req.body = { user: 'user', pass: 'pass' };
    AuthService.login.mockResolvedValue({ success: false, message: 'Error' });
    await AuthController.login(req, res);
    expect(res.render).toHaveBeenCalledWith('login', expect.objectContaining({ alertIcon: 'error' }));
  });

  test('login should set cookie and redirect to dashboard', async () => {
    req.body = { user: 'user', pass: 'pass' };
    AuthService.login.mockResolvedValue({ success: true, token: 'token', cookieOptions: {} });
    await AuthController.login(req, res);
    expect(res.cookie).toHaveBeenCalledWith('jwt', 'token', {});
    expect(res.redirect).toHaveBeenCalledWith('/inicio');
  });

  test('logout should clear cookie and redirect', () => {
    AuthController.logout(req, res);
    expect(res.clearCookie).toHaveBeenCalledWith('jwt');
    expect(res.redirect).toHaveBeenCalledWith('/login');
  });

});
