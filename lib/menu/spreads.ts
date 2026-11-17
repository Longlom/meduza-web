/**
 * Desktop shows the menu like a printed book: the cover alone, then pairs of pages
 * (2–3, 4–5, …), with a single page last when the count is odd. Pages are 1-based.
 */
export function spreadStart(page: number): number {
  if (page <= 1) return 1;
  return page % 2 === 0 ? page : page - 1;
}

export function spreadPages(page: number, count: number): number[] {
  const start = spreadStart(page);
  if (start === 1) return [1];
  return start + 1 <= count ? [start, start + 1] : [start];
}

/** First page of the next spread, or null at the end. */
export function nextSpreadStart(page: number, count: number): number | null {
  const start = spreadStart(page);
  const next = start === 1 ? 2 : start + 2;
  return next <= count ? next : null;
}

/** First page of the previous spread, or null at the start. */
export function prevSpreadStart(page: number): number | null {
  const start = spreadStart(page);
  if (start <= 1) return null;
  return start === 2 ? 1 : start - 2;
}
