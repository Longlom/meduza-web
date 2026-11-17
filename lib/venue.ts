/** Venue facts and booking rules. Single source of truth for client and server. */

export const VENUE_TZ = "Asia/Ho_Chi_Minh";
/** Vietnam has no daylight saving: GMT+7 all year. */
export const VENUE_UTC_OFFSET_MIN = 7 * 60;

export const OPEN_FROM = "12:00";
/** Closing time. Times up to and including this one belong to the *previous* opening day. */
export const OPEN_TO = "02:00";

/**
 * Latest time a guest can book (env BOOKING_LAST_TIME, e.g. "23:30"). Defaults to closing time.
 * next.config.ts inlines it so the browser and the server apply the same rule.
 */
const envLast = process.env.BOOKING_LAST_TIME;
export const BOOKING_LAST_TIME = envLast && /^\d{2}:\d{2}$/.test(envLast) ? envLast : OPEN_TO;

/** Bookable only from this many minutes ahead. */
export const MIN_LEAD_MIN = 90;
export const SLOT_STEP_MIN = 30;

/** Days shown in the date picker (today first). */
export const DAYS_SHOWN = 14;
/** The server accepts bookings this far ahead. */
export const MAX_DAYS_AHEAD = 60;

/** [MAX_GUESTS] — unconfirmed by the owner; 20 for now. */
export const MAX_GUESTS = 20;

/** [HOLD POLICY] — shown on the confirmation screen until the owner confirms the real text. */
export const HOLD_POLICY_PLACEHOLDER = "[HOLD POLICY]";

/** [DEPOSIT / CANCELLATION POLICY] — shown in the cancel confirmation until the owner confirms the real text. */
export const CANCEL_POLICY_PLACEHOLDER = "[DEPOSIT / CANCELLATION POLICY]";

/** [EVENING_STARTS] — not confirmed by the owner. 17:00, the start of the Evening booking group, for now. */
export const EVENING_STARTS = "17:00";

/** [MENU_EVENING_DEFAULT] — which menu opens in the evening. Not confirmed by the owner; cocktails for now. */
export const MENU_EVENING_DEFAULT = "cocktails" as const;

export const LOCALES = ["en", "ru"] as const;
export type Locale = (typeof LOCALES)[number];
export const DEFAULT_LOCALE: Locale = "en";

export function isLocale(v: string | undefined | null): v is Locale {
  return v === "en" || v === "ru";
}
