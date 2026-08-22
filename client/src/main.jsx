import React, { useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import './styles.css';

const api = (path, options = {}) => fetch(`/api/v1${path}`, { credentials: 'include', headers: { 'Content-Type': 'application/json' }, ...options }).then(async (response) => { const body = await response.json(); if (!response.ok) throw new Error(body.message); return body; });

function App() {
  const [user, setUser] = useState(null);
  const [credentials, setCredentials] = useState({ usuario: '', contrasena: '' });
  const [error, setError] = useState('');
  const [stats, setStats] = useState({ clients: 0, products: 0, sales: 0 });

  useEffect(() => { api('/auth/me').then((result) => setUser(result.data)).catch(() => {}); }, []);
  useEffect(() => { if (user) Promise.all([api('/clients'), api('/products'), api('/sales')]).then(([clients, products, sales]) => setStats({ clients: clients.data.length, products: products.data.length, sales: sales.data.length })).catch((reason) => setError(reason.message)); }, [user]);

  async function login(event) { event.preventDefault(); setError(''); try { const result = await api('/auth/login', { method: 'POST', body: JSON.stringify(credentials) }); setUser(result.data); } catch (reason) { setError(reason.message); } }
  async function logout() { await api('/auth/logout', { method: 'POST' }); setUser(null); }

  if (!user) return <main className="login"><form onSubmit={login}><p className="eyebrow">COMERCIAL JENNY</p><h1>Acceso al sistema</h1><label>Usuario<input value={credentials.usuario} onChange={(event) => setCredentials({ ...credentials, usuario: event.target.value })} /></label><label>Contraseña<input type="password" value={credentials.contrasena} onChange={(event) => setCredentials({ ...credentials, contrasena: event.target.value })} /></label>{error && <p className="error">{error}</p>}<button>Iniciar sesión</button></form></main>;
  return <main className="dashboard"><header><div><p className="eyebrow">PANEL DE CONTROL</p><h1>Hola, {user.usuario}</h1></div><button className="quiet" onClick={logout}>Cerrar sesión</button></header><section className="stats"><article><span>Clientes</span><strong>{stats.clients}</strong></article><article><span>Productos</span><strong>{stats.products}</strong></article><article><span>Ventas</span><strong>{stats.sales}</strong></article></section>{error && <p className="error">{error}</p>}</main>;
}

createRoot(document.getElementById('root')).render(<App />);