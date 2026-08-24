import React from 'react';
import Pagination from '../components/ui/Pagination';
import { pick } from '../api/client';

export default function RecordsPage({ title, eyebrow, rows, columns }) {
  const [query, setQuery] = React.useState('');
  const [page, setPage] = React.useState(1);
  const [pageSize, setPageSize] = React.useState(10);
  const filtered = rows.filter((row) =>
    JSON.stringify(row).toLowerCase().includes(query.toLowerCase()),
  );
  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const currentPage = Math.min(page, totalPages);
  const paginated = filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize);
  function downloadInvoice(id) {
    window.open(`/api/v1/sales/${id}/invoice`, '_blank', 'noopener,noreferrer');
  }
  return (
    <section className="module-view">
      <div className="module-toolbar">
        <div>
          <p className="eyebrow">{eyebrow}</p>
          <h2>{title}</h2>
        </div>
        <div className="module-search">
          ⌕{' '}
          <input
            value={query}
            onChange={(event) => {
              setQuery(event.target.value);
              setPage(1);
            }}
            placeholder={`Buscar ${title.toLowerCase()}...`}
          />
        </div>
      </div>
      <div className="records-table">
        {paginated.map((row, index) => (
          <article className="record-row" key={row.id || row.id_persona || index}>
            {columns.map((column) => (
              <div key={column.key}>
                <small>{column.label}</small>
                <strong>{pick(row, column.keys, 'Sin datos')}</strong>
              </div>
            ))}
            {title === 'Ventas' && (
              <button
                type="button"
                className="text-button"
                onClick={() => downloadInvoice(row.id_venta || row.id)}
              >
                Factura
              </button>
            )}
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
