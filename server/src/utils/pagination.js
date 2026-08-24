function normalizePage(value, fallback = 1) {
  const page = Number(value ?? fallback);
  return Number.isFinite(page) && page > 0 ? Math.floor(page) : fallback;
}

function normalizeLimit(value, fallback = 10, max = 50) {
  const limit = Number(value ?? fallback);
  if (!Number.isFinite(limit) || limit <= 0) {
    return fallback;
  }
  return Math.min(Math.floor(limit), max);
}

function paginateCollection(items, page, limit) {
  const safeItems = Array.isArray(items) ? items : [];
  const currentPage = normalizePage(page, 1);
  const currentLimit = normalizeLimit(limit, 10, 50);
  const total = safeItems.length;
  const totalPages = Math.max(1, Math.ceil(total / currentLimit));
  const boundedPage = Math.min(currentPage, totalPages);
  const offset = (boundedPage - 1) * currentLimit;
  const data = safeItems.slice(offset, offset + currentLimit);

  return {
    data,
    total,
    page: boundedPage,
    totalPages,
    limit: currentLimit,
  };
}

function normalizeListResponse(result, page, limit) {
  if (Array.isArray(result)) {
    return { success: true, ...paginateCollection(result, page, limit) };
  }

  const payload = result && typeof result === 'object' ? result : {};
  const data = Array.isArray(payload.data) ? payload.data : [];
  const total = Number(payload.total ?? data.length ?? 0);
  const currentPage = normalizePage(payload.page ?? page ?? 1, 1);
  const currentLimit = normalizeLimit(payload.limit ?? limit ?? 10, 10, 50);
  const totalPages = Number(payload.totalPages ?? Math.max(1, Math.ceil(total / currentLimit)));

  return {
    success: true,
    data: data.length ? data : payload.data || [],
    total,
    page: currentPage,
    totalPages,
    limit: currentLimit,
  };
}

module.exports = { normalizePage, normalizeLimit, paginateCollection, normalizeListResponse };
