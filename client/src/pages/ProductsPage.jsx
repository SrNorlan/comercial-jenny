import React, { useState } from 'react';
import ConfirmDialog from '../components/ui/ConfirmDialog';
import { api, money } from '../api/client';

const emptyProduct = {
  marca: '',
  tipo: '',
  color: '',
  categoria: 'Calzado',
  existencia: 0,
  precioCompra: '',
  precioVenta: '',
  talla: '',
  modelo: '',
};
export default function ProductsPage({ products, user, onSell, onCreated }) {
  const [query, setQuery] = useState('');
  const [form, setForm] = useState(emptyProduct);
  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [message, setMessage] = useState('');
  const [pendingAction, setPendingAction] = useState(null);
  const filtered = products.filter((product) =>
    `${product.tipo} ${product.marca} ${product.modelo} ${product.categoria}`
      .toLowerCase()
      .includes(query.toLowerCase()),
  );
  const margin =
    Number(form.precioVenta) > 0
      ? ((Number(form.precioVenta) - Number(form.precioCompra || 0)) / Number(form.precioVenta)) *
        100
      : 0;
  const isStatusChange = pendingAction?.type === 'toggle';
  const confirmationTitle = isStatusChange
    ? 'Cambiar estado del producto'
    : editingId
      ? 'Actualizar producto'
      : 'Guardar producto';
  const confirmationLabel = isStatusChange ? 'Cambiar estado' : editingId ? 'Actualizar' : 'Guardar';
  function edit(product) {
    setEditingId(product.id_producto);
    setForm({
      marca: product.marca || '',
      tipo: product.tipo || '',
      color: product.color || '',
      categoria: product.categoria || 'Calzado',
      existencia: product.existencia || 0,
      precioCompra: product.precio_compra || '',
      precioVenta: product.precio_venta || '',
      talla: product.talla || '',
      modelo: product.modelo || '',
    });
    setOpen(true);
  }
  async function submit(event) {
    event.preventDefault();
    setPendingAction({ type: 'save' });
  }
  async function saveProduct() {
    try {
      await api(editingId ? `/products/${editingId}` : '/products', {
        method: editingId ? 'PUT' : 'POST',
        body: JSON.stringify(form),
      });
      setMessage(
        editingId ? 'Producto actualizado correctamente.' : 'Producto creado correctamente.',
      );
      setForm(emptyProduct);
      setEditingId(null);
      onCreated();
    } catch (error) {
      setMessage(error.message);
    }
  }
  async function toggle(product) {
    const next = product.estado_producto === 'Activo' ? 'Inactivo' : 'Activo';
    setPendingAction({ type: 'toggle', product, next });
  }
  async function changeProductStatus(product, next) {
    try {
      await api(`/products/${product.id_producto}/status`, {
        method: 'PATCH',
        body: JSON.stringify({ estadoProducto: next }),
      });
      onCreated();
    } catch (error) {
      setMessage(error.message);
    }
  }
  return (
    <section className="module-view">
      <div className="module-toolbar">
        <div>
          <p className="eyebrow">CATÁLOGO</p>
          <h2>Productos</h2>
        </div>
        <div className="module-actions">
          <div className="module-search">
            ⌕{' '}
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Buscar producto..."
            />
          </div>
          <button
            type="button"
            className="new-sale"
            onClick={() => {
              setOpen(!open);
              setEditingId(null);
              setForm(emptyProduct);
            }}
          >
            {open ? 'Cerrar' : '+ Nuevo producto'}
          </button>
        </div>
      </div>
      {open && (
        <div className="form-modal-backdrop">
          <form className="product-form form-modal" onSubmit={submit}>
          <div>
            <p className="eyebrow">{editingId ? 'EDITAR REGISTRO' : 'NUEVO REGISTRO'}</p>
            <h3>{editingId ? 'Editar producto' : 'Agregar producto al catálogo'}</h3>
          </div>
          <div className="form-grid">
            <label>
              Tipo
              <input
                required
                value={form.tipo}
                onChange={(event) => setForm({ ...form, tipo: event.target.value })}
              />
            </label>
            <label>
              Marca
              <input
                required
                value={form.marca}
                onChange={(event) => setForm({ ...form, marca: event.target.value })}
              />
            </label>
            <label>
              Color
              <input
                required
                value={form.color}
                onChange={(event) => setForm({ ...form, color: event.target.value })}
              />
            </label>
            <label>
              Categoría
              <select
                value={form.categoria}
                onChange={(event) => setForm({ ...form, categoria: event.target.value })}
              >
                <option>Calzado</option>
                <option>Prendas de Vestir</option>
                <option>Cosmeticos</option>
                <option>Electrodomesticos</option>
                <option>Productos Plasticos</option>
              </select>
            </label>
            <label>
              Existencia
              <input
                type="number"
                min="0"
                value={form.existencia}
                onChange={(event) => setForm({ ...form, existencia: event.target.value })}
              />
            </label>
            <label>
              Precio de compra
              <input
                type="number"
                min="0"
                step="0.01"
                value={form.precioCompra}
                onChange={(event) => setForm({ ...form, precioCompra: event.target.value })}
              />
            </label>
            <label>
              Precio de venta
              <input
                required
                type="number"
                min="0.01"
                step="0.01"
                value={form.precioVenta}
                onChange={(event) => setForm({ ...form, precioVenta: event.target.value })}
              />
            </label>
            <label>
              Talla / modelo
              <input
                value={form.talla}
                onChange={(event) => setForm({ ...form, talla: event.target.value })}
              />
            </label>
          </div>
          <div className="form-summary">
            <span>
              Margen estimado <strong>{margin.toFixed(1)}%</strong>
            </span>
            <button type="submit" className="checkout-button">
              {editingId ? 'Actualizar' : 'Guardar'} <span>→</span>
            </button>
          </div>
          {message && (
            <p className={message.includes('correctamente') ? 'success' : 'error'}>{message}</p>
          )}
          <button type="button" className="form-cancel" onClick={() => { setOpen(false); setEditingId(null); }}>Cancelar</button>
          </form>
        </div>
      )}
      <div className="product-grid">
        {filtered.map((product) => (
          <article className="product-card" key={product.id_producto}>
            <div className="product-image">
              {String(product.tipo || 'P')
                .slice(0, 1)
                .toUpperCase()}
            </div>
            <div className="product-info">
              <small>{product.categoria || 'Catálogo'}</small>
              <h3>
                {product.tipo || 'Producto'} {product.marca || ''}
              </h3>
              <p>{product.modelo || product.color || 'Disponible para venta'}</p>
              <strong>{money(product.precio_venta)}</strong>
              <span className={Number(product.existencia) > 0 ? 'stock-good' : 'stock-warning'}>
                {product.existencia} unidades
              </span>
              <div className="card-actions">
                <button
                  type="button"
                  disabled={!Number(product.existencia)}
                  onClick={() => onSell(product)}
                >
                  Vender
                </button>
                <button type="button" className="text-button" onClick={() => edit(product)}>
                  Editar
                </button>
                <button type="button" className="text-button" onClick={() => toggle(product)}>
                  {product.estado_producto === 'Activo' ? 'Desactivar' : 'Activar'}
                </button>
              </div>
            </div>
          </article>
        ))}
      </div>
      <ConfirmDialog
        open={Boolean(pendingAction)}
        title={confirmationTitle}
        message={pendingAction?.type === 'toggle' ? `El producto quedará ${pendingAction.next.toLowerCase()}.` : 'Revisa los datos antes de confirmar el cambio.'}
        confirmLabel={confirmationLabel}
        onCancel={() => setPendingAction(null)}
        onConfirm={() => {
          const action = pendingAction;
          setPendingAction(null);
          if (action.type === 'toggle') changeProductStatus(action.product, action.next);
          else saveProduct();
        }}
      />
    </section>
  );
}
