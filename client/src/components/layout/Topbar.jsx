export default function Topbar({ onNewSale }) {
  return <header className="topbar"><div className="mobile-brand brand-lockup"><span className="brand-symbol">CJ</span><span>Comercial Jenny</span></div><div className="search"><span>⌕</span><input aria-label="Buscar en tu operación" placeholder="Buscar en tu operación..." /><kbd>Ctrl K</kbd></div><div className="top-actions"><button type="button" className="icon-button" aria-label="Notificaciones">♧<i /></button><button type="button" className="new-sale" onClick={onNewSale}>+ Nueva venta</button></div></header>;
}
