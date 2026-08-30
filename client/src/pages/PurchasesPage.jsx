import React, { useState } from 'react';
import ConfirmDialog from '../components/ui/ConfirmDialog';
import Pagination from '../components/ui/Pagination';
import { api, money, pick } from '../api/client';

export default function PurchasesPage({ purchases, products, suppliers, user, onCreated }) {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    idProveedor: '',
    idProducto: '',
    cantidad: 1,
    precioCompra: '',
    precioVenta: '',
  });
  const [message, setMessage] = useState('');
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const totalPages = Math.max(1, Math.ceil(purchases.length / pageSize));
  const currentPage = Math.min(page, totalPages);
  const paginated = purchases.slice((currentPage - 1) * pageSize, currentPage * pageSize);
  const total = Number(form.cantidad || 0) * Number(form.precioCompra || 0);
  async function submit(event) {
    event.preventDefault();
    setConfirmOpen(true);
  }
  async function savePurchase() {
    setMessage('');
    try {
      await api('/purchases', {
        method: 'POST',
        body: JSON.stringify({
          idCompra: Date.now() % 1000000000,
          idProveedor: Number(form.idProveedor),
          idComprador: user.idPersona,
          totalCompra: total,
          items: [
            {
              idProducto: Number(form.idProducto),
              cantidad: Number(form.cantidad),
              precioCompra: Number(form.precioCompra),
              precioVenta: Number(form.precioVenta),
            },
          ],
        }),
      });
      setMessage('Compra registrada correctamente.');
      setForm({
        idProveedor: '',
        idProducto: '',
        cantidad: 1,
        precioCompra: '',
        precioVenta: '',
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
          <p className="eyebrow">ABASTECIMIENTO</p>
          <h2>Compras</h2>
        </div>
        <button
          type="button"
          className="new-sale"
          onClick={() => {
            setOpen(!open);
            setMessage('');
          }}
        >
          {open ? 'Cerrar' : '+ Nueva compra'}
        </button>
      </div>
      {open && (
        <div className="form-modal-backdrop">
          <form className="product-form form-modal" onSubmit={submit}>
          <div>
            <p className="eyebrow">NUEVO INGRESO</p>
            <h3>Registrar compra</h3>
          </div>
          <div className="form-grid">
            <label>
              Proveedor
              <select
                required
                value={form.idProveedor}
                onChange={(event) => setForm({ ...form, idProveedor: event.target.value })}
              >
                <option value="">Seleccionar proveedor</option>
                {suppliers.map((supplier) => (
                  <option key={supplier.id_proveedor} value={supplier.id_proveedor}>
                    {pick(supplier, ['nombre', 'nombre_proveedor'], 'Proveedor')}
                  </option>
                ))}
              </select>
            </label>
            <label>
              Producto
              <select
                required
                value={form.idProducto}
                onChange={(event) => setForm({ ...form, idProducto: event.target.value })}
              >
                <option value="">Seleccionar producto</option>
                {products.map((product) => (
                  <option key={product.id_producto} value={product.id_producto}>
                    {product.tipo} {product.marca}
                  </option>
                ))}
              </select>
            </label>
            <label>
              Cantidad
              <input
                required
                type="number"
                min="1"
                value={form.cantidad}
                onChange={(event) => setForm({ ...form, cantidad: event.target.value })}
              />
            </label>
            <label>
              Costo unitario
              <input
                required
                type="number"
                min="0.01"
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
          </div>
          <div className="form-summary">
            <span>
              Total de compra <strong>{money(total)}</strong>
            </span>
            <button type="submit" className="checkout-button">
              Guardar compra <span>→</span>
            </button>
          </div>
          {message && (
            <p className={message.includes('correctamente') ? 'success' : 'error'}>{message}</p>
          )}
          <button type="button" className="form-cancel" onClick={() => setOpen(false)}>Cancelar</button>
          </form>
        </div>
      )}
      <div className="records-table">
        {paginated.map((purchase, index) => (
          <article className="record-row" key={purchase.id_compra || index}>
            <div>
              <small>Compra</small>
              <strong>#{pick(purchase, ['id_compra', 'id'], '—')}</strong>
            </div>
            <div>
              <small>Fecha</small>
              <strong>{purchase.fecha_compra || 'Sin fecha'}</strong>
            </div>
            <div>
              <small>Total</small>
              <strong>{money(pick(purchase, ['total_compra', 'total'], 0))}</strong>
            </div>
          </article>
        ))}
      </div>
      {!purchases.length && <p className="muted empty-copy">Todavía no hay compras registradas.</p>}
      <Pagination
        page={currentPage}
        pageSize={pageSize}
        totalItems={purchases.length}
        onPageChange={setPage}
        onPageSizeChange={(nextSize) => {
          setPageSize(nextSize);
          setPage(1);
        }}
      />
      <ConfirmDialog
        open={confirmOpen}
        title="Registrar compra"
        message={`Se registrará una compra por ${money(total)} y se actualizará el inventario.`}
        confirmLabel="Registrar compra"
        onCancel={() => setConfirmOpen(false)}
        onConfirm={() => { setConfirmOpen(false); savePurchase(); }}
      />
    </section>
  );
}
