export default function Pagination({
  page,
  pageSize,
  totalItems,
  onPageChange,
  onPageSizeChange,
  pageSizeOptions = [10, 25, 50],
}) {
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  const pages = totalPages <= 5
    ? Array.from({ length: totalPages }, (_, index) => index + 1)
    : page <= 3
      ? [1, 2, 3, 'ellipsis', totalPages]
      : page >= totalPages - 2
        ? [1, 'ellipsis', totalPages - 2, totalPages - 1, totalPages]
        : [1, 'ellipsis', page, 'ellipsis-end', totalPages];

  if (totalItems === 0) {
    return null;
  }

  return (
    <div className="pagination-bar">
      <div className="pagination-meta">
        <span>Página {page}</span>
        <span>{totalItems} registros</span>
      </div>

      <div className="pagination-controls">
        <button type="button" className="pagination-arrow" aria-label="Página anterior" disabled={page <= 1} onClick={() => onPageChange(page - 1)}>
          ‹
        </button>

        {pages.map((pageNumber, index) => pageNumber.toString().startsWith('ellipsis') ? (
          <span className="pagination-ellipsis" key={`${pageNumber}-${index}`}>...</span>
        ) : (
          <button key={pageNumber} type="button" className={pageNumber === page ? 'active' : ''} onClick={() => onPageChange(pageNumber)}>
            {pageNumber}
          </button>
        ))}

        <button type="button" className="pagination-arrow" aria-label="Página siguiente" disabled={page >= totalPages} onClick={() => onPageChange(page + 1)}>
          ›
        </button>
      </div>

      <label className="pagination-size">
        Ver
        <select value={pageSize} onChange={(event) => onPageSizeChange(Number(event.target.value))}>
          {pageSizeOptions.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      </label>
    </div>
  );
}
