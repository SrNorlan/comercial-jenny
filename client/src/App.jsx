import React, { useState } from 'react';
import { useAuth } from './components/auth/AuthContext';
import useResources from './hooks/useResources';
import AppLayout from './components/layout/AppLayout';
import DashboardPage from './pages/DashboardPage';
import ProductsPage from './pages/ProductsPage';
import ClientsPage from './pages/ClientsPage';
import PosPage from './pages/PosPage';
import InstallmentsPage from './pages/InstallmentsPage';
import ReturnsPage from './pages/ReturnsPage';
import ReportsPage from './pages/ReportsPage';
import RecordsPage from './pages/RecordsPage';
import PurchasesPage from './pages/PurchasesPage';
import SuppliersPage from './pages/SuppliersPage';
import EmployeesPage from './pages/EmployeesPage';

function LoginPage({ onLogin, error, loading }) {
  const [credentials, setCredentials] = useState({ usuario: '', contrasena: '' });
  function submit(event) { event.preventDefault(); onLogin(credentials); }
  return <main className="login"><section className="login-intro"><p className="eyebrow">COMERCIAL JENNY / GESTIÓN COMERCIAL</p><h1>Todo el negocio,<br /><em>en movimiento.</em></h1><p className="intro-copy">Una vista clara para vender mejor, cuidar el inventario y conocer a tus clientes.</p><div className="login-mark">CJ <span>2026</span></div></section><form onSubmit={submit} className="login-form"><div className="brand-lockup"><span className="brand-symbol">CJ</span><span>Comercial Jenny</span></div><p className="form-kicker">Acceso privado</p><h2>Bienvenido de vuelta</h2><p className="muted">Ingresa tus credenciales para continuar.</p><label>Usuario<input autoFocus value={credentials.usuario} onChange={(event) => setCredentials({ ...credentials, usuario: event.target.value })} /></label><label>Contraseña<input type="password" value={credentials.contrasena} onChange={(event) => setCredentials({ ...credentials, contrasena: event.target.value })} /></label>{error && <p className="error">{error}</p>}<button type="submit" disabled={loading}>{loading ? 'Validando...' : 'Entrar al sistema'} <span>→</span></button></form></main>;
}

function getPage(view, data, user, reload, navigate) {
  if (view === 'products') return <ProductsPage products={data.products} user={user} onSell={() => navigate('pos')} onCreated={reload} />;
  if (view === 'clients') return <ClientsPage clients={data.clients} onCreated={reload} />;
  if (view === 'pos') return <PosPage products={data.products} clients={data.clients} user={user} onComplete={reload} />;
  if (view === 'installments') return <InstallmentsPage installments={data.installments} onPayment={reload} />;
  if (view === 'returns') return <ReturnsPage sales={data.sales} products={data.products} returns={data.returns} onComplete={reload} />;
  if (view === 'reports') return <ReportsPage summary={data.summary} />;
  if (view === 'sales') return <RecordsPage title="Ventas" eyebrow="MOVIMIENTO COMERCIAL" rows={data.sales} columns={[{ label: 'Venta', key: 'id', keys: ['id_venta', 'id'] }, { label: 'Tipo', key: 'type', keys: ['tipo_venta', 'tipo'] }, { label: 'Total', key: 'total', keys: ['total_venta', 'total'] }]} />;
  if (view === 'purchases') return <PurchasesPage purchases={data.purchases} products={data.products} suppliers={data.suppliers} user={user} onCreated={reload} />;
  if (view === 'suppliers') return <SuppliersPage suppliers={data.suppliers} onCreated={reload} />;
  if (view === 'employees') return <EmployeesPage employees={data.employees} onCreated={reload} />;
  return <DashboardPage data={data} onNavigate={navigate} />;
}

export default function App() {
  const { user, loading: authLoading, error, login, logout } = useAuth();
  const [view, setView] = useState('dashboard');
  const { data, reload } = useResources(user, view);
  if (authLoading) return <div className="loading-screen">Cargando...</div>;
  if (!user) return <LoginPage onLogin={login} error={error} loading={authLoading} />;
  return <AppLayout user={user} active={view} onNavigate={setView} onLogout={logout}>{getPage(view, data, user, reload, setView)}</AppLayout>;
}
