import Sidebar, { navigation } from './Sidebar';
import Topbar from './Topbar';

export default function AppLayout({ user, active, onNavigate, onLogout, children }) {
  const title = navigation.find((item) => item.key === active)?.label || 'Resumen';
  return <main className="app-shell"><Sidebar active={active} onNavigate={onNavigate} user={user} onLogout={onLogout} /><section className="workspace"><Topbar onNewSale={() => onNavigate('pos')} /><div className="content"><div className="page-heading"><div><p className="eyebrow">SÁBADO, 22 DE AGOSTO DE 2026</p><h1>{active === 'dashboard' ? <>Buenos días, <em>{user.usuario}</em></> : title}</h1></div><span className="status-dot">● Sistema operativo</span></div>{children}</div></section></main>;
}
