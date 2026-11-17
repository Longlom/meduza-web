import {
  MIN_LEAD_MIN,
  BOOKING_LAST_TIME,
  OPEN_FROM,
  OPEN_TO,
  SLOT_STEP_MIN,
  VENUE_UTC_OFFSET_MIN
} from "@/lib/venue";

/**
 * All venue time logic lives here. Dates are "YYYY-MM-DD" keys and times are "HH:MM",
 * both in Vietnam time. An "opening day" runs from 12:00 until 02:00 the next calendar day:
 * a booking for "Fri 20 Nov 01:00" means the night of Friday, i.e. 01:00 on Saturday 21 Nov.
 */

export const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;
export const TIME_RE = /^\d{2}:\d{2}$/;

export function pad2(n: number) {
  return String(n).padStart(2, "0");
}

export function toMin(hhmm: string) {
  const [h, m] = hhmm.split(":").map(Number);
  return h * 60 + m;
}

export function fromMin(total: number) {
  const m = ((total % 1440) + 1440) % 1440;
  return `${pad2(Math.floor(m / 60))}:${pad2(m % 60)}`;
}

/** Real calendar date check ("2026-02-31" is rejected). */
export function isRealDateKey(key: string) {
  if (!DATE_RE.test(key)) return false;
  const [y, m, d] = key.split("-").map(Number);
  const dt = new Date(Date.UTC(y, m - 1, d));
  return dt.getUTCFullYear() === y && dt.getUTCMonth() === m - 1 && dt.getUTCDate() === d;
}

export function addDays(key: string, n: number) {
  const [y, m, d] = key.split("-").map(Number);
  const dt = new Date(Date.UTC(y, m - 1, d + n));
  return `${dt.getUTCFullYear()}-${pad2(dt.getUTCMonth() + 1)}-${pad2(dt.getUTCDate())}`;
}

export function diffDays(a: string, b: string) {
  const [ay, am, ad] = a.split("-").map(Number);
  const [by, bm, bd] = b.split("-").map(Number);
  return Math.round((Date.UTC(by, bm - 1, bd) - Date.UTC(ay, am - 1, ad)) / 86_400_000);
}

/** Wall-clock date and minutes since midnight in Nha Trang for an instant. */
export function venueClock(now: Date) {
  const shifted = new Date(now.getTime() + VENUE_UTC_OFFSET_MIN * 60_000);
  return {
    dateKey: `${shifted.getUTCFullYear()}-${pad2(shifted.getUTCMonth() + 1)}-${pad2(shifted.getUTCDate())}`,
    minutes: shifted.getUTCHours() * 60 + shifted.getUTCMinutes()
  };
}

/** The opening day "today" belongs to: between 00:00 and closing it is still yesterday's night. */
export function currentOpeningDay(now: Date) {
  const { dateKey, minutes } = venueClock(now);
  return minutes < toMin(OPEN_TO) ? addDays(dateKey, -1) : dateKey;
}

/** True for 12:00–02:00 half-hour marks. */
export function isOpenSlot(time: string) {
  if (!TIME_RE.test(time)) return false;
  const m = toMin(time);
  if (m % SLOT_STEP_MIN !== 0 || m < 0 || m >= 1440) return false;
  return m >= toMin(OPEN_FROM) || m <= toMin(OPEN_TO);
}

/** True if the slot is not later than the last bookable time. */
export function isNotAfterLastBooking(time: string) {
  return slotOffsetMin(time) <= slotOffsetMin(BOOKING_LAST_TIME);
}

/** Minutes since the opening day's midnight: 12:00 → 720, 02:00 → 1560. */
export function slotOffsetMin(time: string) {
  const m = toMin(time);
  return m <= toMin(OPEN_TO) ? m + 1440 : m;
}

/** The actual instant of a slot on a given opening day. */
export function slotInstant(openingDay: string, time: string) {
  const [y, mo, d] = openingDay.split("-").map(Number);
  return new Date(Date.UTC(y, mo - 1, d) + (slotOffsetMin(time) - VENUE_UTC_OFFSET_MIN) * 60_000);
}

/** The real calendar date a slot falls on (after-midnight slots roll to the next date). */
export function slotCalendarDate(openingDay: string, time: string) {
  return toMin(time) <= toMin(OPEN_TO) ? addDays(openingDay, 1) : openingDay;
}

export function isBookable(openingDay: string, time: string, now: Date) {
  return slotInstant(openingDay, time).getTime() >= now.getTime() + MIN_LEAD_MIN * 60_000;
}

export function isOpenNow(now: Date) {
  const { minutes } = venueClock(now);
  return minutes >= toMin(OPEN_FROM) || minutes < toMin(OPEN_TO);
}
