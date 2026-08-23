jest.mock('../server/src/modules/auth/auth.service');
jest.mock('../server/src/modules/clients/clients.service');
jest.mock('../server/src/modules/products/products.service');
jest.mock('../server/src/modules/sales/sales.service');
jest.mock('../server/src/modules/purchases/purchases.service');
jest.mock('../server/src/modules/installments/installments.service');
jest.mock('../server/src/modules/returns/returns.service');
jest.mock('../server/src/modules/employees/employees.service');
jest.mock('../server/src/modules/suppliers/suppliers.service');

const authService = require('../server/src/modules/auth/auth.service');
const clientsService = require('../server/src/modules/clients/clients.service');
const productsService = require('../server/src/modules/products/products.service');
const salesService = require('../server/src/modules/sales/sales.service');
const purchasesService = require('../server/src/modules/purchases/purchases.service');
const installmentsService = require('../server/src/modules/installments/installments.service');
const returnsService = require('../server/src/modules/returns/returns.service');
const employeesService = require('../server/src/modules/employees/employees.service');
const suppliersService = require('../server/src/modules/suppliers/suppliers.service');
const authController = require('../server/src/modules/auth/auth.controller');
const clientsController = require('../server/src/modules/clients/clients.controller');
const productsController = require('../server/src/modules/products/products.controller');
const salesController = require('../server/src/modules/sales/sales.controller');
const purchasesController = require('../server/src/modules/purchases/purchases.controller');
const installmentsController = require('../server/src/modules/installments/installments.controller');
const returnsController = require('../server/src/modules/returns/returns.controller');
const employeesController = require('../server/src/modules/employees/employees.controller');
const suppliersController = require('../server/src/modules/suppliers/suppliers.controller');
const { requireRole } = require('../server/src/middlewares/role.middleware');

function response() {
  const res = { status: jest.fn(), json: jest.fn(), cookie: jest.fn(), clearCookie: jest.fn() };
  res.status.mockReturnValue(res);
  return res;
}

describe('API REST migrada', () => {
  beforeEach(() => jest.clearAllMocks());

  test('inicia sesion y establece cookie JWT', async () => {
    authService.login.mockResolvedValue({ token: 'token', user: { usuario: 'demo', rol: 'Vendedor' } });
    const res = response();
    await authController.login({ body: { usuario: 'demo', contrasena: 'admin' } }, res, jest.fn());
    expect(res.cookie).toHaveBeenCalledWith('token', 'token', expect.any(Object));
    expect(res.json).toHaveBeenCalledWith({ success: true, data: { usuario: 'demo', rol: 'Vendedor' } });
  });

  test('lista clientes, productos, ventas, compras, devoluciones, colaboradores y proveedores', async () => {
    const cases = [
      ['clientes', clientsController, clientsService],
      ['productos', productsController, productsService],
      ['ventas', salesController, salesService],
      ['compras', purchasesController, purchasesService],
      ['devoluciones', returnsController, returnsService],
      ['colaboradores', employeesController, employeesService],
      ['proveedores', suppliersController, suppliersService],
    ];
    for (const [name, controller, service] of cases) {
      service.list.mockResolvedValue([{ id: 1 }]);
      const res = response();
      await controller.list({ query: {} }, res, jest.fn());
      if (!res.json.mock.calls.length) throw new Error(`El listado no respondio para ${name}`);
      expect(res.json).toHaveBeenCalledWith({ success: true, data: [{ id: 1 }] });
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ data: expect.any(Array) }));
      expect(name).toBeTruthy();
    }
  });

  test('lista creditos abiertos mediante el contrato de abonos', async () => {
    installmentsService.listOpenCredit.mockResolvedValue([{ id: 1 }]);
    const res = response();
    await installmentsController.list({}, res, jest.fn());
    expect(res.json).toHaveBeenCalledWith({ success: true, data: [{ id: 1 }] });
  });

  test('crea una venta y responde 201', async () => {
    salesService.create.mockResolvedValue({ id: 10 });
    const res = response();
    await salesController.create({ body: { idVenta: 10 } }, res, jest.fn());
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({ success: true, data: { id: 10 } });
  });

  test('rechaza a un usuario que no es gerente', () => {
    const next = jest.fn();
    const res = { status: jest.fn(), json: jest.fn() };
    res.status.mockReturnValue(res);
    requireRole('Gerente')({ user: { rol: 'Vendedor' } }, res, next);
    expect(res.status).toHaveBeenCalledWith(403);
    expect(next).not.toHaveBeenCalled();
  });
});
