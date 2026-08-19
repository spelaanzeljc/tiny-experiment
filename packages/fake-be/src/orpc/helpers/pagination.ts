interface CreatePaginatedResponseInput<TItem> {
  items: TItem[];
  page?: number | null;
  limit?: number | null;
}

export function createPaginatedResponse<TItem>({ items, page, limit }: CreatePaginatedResponseInput<TItem>) {
  const currentPage = page ?? 1;
  const currentLimit = limit ?? 10;
  const start = (currentPage - 1) * currentLimit;
  const nextPage = currentPage * currentLimit < items.length ? currentPage + 1 : null;

  return {
    items: items.slice(start, start + currentLimit),
    page: currentPage,
    cursor: String(currentPage),
    nextCursor: nextPage ? String(nextPage) : null,
    limit: currentLimit,
    totalItems: items.length,
  };
}
