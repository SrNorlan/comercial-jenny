import React, { createContext, useContext, useEffect, useState } from 'react';
import { api } from '../../api/client';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    api('/auth/me')
      .then((result) => setUser(result.data))
      .catch(() => setUser(null))
      .finally(() => setLoading(false));
  }, []);

  async function login(credentials) {
    setLoading(true);
    setError('');
    try {
      const result = await api('/auth/login', {
        method: 'POST',
        body: JSON.stringify(credentials),
      });
      setUser(result.data);
      return result.data;
    } catch (reason) {
      setError(reason.message);
      throw reason;
    } finally {
      setLoading(false);
    }
  }

  async function logout() {
    await api('/auth/logout', { method: 'POST' });
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, loading, error, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth debe utilizarse dentro de AuthProvider.');
  return context;
}
