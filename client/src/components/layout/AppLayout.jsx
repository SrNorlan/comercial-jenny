import Sidebar, { navigation } from './Sidebar';
import Topbar from './Topbar';

export default function AppLayout({ user, active, onNavigate, onLogout, children }) {
  const title = navigation.find((item) => item.key === active)?.label || 'Resumen';
  return (
    <main className="app-shell">
      <Sidebar active={active} onNavigate={onNavigate} user={user} onLogout={onLogout} />
      <section className="workspace">
        <Topbar
          title={active === 'dashboard' ? `Buenos días, ${user.usuario}` : title}
          onNewSale={() => onNavigate('pos')}
        />
        <div className="content">
          {children}
        </div>
      </section>
    </main>
  );
}
