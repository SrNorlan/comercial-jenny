const navigation = [
  { label: 'Resumen', icon: '⌂', key: 'dashboard', group: 'operation' },
  { label: 'Punto de venta', icon: '＋', key: 'pos', accent: true, group: 'operation' },
  { label: 'Ventas', icon: '↗', key: 'sales', group: 'operation' },
  { label: 'Abonos', icon: '◷', key: 'installments', group: 'operation' },
  { label: 'Productos', icon: '▦', key: 'products', group: 'admin' },
  { label: 'Compras', icon: '↓', key: 'purchases', group: 'admin', managerOnly: true },
  { label: 'Devoluciones', icon: '↩', key: 'returns', group: 'admin' },
  { label: 'Clientes', icon: '♧', key: 'clients', group: 'admin' },
  { label: 'Proveedores', icon: '◇', key: 'suppliers', group: 'admin', managerOnly: true },
  { label: 'Colaboradores', icon: '♙', key: 'employees', group: 'admin', managerOnly: true },
  { label: 'Reportes', icon: '▤', key: 'reports', group: 'admin', managerOnly: true },
];

export { navigation };

export default function Sidebar({ active, onNavigate, user, onLogout }) {
  const visibleNavigation = navigation.filter(
    (item) => !item.managerOnly || user.rol === 'Gerente',
  );
  const operationNavigation = visibleNavigation.filter((item) => item.group === 'operation');
  const administrationNavigation = visibleNavigation.filter((item) => item.group === 'admin');
  const renderItem = (item) => (
    <button
      type="button"
      className={`${active === item.key ? 'active ' : ''}${item.accent ? 'accent' : ''}`}
      key={item.key}
      onClick={() => onNavigate(item.key)}
    >
      <span className="nav-icon">{item.icon}</span>
      {item.label}
    </button>
  );
  return (
    <aside className="sidebar">
      <div className="brand-lockup">
        <span className="brand-symbol">CJ</span>
        <span>Comercial Jenny</span>
      </div>
      <p className="nav-label">Operación</p>
      <nav>{operationNavigation.map(renderItem)}</nav>
      <p className="nav-label">Administración</p>
      <nav>{administrationNavigation.map(renderItem)}</nav>
      <div className="sidebar-footer">
        <span className="avatar">{user.usuario?.[0]?.toUpperCase() || 'U'}</span>
        <div>
          <strong>{user.usuario}</strong>
          <small>{user.rol || 'Colaborador'}</small>
        </div>
        <button type="button" className="logout" onClick={onLogout} aria-label="Cerrar sesión">
          ↪
        </button>
      </div>
    </aside>
  );
}
