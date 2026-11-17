import { z } from "zod";
import {
  DATE_RE,
  currentOpeningDay,
  diffDays,
  isBookable,
  isNotAfterLastBooking,
  isOpenSlot,
  isRealDateKey
} from "@/lib/time";
import { MAX_DAYS_AHEAD, MAX_GUESTS } from "@/lib/venue";

/** Digits and common phone symbols. */
export const PHONE_ALLOWED = /^[0-9+()\-.\s#xX]*$/;
const IG_RE = /^[A-Za-z0-9._]{1,30}$/;

/**
 * Error codes, not sentences: the client turns them into EN/RU text (lib/i18n),
 * the server just returns them.
 */
export type ErrorCode =
  | "name"
  | "phone"
  | "instagram"
  | "date"
  | "time_hours"
  | "time_last"
  | "time_past"
  | "date_far"
  | "guests"
  | "guests_max"
  | "notes"
  | "rate_limited"
  | "invalid"
  | "server"
  | "telegram";

export function digitsIn(v: string) {
  return v.replace(/\D/g, "");
}

export function phoneOk(v: string) {
  if (!PHONE_ALLOWED.test(v)) return false;
  const n = digitsIn(v).length;
  return n >= 8 && n <= 15;
}

/** Accepts "@name", "name" or a pasted instagram.com link; returns the bare handle. */
export function normalizeInstagram(v: string) {
  return v
    .trim()
    .replace(/^https?:\/\/(www\.)?instagram\.com\//i, "")
    .replace(/[/?#].*$/, "")
    .replace(/^@+/, "");
}

/** "MDZ-" and four digits, the reference the guest sees. */
export const REFERENCE_RE = /^MDZ-\d{4}$/;

export const BookingSchema = z.object({
  name: z.string().trim().min(2, "name").max(80, "name"),
  phone: z.string().trim().refine(phoneOk, "phone"),
  instagram: z
    .string()
    .default("")
    .transform(normalizeInstagram)
    .refine((v) => v === "" || IG_RE.test(v), "instagram"),
  date: z
    .string()
    .regex(DATE_RE, "date")
    .refine(isRealDateKey, "date"),
  time: z.string().refine(isOpenSlot, "time_hours").refine(isNotAfterLastBooking, "time_last"),
  guests: z
    .number({ invalid_type_error: "guests" })
    .int("guests")
    .min(1, "guests")
    .max(MAX_GUESTS, "guests_max"),
  notes: z.string().trim().max(800, "notes").default(""),
  locale: z.enum(["en", "ru"]).default("en"),
  /** Set when this request changes an earlier one: the reference it replaces. */
  replaces: z
    .string()
    .regex(REFERENCE_RE, "invalid")
    .optional(),
  /** Honeypot: real guests never see or fill this field. */
  website: z.string().max(200).optional().default("")
});

export type BookingInput = z.infer<typeof BookingSchema>;

/**
 * A cancellation request. The server cannot know whether the booking exists, so this only checks the
 * shape; the hostess verifies it with the guest. No lead-time rule: a guest may cancel any time.
 */
export const CancelSchema = z.object({
  reference: z.string().regex(REFERENCE_RE, "invalid"),
  // Optional: a booking carried over from before details were stored has neither. The hostess uses the reference.
  name: z.string().trim().max(80, "name").default(""),
  phone: z
    .string()
    .trim()
    .refine((v) => v === "" || phoneOk(v), "phone")
    .default(""),
  date: z.string().regex(DATE_RE, "date").refine(isRealDateKey, "date"),
  time: z.string().refine(isOpenSlot, "time_hours"),
  locale: z.enum(["en", "ru"]).default("en"),
  website: z.string().max(200).optional().default("")
});

export type CancelInput = z.infer<typeof CancelSchema>;

/** Rules that depend on "now": lead time and how far ahead. Returns an error code or null. */
export function checkSchedule(date: string, time: string, now: Date): ErrorCode | null {
  const first = currentOpeningDay(now);
  if (diffDays(first, date) > MAX_DAYS_AHEAD) return "date_far";
  if (!isBookable(date, time, now)) return "time_past";
  return null;
}

export type FieldErrors = Partial<Record<keyof BookingInput, ErrorCode>>;

/** Flatten a zod failure into one error code per field. */
export function fieldErrors<K extends string = keyof BookingInput>(error: z.ZodError): Partial<Record<K, ErrorCode>> {
  const out: Partial<Record<K, ErrorCode>> = {};
  for (const issue of error.issues) {
    const key = issue.path[0] as K | undefined;
    if (!key || out[key]) continue;
    out[key] = (typeof issue.message === "string" ? issue.message : "invalid") as ErrorCode;
  }
  return out;
}
