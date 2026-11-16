export type Locale = 'en' | 'ru' | 'vi';

/** Join class names, skipping falsy values. */
export function cx(...parts: Array<string | false | null | undefined>): string {
  return parts.filter(Boolean).join(' ');
}

const intlLocale: Record<Locale, string> = { en: 'en-US', ru: 'ru-RU', vi: 'vi-VN' };

/**
 * Format a VND price the Meduza way: grouped digits + ₫, no decimals.
 * en → "260,000 ₫" · ru → "260 000 ₫" · vi → "260.000 ₫"
 */
export function formatPrice(vnd: number, locale: Locale = 'en'): string {
  const n = new Intl.NumberFormat(intlLocale[locale], { maximumFractionDigits: 0 }).format(vnd);
  return `${n} ₫`;
}

/** Compact price for chips and tight rows: 260000 → "260k" (en), "260 тыс." (ru), "260k" (vi). */
export function formatPriceCompact(vnd: number, locale: Locale = 'en'): string {
  if (vnd >= 1_000_000) {
    const m = new Intl.NumberFormat(intlLocale[locale], { maximumFractionDigits: 2 }).format(vnd / 1_000_000);
    return locale === 'ru' ? `${m} млн ₫` : `${m}M ₫`;
  }
  const k = Math.round(vnd / 1000);
  return locale === 'ru' ? `${k} тыс. ₫` : `${k}k ₫`;
}

/** Meduza is open 12:00–02:00 Vietnam time (GMT+7). */
export const VENUE_TIME_ZONE = 'Asia/Ho_Chi_Minh';

/** Build half-hour slots between two "HH:MM" times, wrapping past midnight (e.g. 12:00 → 02:00). */
export function buildSlots(from = '12:00', to = '02:00', stepMinutes = 30): string[] {
  const toMin = (t: string) => { const [h, m] = t.split(':').map(Number); return h * 60 + m; };
  let start = toMin(from);
  let end = toMin(to);
  if (end <= start) end += 24 * 60;
  const out: string[] = [];
  for (let t = start; t <= end; t += stepMinutes) {
    const mm = t % (24 * 60);
    out.push(`${String(Math.floor(mm / 60)).padStart(2, '0')}:${String(mm % 60).padStart(2, '0')}`);
  }
  return out;
}
