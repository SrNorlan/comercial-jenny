import React, { useState } from 'react';
import ConfirmDialog from '../components/ui/ConfirmDialog';
import { api, money, pick } from '../api/client';

export default function PosPage({ products, clients, user, onComplete }) {
  const [query, setQuery] = useState('');
  const [cart, setCart] = useState([]);
  const [clientId, setClientId] = useState('');
  const [type, setType] = useState('Contado');
  const [message, setMessage] = useState('');
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [category, setCategory] = useState('Todos');
  const categories = ['Todos', ...new Set(products.map((product) => product.categoria).filter(Boolean))];
  const available = products.filter((product) =>
    (category === 'Todos' || product.categoria === category) &&
    `${product.tipo} ${product.marca} ${product.modelo} ${product.categoria}`.toLowerCase().includes(query.toLowerCase()),
  );
  const total = cart.reduce((sum, item) => sum + Number(item.precio_venta || 0) * item.quantity, 0);
  function add(product) {
    setCart((current) =>
      current.some((item) => item.id_producto === product.id_producto)
        ? current.map((item) =>
            item.id_producto === product.id_producto
              ? { ...item, quantity: Math.min(item.quantity + 1, Number(product.existencia)) }
              : item,
          )
        : [...current, { ...product, quantity: 1 }],
    );
  }
  function change(id, amount) {
    setCart((current) =>
      current
        .map((item) =>
          item.id_producto === id
            ? {
                ...item,
                quantity: Math.max(0, Math.min(item.quantity + amount, Number(item.existencia))),
              }
            : item,
        )
        .filter((item) => item.quantity),
    );
  }
  async function checkout(event) {
    event.preventDefault();
    setConfirmOpen(true);
  }
  async function saveSale() {
    setMessage('');
    const invoiceWindow = window.open('', '_blank');
    try {
      const result = await api('/sales', {
        method: 'POST',
        body: JSON.stringify({
          idVenta: Date.now() % 1000000000,
          idCliente: Number(clientId),
          idVendedor: user.idPersona,
          tipoVenta: type,
          totalVenta: total,
          items: cart.map((item) => ({
            idProducto: item.id_producto,
            cantidad: item.quantity,
            precioUnitario: Number(item.precio_venta),
          })),
        }),
      });
      if (invoiceWindow && result.data?.idVenta) {
        invoiceWindow.location.href = `/api/v1/sales/${result.data.idVenta}/invoice`;
      }
      setCart([]);
      setClientId('');
      setMessage('Venta registrada correctamente.');
      onComplete();
    } catch (error) {
      invoiceWindow?.close();
      setMessage(error.message);
    }
  }
  return (
    <section className="pos-layout">
      <div className="pos-catalog">
        <div className="pos-heading">
          <div>
            <p className="eyebrow">PUNTO DE VENTA / NUEVA OPERACIÓN</p>
            <h2>Arma tu venta</h2>
            <p className="muted">Busca un producto, agrégalo y confirma el pedido.</p>
          </div>
          <span className="pos-count"><b>{available.length}</b> disponibles</span>
        </div>
        <div className="module-search pos-search">
          ⌕{' '}
          <input
            autoFocus
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Buscar por nombre, marca o SKU"
          />
        </div>
        <div className="pos-categories" role="tablist" aria-label="Categorías de productos">
          {categories.map((item) => (
            <button
              type="button"
              role="tab"
              aria-selected={category === item}
              className={category === item ? 'active' : ''}
              key={item}
              onClick={() => setCategory(item)}
            >
              {item}
            </button>
          ))}
        </div>
        <div className="compact-products">
          {available.map((product) => (
            <button
              type="button"
              className="compact-product"
              key={product.id_producto}
              disabled={!Number(product.existencia)}
              onClick={() => add(product)}
            >
              <span className="compact-product-icon">{String(product.tipo || 'P').slice(0, 1)}</span>
              <div className="compact-product-copy">
                <small>{product.categoria || 'Catálogo'}</small>
                <strong>{product.tipo || 'Producto'} {product.marca || ''}</strong>
                <b>{money(product.precio_venta)}</b>
              </div>
              <div className="compact-product-stock">{product.existencia} uds. disponibles</div>
            </button>
          ))}
        </div>
        {!available.length && (
          <div className="pos-empty">
            <strong>No encontramos productos</strong>
            <span>Prueba otra búsqueda o categoría.</span>
          </div>
        )}
      </div>
      <aside className="cart-panel">
        <div className="panel-heading">
          <div>
            <p className="eyebrow">RESUMEN</p>
            <h2>
              Tu pedido <small>{cart.reduce((sum, item) => sum + item.quantity, 0)} unidades</small>
            </h2>
          </div>
          <button type="button" className="text-button" onClick={() => setCart([])}>
            Vaciar
          </button>
        </div>
        {cart.length ? (
          <div className="cart-items">
            {cart.map((item) => (
              <div className="cart-item" key={item.id_producto}>
                <div>
                  <strong>
                    {item.tipo || 'Producto'} {item.marca || ''}
                  </strong>
                  <small>{money(item.precio_venta)} por unidad</small>
                </div>
                <div className="stepper">
                  <button type="button" onClick={() => change(item.id_producto, -1)}>
                    −
                  </button>
                  <b>{item.quantity}</b>
                  <button type="button" onClick={() => change(item.id_producto, 1)}>
                    +
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="muted empty-copy">El carrito está vacío.</p>
        )}
        <form className="checkout" onSubmit={checkout}>
          <label>
            Cliente
            <select value={clientId} onChange={(event) => setClientId(event.target.value)} required>
              <option value="">¿Para quién es la venta?</option>
              {clients.map((client) => (
                <option key={client.id_cliente} value={client.id_cliente}>
                  {pick(client, ['nombre_cliente', 'nombre', 'nombres'], 'Cliente')}
                </option>
              ))}
            </select>
          </label>
          <div className="sale-types" aria-label="Tipo de venta">
            <button
              type="button"
              className={type === 'Contado' ? 'selected' : ''}
              onClick={() => setType('Contado')}
            >
              Contado
            </button>
            <button
              type="button"
              className={type === 'Credito' ? 'selected' : ''}
              onClick={() => setType('Credito')}
            >
              Crédito
            </button>
          </div>
          <div className="total-line">
            <span>Total de la venta</span>
            <strong>{money(total)}</strong>
          </div>
          {message && (
            <p className={message.includes('correctamente') ? 'success' : 'error'}>{message}</p>
          )}
          <button
            type="submit"
            className="checkout-button"
            disabled={!cart.length || !user.idPersona}
          >
            Confirmar venta <span>→</span>
          </button>
        </form>
      </aside>
      <ConfirmDialog
        open={confirmOpen}
        title="Confirmar venta"
        message={`Se registrará una venta ${type.toLowerCase()} por ${money(total)}.`}
        confirmLabel="Registrar venta"
        onCancel={() => setConfirmOpen(false)}
        onConfirm={() => { setConfirmOpen(false); saveSale(); }}
      />
    </section>
  );
}
