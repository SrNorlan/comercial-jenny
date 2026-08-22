// tests/authService.test.js
jest.mock('bcryptjs');
jest.mock('jsonwebtoken');

// Creamos un mock explícito de la función query
const mockQuery = jest.fn();

// Ahora sí mockeamos el módulo db
jest.mock('../config/db', () => ({
  promise: () => ({
    query: mockQuery
  })
}));

const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');
const AuthService = require('../services/AuthService');

describe('AuthService', () => {
  beforeEach(() => {
    jest.clearAllMocks(); // Limpia todos los mocks entre pruebas
  });

  const fakeUser = {
    Contraseña: 'hash',
    Id_Persona: 1,
    Rol: 'admin'
  };

  test('login exitoso retorna token', async () => {
    mockQuery.mockResolvedValue([[fakeUser]]);
    bcryptjs.compare.mockResolvedValue(true);
    jwt.sign.mockReturnValue('token123');

    const res = await AuthService.login('user', 'pass');

    expect(res.success).toBe(true);
    expect(res.token).toBe('token123');
  });

  test('login con usuario no encontrado', async () => {
    mockQuery.mockResolvedValue([[]]);

    const res = await AuthService.login('user', 'pass');

    expect(res.success).toBe(false);
    expect(res.message).toBe('Usuario no encontrado');
  });

  test('registrarUsuario inserta con pass hasheado', async () => {
    bcryptjs.hash.mockResolvedValue('hashed123');
    mockQuery.mockResolvedValue(); // No importa el retorno aquí

    await AuthService.registrarUsuario({
      ColabName: 1,
      ColabUser: 'user',
      ColabRol: 'admin',
      ColabPass: '1234'
    });

    expect(mockQuery).toHaveBeenCalledWith(
      'CALL AddUser(?,?,?,?)',
      ['user', 'hashed123', 'admin', 1]
    );
  });
});
