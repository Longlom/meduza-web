import { addDays, currentOpeningDay, fromMin, isBookable, isNotAfterLastBooking, toMin } from "@/lib/time";
import { DAYS_SHOWN, SLOT_STEP_MIN } from "@/lib/venue";

export type SlotGroupId = "day" | "evening" | "late";

/** Day 12:00–16:30 · Evening 17:00–21:30 · Late 22:00–02:00 (the design's three groups). */
const RANGES: Array<{ id: SlotGroupId; from: string; to: string }> = [
  { id: "day", from: "12:00", to: "16:30" },
  { id: "evening", from: "17:00", to: "21:30" },
  { id: "late", from: "22:00", to: "26:00" }
];

/** Groups are cut at the last bookable time (BOOKING_LAST_TIME); a group with no slots left is dropped. */
export const SLOT_GROUPS: Array<{ id: SlotGroupId; times: string[] }> = RANGES.map((r) => {
  const times: string[] = [];
  for (let m = toMin(r.from); m <= toMin(r.to); m += SLOT_STEP_MIN) times.push(fromMin(m));
  return { id: r.id, times: times.filter(isNotAfterLastBooking) };
}).filter((g) => g.times.length > 0);

export const ALL_SLOTS = SLOT_GROUPS.flatMap((g) => g.times);

/** Preferred default when the guest has not picked a time yet. */
const PREFERRED_SLOT = "20:30";

export function availableSlots(openingDay: string, now: Date) {
  return ALL_SLOTS.filter((t) => isBookable(openingDay, t, now));
}

export function defaultSlot(openingDay: string, now: Date) {
  const ok = availableSlots(openingDay, now);
  if (ok.includes(PREFERRED_SLOT)) return PREFERRED_SLOT;
  return ok[0] ?? null;
}

/** The 14 opening days the picker shows, first one being "today's" opening day. */
export function pickableDays(now: Date) {
  const first = currentOpeningDay(now);
  return Array.from({ length: DAYS_SHOWN }, (_, i) => addDays(first, i));
}

export function dayHasSlots(openingDay: string, now: Date) {
  return availableSlots(openingDay, now).length > 0;
}
