import { VENUE_TZ, type Locale } from "@/lib/venue";

const intlLocale: Record<Locale, string> = { en: "en-GB", ru: "ru-RU" };

/** Formats a "YYYY-MM-DD" key at noon UTC so the time zone can never shift the day. */
function at(dateKey: string) {
  return new Date(`${dateKey}T12:00:00Z`);
}

/** "17 Nov" */
export function formatDayMonth(dateKey: string, locale: Locale) {
  return new Intl.DateTimeFormat(intlLocale[locale], {
    day: "numeric",
    month: "short",
    timeZone: "UTC"
  }).format(at(dateKey));
}

/** "Fri, 20 Nov" */
export function formatDayShort(dateKey: string, locale: Locale) {
  return new Intl.DateTimeFormat(intlLocale[locale], {
    weekday: "short",
    day: "numeric",
    month: "short",
    timeZone: "UTC"
  }).format(at(dateKey));
}

/** "Friday 20 November" */
export function formatDayLong(dateKey: string, locale: Locale) {
  return new Intl.DateTimeFormat(intlLocale[locale], {
    weekday: "long",
    day: "numeric",
    month: "long",
    timeZone: "UTC"
  }).format(at(dateKey));
}

/** "18:02": the wall-clock time in Nha Trang for an instant (epoch milliseconds). */
export function formatVenueTime(ms: number) {
  return new Intl.DateTimeFormat("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
    timeZone: VENUE_TZ
  }).format(new Date(ms));
}
