export function absoluteUrl(value, base) { return new URL(value, base).toString(); }
export function normalizePages(pages = []) { return pages.filter((page) => typeof page === 'string' && page.startsWith('http')); }
