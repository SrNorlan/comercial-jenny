// tests/clienteController.test.js
const ClienteController = require('../controllers/ClienteController');
const ClienteService = require('../services/ClienteService');

jest.mock('../services/ClienteService'); // <-- Esto es importante

describe('Cliente Controller', () => {
  let req;
  let res;

  beforeEach(() => {
    req = {
      user: {
        NombreUsuario: 'kenth060',
        Rol: 'Admin'
      },
      body: {},
      params: {},
      query: {}
    };

    res = {
      render: jest.fn(),
      json: jest.fn()
    };
  });

  test('getClientes - should render clientes view with data', async () => {
    const clientesMock = [{ id: 1, nombre: 'Kenneth' }];
    ClienteService.obtenerClientes.mockResolvedValue(clientesMock);

    await ClienteController.getClientes(req, res);

    expect(ClienteService.obtenerClientes).toHaveBeenCalled();
    expect(res.render).toHaveBeenCalledWith('clientes', {
      clientes: clientesMock,
      usuario: 'kenth060',
      UserRol: 'Admin'
    });
  });

  test('addCliente - should render clientes view after adding', async () => {
    req.body = {
      Nombre_cl: 'Kenneth',
      Apellido_cl: 'Silva'
    };

    const clientesMock = [{ id: 1, nombre: 'Kenneth' }];
    ClienteService.agregarCliente.mockResolvedValue();
    ClienteService.obtenerClientes.mockResolvedValue(clientesMock);

    await ClienteController.addCliente(req, res);

    expect(ClienteService.agregarCliente).toHaveBeenCalledWith(req.body);
    expect(ClienteService.obtenerClientes).toHaveBeenCalled();
    expect(res.render).toHaveBeenCalledWith('clientes', expect.objectContaining({
      clientes: clientesMock,
      alert: true,
      alertTitle: 'Cliente agregado',
      alertIcon: 'success',
      ruta: 'clientes',
      UserRol: 'Admin'
    }));
  });

  test('buscarRecords - should return JSON records', async () => {
    req.query.id = 99;
    const recordsMock = [{ Id_Cliente: 99, Fecha_Compra: '01 de mayo de 2024' }];
    ClienteService.obtenerRecordCrediticio.mockResolvedValue(recordsMock);

    await ClienteController.buscarRecords(req, res);

    expect(ClienteService.obtenerRecordCrediticio).toHaveBeenCalledWith(99);
    expect(res.json).toHaveBeenCalledWith({ Records: recordsMock });
  });

  test('editCliente - should render editClient with cliente data', async () => {
    req.params.ID = 10;
    const clienteMock = { id: 10, nombre: 'Test' };
    ClienteService.obtenerClientePorId.mockResolvedValue(clienteMock);

    await ClienteController.editCliente(req, res);

    expect(ClienteService.obtenerClientePorId).toHaveBeenCalledWith(10);
    expect(res.render).toHaveBeenCalledWith('editClient', {
      cliente: clienteMock,
      UserRol: 'Admin',
      tipo: 'Cliente'
    });
  });
});