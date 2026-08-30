import React, { useState } from 'react';
import ConfirmDialog from '../components/ui/ConfirmDialog';
import { api, money } from '../api/client';

export default function ReturnsPage({ sales, products, returns, onComplete }) {
  const [form, setForm] = useState({
    idVenta: '',
    idProducto: '',
    cantidadDevuelta: 1,
    motivo: 'Producto defectuoso',
  });
  const [message, setMessage] = useState('');
  const [open, setOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  async function submit(event) {
    event.preventDefault();
    setConfirmOpen(true);
  }
  async function saveReturn() {
    setMessage('');
    try {
      await api('/returns', {
        method: 'POST',
        body: JSON.stringify({
          ...form,
          idVenta: Number(form.idVenta),
          idProducto: Number(form.idProducto),
          cantidadDevuelta: Number(form.cantidadDevuelta),
        }),
      });
      setMessage('Devolución registrada correctamente.');
      setForm({ idVenta: '', idProducto: '', cantidadDevuelta: 1, motivo: 'Producto defectuoso' });
      setOpen(false);
      onComplete();
    } catch (error) {
      setMessage(error.message);
    }
  }
  return (
    <section className="module-view returns-view">
      <div className="module-toolbar">
        <div>
          <p className="eyebrow">INVENTARIO Y GARANTÍAS</p>
          <h2>Registrar devolución</h2>
        </div>
        <div className="module-actions">
          <span className="status-dot">● {returns.length} registradas</span>
          <button type="button" className="new-sale" onClick={() => setOpen(true)}>+ Nueva devolución</button>
        </div>
      </div>
      <div className="return-layout">
        <div className="return-guide">
          <span className="module-icon">↩</span>
          <h3>Devuelve un producto</h3>
          <p>Selecciona la venta original, identifica el producto y deja registrado el motivo.</p>
          <div className="return-steps">
            <span>
              <b>1</b> Venta original
            </span>
            <span>
              <b>2</b> Producto
            </span>
            <span>
              <b>3</b> Motivo
            </span>
          </div>
        </div>
        <div className="return-form-placeholder">
          <p className="muted">Registra una devolución cuando un producto necesite cambio o revisión.</p>
        </div>
        {open && <div className="form-modal-backdrop"><form className="return-form form-modal" onSubmit={submit}>
          <label>
            Venta original
            <select
              value={form.idVenta}
              onChange={(event) => setForm({ ...form, idVenta: event.target.value })}
              required
            >
              <option value="">Seleccionar factura</option>
              {sales.map((sale) => (
                <option key={sale.id_venta} value={sale.id_venta}>
                  Venta #{sale.id_venta} · {money(sale.total_venta)}
                </option>
              ))}
            </select>
          </label>
          <label>
            Producto
            <select
              value={form.idProducto}
              onChange={(event) => setForm({ ...form, idProducto: event.target.value })}
              required
            >
              <option value="">Seleccionar producto</option>
              {products.map((product) => (
                <option key={product.id_producto} value={product.id_producto}>
                  {product.tipo} {product.marca} · SKU {product.id_producto}
                </option>
              ))}
            </select>
          </label>
          <label>
            Cantidad
            <input
              type="number"
              min="1"
              value={form.cantidadDevuelta}
              onChange={(event) => setForm({ ...form, cantidadDevuelta: event.target.value })}
              required
            />
          </label>
          <label>
            Motivo
            <select
              value={form.motivo}
              onChange={(event) => setForm({ ...form, motivo: event.target.value })}
            >
              <option>Producto defectuoso</option>
              <option>Cambio solicitado</option>
              <option>Producto incorrecto</option>
              <option>Otro motivo</option>
            </select>
          </label>
          {message && (
            <p className={message.includes('correctamente') ? 'success' : 'error'}>{message}</p>
          )}
          <button type="submit" className="checkout-button">
            Confirmar devolución <span>→</span>
          </button>
          <button type="button" className="form-cancel" onClick={() => setOpen(false)}>Cancelar</button>
        </form></div>}
      </div>
      <div className="return-history">
        <div className="panel-heading">
          <div>
            <p className="eyebrow">HISTORIAL</p>
            <h3>Últimas devoluciones</h3>
          </div>
        </div>
        {returns.slice(0, 6).map((item) => (
          <div className="record-row" key={item.id_productodevuelto}>
            <div>
              <small>Venta</small>
              <strong>#{item.id_venta}</strong>
            </div>
            <div>
              <small>Producto</small>
              <strong>{item.producto || `SKU ${item.id_producto}`}</strong>
            </div>
            <div>
              <small>Motivo</small>
              <strong>{item.motivo || 'Sin motivo'}</strong>
            </div>
          </div>
        ))}
      </div>
      <ConfirmDialog
        open={confirmOpen}
        title="Confirmar devolución"
        message="La devolución modificará el inventario y quedará registrada en el historial."
        confirmLabel="Registrar devolución"
        onCancel={() => setConfirmOpen(false)}
        onConfirm={() => { setConfirmOpen(false); saveReturn(); }}
      />
    </section>
  );
}
