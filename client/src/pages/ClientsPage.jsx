import React, { useMemo, useState } from 'react';
import Pagination from '../components/ui/Pagination';
import { api, money, pick } from '../api/client';

const emptyClient = {
  nombre: '',
  apellido: '',
  cedula: '',
  telefono: '',
  distrito: 'I',
  zonaResidencia: '',
  puntoReferencia: '',
  casa: '',
};
export default function ClientsPage({ clients, onCreated }) {
  const [query, setQuery] = useState('');
  const [form, setForm] = useState(emptyClient);
  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [message, setMessage] = useState('');
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const filtered = useMemo(
    () =>
      clients.filter((client) =>
        JSON.stringify(client).toLowerCase().includes(query.toLowerCase()),
      ),
    [clients, query],
  );
  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const currentPage = Math.min(page, totalPages);
  const paginated = filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize);
  function edit(client) {
    const parts = String(client.nombre || '').split(' ');
    setEditingId(client.id_cliente);
    setForm({
      nombre: parts.shift() || '',
      apellido: parts.join(' '),
      cedula: client.cedula || '',
      telefono: client.telefono || '',
      distrito: client.direccion?.match(/Distrito ([^,]+)/)?.[1] || 'I',
      zonaResidencia: client.direccion?.split(', ')[1] || '',
      puntoReferencia: '',
      casa: client.direccion?.match(/Casa (.*)$/)?.[1] || '',
    });
    setOpen(true);
  }
  async function submit(event) {
    event.preventDefault();
    try {
      await api(editingId ? `/clients/${editingId}` : '/clients', {
        method: editingId ? 'PUT' : 'POST',
        body: JSON.stringify(form),
      });
      setMessage(
        editingId ? 'Cliente actualizado correctamente.' : 'Cliente creado correctamente.',
      );
      setForm(emptyClient);
      setEditingId(null);
      onCreated();
    } catch (error) {
      setMessage(error.message);
    }
  }
  async function toggle(client) {
    const next = client.estado_cliente === 'Activo' ? 'Inactivo' : 'Activo';
    try {
      await api(`/clients/${client.id_cliente}/status`, {
        method: 'PATCH',
        body: JSON.stringify({ estado: next }),
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
          <p className="eyebrow">RELACIONES</p>
          <h2>Clientes</h2>
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
              placeholder="Buscar cliente..."
            />
          </div>
          <button
            type="button"
            className="new-sale"
            onClick={() => {
              setOpen(!open);
              setEditingId(null);
              setForm(emptyClient);
            }}
          >
            {open ? 'Cerrar' : '+ Nuevo cliente'}
          </button>
        </div>
      </div>
      {open && (
        <form className="product-form" onSubmit={submit}>
          <div>
            <p className="eyebrow">{editingId ? 'EDITAR REGISTRO' : 'NUEVO REGISTRO'}</p>
            <h3>{editingId ? 'Editar cliente' : 'Agregar cliente'}</h3>
          </div>
          <div className="form-grid">
            {[
              ['nombre', 'Nombre'],
              ['apellido', 'Apellido'],
              ['cedula', 'Cédula'],
              ['telefono', 'Teléfono'],
              ['zonaResidencia', 'Zona'],
              ['puntoReferencia', 'Punto de referencia'],
              ['casa', 'Casa / dirección'],
            ].map(([key, label]) => (
              <label key={key}>
                {label}
                <input
                  required={['nombre', 'apellido', 'cedula', 'telefono', 'zonaResidencia'].includes(
                    key,
                  )}
                  value={form[key]}
                  onChange={(event) => setForm({ ...form, [key]: event.target.value })}
                />
              </label>
            ))}
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
          </div>
          <div className="form-summary">
            <span>
              Crédito inicial <strong>C$ 6,000.00</strong>
            </span>
            <button type="submit" className="checkout-button">
              {editingId ? 'Actualizar' : 'Guardar'} <span>→</span>
            </button>
          </div>
          {message && (
            <p className={message.includes('correctamente') ? 'success' : 'error'}>{message}</p>
          )}
        </form>
      )}
      <div className="client-list">
        {paginated.map((client, index) => (
          <article className="client-row" key={client.id_cliente || index}>
            <span className="client-avatar">
              {String(pick(client, ['nombre', 'nombre_cliente', 'nombres'], 'C'))
                .slice(0, 1)
                .toUpperCase()}
            </span>
            <div>
              <strong>{pick(client, ['nombre', 'nombre_cliente', 'nombres'], 'Cliente')}</strong>
              <small>
                {pick(client, ['cedula', 'telefono', 'celular'], 'Sin datos de contacto')}
              </small>
            </div>
            <span className="client-credit">
              {money(pick(client, ['credito_disponible', 'credito'], 0))}
              <small>{pick(client, ['estado_cliente', 'estado'], 'Activo')}</small>
            </span>
            <button type="button" className="text-button" onClick={() => edit(client)}>
              Editar
            </button>
            <button type="button" className="text-button" onClick={() => toggle(client)}>
              {client.estado_cliente === 'Activo' ? 'Desactivar' : 'Activar'}
            </button>
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
