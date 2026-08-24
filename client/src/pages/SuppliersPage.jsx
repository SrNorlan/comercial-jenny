import React, { useMemo, useState } from 'react';
import Pagination from '../components/ui/Pagination';
import { api, pick } from '../api/client';

const emptySupplier = {
  nombre: '',
  apellido: '',
  cedula: '',
  telefono: '',
  distrito: 'I',
  zonaResidencia: '',
  puntoReferencia: '',
  casa: '',
  comercio: '',
};
export default function SuppliersPage({ suppliers, onCreated }) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [form, setForm] = useState(emptySupplier);
  const [message, setMessage] = useState('');
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const filtered = useMemo(
    () =>
      suppliers.filter((supplier) =>
        JSON.stringify(supplier).toLowerCase().includes(query.toLowerCase()),
      ),
    [suppliers, query],
  );
  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const currentPage = Math.min(page, totalPages);
  const paginated = filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize);
  async function submit(event) {
    event.preventDefault();
    try {
      await api('/suppliers', { method: 'POST', body: JSON.stringify(form) });
      setMessage('Proveedor creado correctamente.');
      setForm(emptySupplier);
      onCreated();
    } catch (error) {
      setMessage(error.message);
    }
  }
  return (
    <section className="module-view">
      <div className="module-toolbar">
        <div>
          <p className="eyebrow">RED DE SUMINISTRO</p>
          <h2>Proveedores</h2>
        </div>
        <div className="module-actions">
          <div className="module-search">
            ⌕{' '}
            <input
              value={query}
              onChange={(event) => {
                setQuery(event.target.value);
                setPage(1);
              }}
              placeholder="Buscar proveedor..."
            />
          </div>
          <button type="button" className="new-sale" onClick={() => setOpen(!open)}>
            {open ? 'Cerrar' : '+ Nuevo proveedor'}
          </button>
        </div>
      </div>
      {open && (
        <form className="product-form" onSubmit={submit}>
          <div>
            <p className="eyebrow">NUEVO REGISTRO</p>
            <h3>Agregar proveedor</h3>
          </div>
          <div className="form-grid">
            <label>
              Nombre
              <input
                required
                value={form.nombre}
                onChange={(event) => setForm({ ...form, nombre: event.target.value })}
              />
            </label>
            <label>
              Apellido
              <input
                required
                value={form.apellido}
                onChange={(event) => setForm({ ...form, apellido: event.target.value })}
              />
            </label>
            <label>
              Cédula
              <input
                required
                value={form.cedula}
                onChange={(event) => setForm({ ...form, cedula: event.target.value })}
              />
            </label>
            <label>
              Teléfono
              <input
                required
                value={form.telefono}
                onChange={(event) => setForm({ ...form, telefono: event.target.value })}
              />
            </label>
            <label>
              Distrito
              <select
                value={form.distrito}
                onChange={(event) => setForm({ ...form, distrito: event.target.value })}
              >
                {['I', 'II', 'III', 'IV', 'V', 'VI', 'VII'].map((district) => (
                  <option key={district}>{district}</option>
                ))}
              </select>
            </label>
            <label>
              Zona
              <input
                required
                value={form.zonaResidencia}
                onChange={(event) => setForm({ ...form, zonaResidencia: event.target.value })}
              />
            </label>
            <label>
              Comercio
              <input
                required
                value={form.comercio}
                onChange={(event) => setForm({ ...form, comercio: event.target.value })}
              />
            </label>
            <label>
              Casa / dirección
              <input
                value={form.casa}
                onChange={(event) => setForm({ ...form, casa: event.target.value })}
              />
            </label>
          </div>
          <div className="form-summary">
            <span>
              Tipo de registro <strong>Proveedor</strong>
            </span>
            <button type="submit" className="checkout-button">
              Guardar proveedor <span>→</span>
            </button>
          </div>
          {message && (
            <p className={message.includes('correctamente') ? 'success' : 'error'}>{message}</p>
          )}
        </form>
      )}
      <div className="client-list">
        {paginated.map((supplier, index) => (
          <article className="client-row" key={supplier.id_proveedor || index}>
            <span className="client-avatar">
              {String(pick(supplier, ['nombre'], 'P')).slice(0, 1)}
            </span>
            <div>
              <strong>{pick(supplier, ['nombre', 'nombre_proveedor'], 'Proveedor')}</strong>
              <small>{pick(supplier, ['comercio', 'telefono'], 'Sin datos')}</small>
            </div>
            <span className="client-credit">
              <small>{pick(supplier, ['estado'], 'Activo')}</small>
            </span>
          </article>
        ))}
      </div>
      <Pagination
        page={currentPage}
        pageSize={pageSize}
        totalItems={filtered.length}
        onPageChange={setPage}
        onPageSizeChange={(nextSize) => {
          setPageSize(nextSize);
          setPage(1);
        }}
      />
    </section>
  );
}
