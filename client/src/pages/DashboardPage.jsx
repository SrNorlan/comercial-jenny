import { money, pick } from '../api/client';

export default function DashboardPage({ data, onNavigate }) {
  const lowStock = data.products.filter((product) => Number(product.existencia) <= 3);
  return (
    <>
      <section className="stats">
        <article className="stat-card indigo">
          <span>Clientes activos</span>
          <strong>{data.clients.length}</strong>
          <small>Base registrada</small>
          <b>♧</b>
        </article>
        <article className="stat-card emerald">
          <span>Productos en catálogo</span>
          <strong>{data.products.length}</strong>
          <small>Disponibles para venta</small>
          <b>▦</b>
        </article>
        <article className="stat-card amber">
          <span>Ventas registradas</span>
          <strong>{data.sales.length}</strong>
          <small>Transacciones acumuladas</small>
          <b>↗</b>
        </article>
        <article className="stat-card rose">
          <span>Alertas de inventario</span>
          <strong>{lowStock.length}</strong>
          <small>Requieren atención</small>
          <b>!</b>
        </article>
      </section>
      <section className="dashboard-grid">
        <article className="panel">
          <div className="panel-heading">
            <div>
              <p className="eyebrow">MOVIMIENTO RECIENTE</p>
              <h2>Últimas ventas</h2>
            </div>
            <button type="button" className="text-button" onClick={() => onNavigate('sales')}>
              Ver todas →
            </button>
          </div>
          {data.sales
            .slice(-5)
            .reverse()
            .map((sale) => (
              <div className="activity-row" key={sale.id_venta}>
                <span className="activity-avatar">V</span>
                <div>
                  <strong>Venta registrada</strong>
                  <small>Venta #{sale.id_venta}</small>
                </div>
                <b>{money(sale.total_venta)}</b>
              </div>
            ))}
        </article>
        <article className="panel">
          <div className="panel-heading">
            <div>
              <p className="eyebrow">INVENTARIO</p>
              <h2>Stock por revisar</h2>
            </div>
            <button type="button" className="circle-button" onClick={() => onNavigate('products')}>
              ↗
            </button>
          </div>
          {lowStock.slice(0, 5).map((product) => (
            <div className="stock-row" key={product.id_producto}>
              <span className="product-avatar">{String(product.tipo || 'P').slice(0, 1)}</span>
              <div>
                <strong>{pick(product, ['tipo', 'marca'], 'Producto')}</strong>
                <small>SKU {product.id_producto}</small>
              </div>
              <span className="stock-warning">{product.existencia} uds.</span>
            </div>
          ))}
        </article>
      </section>
    </>
  );
}
