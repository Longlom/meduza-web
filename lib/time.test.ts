import { describe, expect, it } from "vitest";
import {
  currentOpeningDay,
  isBookable,
  isNotAfterLastBooking,
  isOpenNow,
  isOpenSlot,
  slotCalendarDate,
  slotInstant
} from "@/lib/time";
import { ALL_SLOTS, SLOT_GROUPS, dayHasSlots, defaultSlot, pickableDays } from "@/lib/slots";

/** Vietnam is UTC+7, so 18:00 in Nha Trang is 11:00 UTC. */
const vn = (date: string, hhmm: string) => new Date(`${date}T${hhmm}:00+07:00`);

describe("opening day", () => {
  it("is still yesterday at 00:30", () => {
    expect(currentOpeningDay(vn("2026-11-18", "00:30"))).toBe("2026-11-17");
  });
  it("switches to today at 02:00 sharp", () => {
    expect(currentOpeningDay(vn("2026-11-18", "01:59"))).toBe("2026-11-17");
    expect(currentOpeningDay(vn("2026-11-18", "02:00"))).toBe("2026-11-18");
  });
  it("is today during the day", () => {
    expect(currentOpeningDay(vn("2026-11-17", "15:00"))).toBe("2026-11-17");
  });
});

describe("open now", () => {
  it("is open until 02:00 and closed until 12:00", () => {
    expect(isOpenNow(vn("2026-11-18", "01:59"))).toBe(true);
    expect(isOpenNow(vn("2026-11-18", "02:00"))).toBe(false);
    expect(isOpenNow(vn("2026-11-18", "11:59"))).toBe(false);
    expect(isOpenNow(vn("2026-11-18", "12:00"))).toBe(true);
  });
});

describe("slots", () => {
  it("accepts only half-hour marks from 12:00 to 02:00", () => {
    expect(isOpenSlot("12:00")).toBe(true);
    expect(isOpenSlot("00:30")).toBe(true);
    expect(isOpenSlot("02:00")).toBe(true);
    expect(isOpenSlot("02:30")).toBe(false);
    expect(isOpenSlot("11:30")).toBe(false);
    expect(isOpenSlot("20:15")).toBe(false);
  });

  it("puts after-midnight slots on the next calendar date", () => {
    expect(slotCalendarDate("2026-11-20", "23:30")).toBe("2026-11-20");
    expect(slotCalendarDate("2026-11-20", "01:00")).toBe("2026-11-21");
    expect(slotInstant("2026-11-20", "01:00").toISOString()).toBe("2026-11-20T18:00:00.000Z");
  });

  it("stops at the last bookable time (23:30)", () => {
    expect(isNotAfterLastBooking("23:30")).toBe(true);
    expect(isNotAfterLastBooking("00:00")).toBe(false);
    expect(ALL_SLOTS.at(-1)).toBe("23:30");
    expect(SLOT_GROUPS.map((g) => g.times.length)).toEqual([10, 10, 4]);
  });
});

describe("1.5 hour lead time", () => {
  const now = vn("2026-11-17", "18:00");
  it("disables slots before 19:30 and allows 19:30", () => {
    expect(isBookable("2026-11-17", "19:00", now)).toBe(false);
    expect(isBookable("2026-11-17", "19:30", now)).toBe(true);
  });
  it("picks 20:30 by default when it is free", () => {
    expect(defaultSlot("2026-11-17", now)).toBe("20:30");
  });
  it("offers 14 days from today's opening day", () => {
    const days = pickableDays(now);
    expect(days).toHaveLength(14);
    expect(days[0]).toBe("2026-11-17");
  });
  it("has no slots left late at night on the current opening day", () => {
    expect(dayHasSlots("2026-11-17", vn("2026-11-18", "00:30"))).toBe(false);
    expect(dayHasSlots("2026-11-18", vn("2026-11-18", "00:30"))).toBe(true);
  });
});
