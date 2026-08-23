import React from 'react';
import { pick } from '../api/client';

export default function RecordsPage({ title, eyebrow, rows, columns }) {
  const [query, setQuery] = React.useState('');
  const filtered = rows.filter((row) => JSON.stringify(row).toLowerCase().includes(query.toLowerCase()));
  return <section className="module-view"><div className="module-toolbar"><div><p className="eyebrow">{eyebrow}</p><h2>{title}</h2></div><div className="module-search">⌕ <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder={`Buscar ${title.toLowerCase()}...`} /></div></div><div className="records-table">{filtered.map((row, index) => <article className="record-row" key={row.id || row.id_persona || index}>{columns.map((column) => <div key={column.key}><small>{column.label}</small><strong>{pick(row, column.keys, 'Sin datos')}</strong></div>)}</article>)}</div></section>;
}
