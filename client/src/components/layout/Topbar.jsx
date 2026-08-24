export default function Topbar({ title, onNewSale }) {
  const date = new Intl.DateTimeFormat('es-NI', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(new Date()).toUpperCase();
  return (
    <header className="topbar">
      <div className="topbar-context">
        <p className="eyebrow">{date}</p>
        <h1>{title}</h1>
      </div>
      <div className="mobile-brand brand-lockup">
        <span className="brand-symbol">CJ</span>
        <span>Comercial Jenny</span>
      </div>
      <div className="top-actions">
        <button type="button" className="icon-button" aria-label="Notificaciones">
          ♧<i />
        </button>
        <button type="button" className="new-sale" onClick={onNewSale}>
          + Nueva venta
        </button>
      </div>
    </header>
  );
}
