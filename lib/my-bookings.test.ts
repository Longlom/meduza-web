import { describe, expect, it } from "vitest";
import {
  BOOKINGS_KEY,
  LEGACY_KEY,
  activeBooking,
  getBooking,
  hasPassed,
  isActive,
  markCancelled,
  migrateLegacy,
  pruneExpired,
  readBookings,
  saveBooking,
  saveChange
} from "@/lib/my-bookings";

function memory() {
  const data = new Map<string, string>();
  return {
    getItem: (k: string) => data.get(k) ?? null,
    setItem: (k: string, v: string) => void data.set(k, v),
    removeItem: (k: string) => void data.delete(k)
  };
}

const base = { name: "Anna", phone: "+84901234567", instagram: "", notes: "", guests: 2 };
// Vietnam is UTC+7: "20:30 on 2026-11-17" local is 13:30Z.
const vn = (date: string, hh: number, mm = 0) => {
  const [y, m, d] = date.split("-").map(Number);
  return new Date(Date.UTC(y, m - 1, d, hh - 7, mm));
};

describe("my bookings store", () => {
  it("saves a pending record with the details and survives a re-read", () => {
    const s = memory();
    saveBooking({ ...base, reference: "MDZ-1111", date: "2026-11-17", time: "20:30" }, s);
    const list = readBookings(s);
    expect(list).toHaveLength(1);
    expect(list[0]).toMatchObject({ reference: "MDZ-1111", status: "pending", name: "Anna", time: "20:30" });
    expect(getBooking(list, "MDZ-1111")?.guests).toBe(2);
    expect(getBooking(list, "MDZ-9999")).toBeNull();
  });

  it("stays active until the opening day ends, including after midnight", () => {
    const b = { ...base, reference: "MDZ-1111", date: "2026-11-17", time: "20:30", sentAt: 1, status: "pending" as const };
    expect(isActive(b, vn("2026-11-17", 21))).toBe(true);
    // 01:30 on the 18th is still the 17th's night.
    expect(isActive(b, vn("2026-11-18", 1, 30))).toBe(true);
    // 02:00 on the 18th: the opening day ended.
    expect(isActive(b, vn("2026-11-18", 2, 0))).toBe(false);
    expect(isActive(b, vn("2026-11-18", 14))).toBe(false);
  });

  it("prunes expired records on the next visit", () => {
    const s = memory();
    saveBooking({ ...base, reference: "MDZ-1111", date: "2026-11-17", time: "20:30" }, s);
    saveBooking({ ...base, reference: "MDZ-2222", date: "2026-11-20", time: "19:00" }, s);
    pruneExpired(vn("2026-11-18", 14), s);
    expect(readBookings(s).map((b) => b.reference)).toEqual(["MDZ-2222"]);
  });

  it("picks the next pending booking for the Book tab, ignoring cancelled ones", () => {
    const s = memory();
    saveBooking({ ...base, reference: "MDZ-2222", date: "2026-11-18", time: "20:30", sentAt: 20 }, s);
    saveBooking({ ...base, reference: "MDZ-1111", date: "2026-11-17", time: "20:30", sentAt: 10 }, s);
    const now = vn("2026-11-17", 12);
    expect(activeBooking(readBookings(s), now)?.reference).toBe("MDZ-1111");
    markCancelled("MDZ-1111", s);
    expect(activeBooking(readBookings(s), now)?.reference).toBe("MDZ-2222");
    markCancelled("MDZ-2222", s);
    expect(activeBooking(readBookings(s), now)).toBeNull();
  });

  it("prefers an upcoming booking over one whose time has passed", () => {
    const s = memory();
    saveBooking({ ...base, reference: "MDZ-1111", date: "2026-11-17", time: "12:00" }, s);
    saveBooking({ ...base, reference: "MDZ-2222", date: "2026-11-18", time: "20:30" }, s);
    expect(activeBooking(readBookings(s), vn("2026-11-17", 19))?.reference).toBe("MDZ-2222");
    // Only a past one left: still shown until the opening day ends.
    markCancelled("MDZ-2222", s);
    expect(activeBooking(readBookings(s), vn("2026-11-17", 19))?.reference).toBe("MDZ-1111");
  });

  it("knows when the booked time has passed", () => {
    const b = { ...base, reference: "MDZ-1111", date: "2026-11-17", time: "20:30", sentAt: 1, status: "pending" as const };
    expect(hasPassed(b, vn("2026-11-17", 20, 29))).toBe(false);
    expect(hasPassed(b, vn("2026-11-17", 20, 30))).toBe(true);
    // An after-midnight booking (01:00) belongs to the night of the 17th: it is 01:00 on the 18th.
    const late = { ...b, time: "01:00" };
    expect(hasPassed(late, vn("2026-11-17", 23))).toBe(false);
    expect(hasPassed(late, vn("2026-11-18", 1, 0))).toBe(true);
  });

  it("a change marks the old record Changed and links the new one", () => {
    const s = memory();
    saveBooking({ ...base, reference: "MDZ-1111", date: "2026-11-17", time: "20:30" }, s);
    saveChange("MDZ-1111", { ...base, reference: "MDZ-3333", date: "2026-11-17", time: "21:00" }, s);
    const list = readBookings(s);
    expect(getBooking(list, "MDZ-1111")).toMatchObject({ status: "changed", replacedBy: "MDZ-3333" });
    expect(getBooking(list, "MDZ-3333")).toMatchObject({ status: "pending", time: "21:00" });
  });

  it("migrates the old single record once, without personal details", () => {
    const s = memory();
    s.setItem(LEGACY_KEY, JSON.stringify({ reference: "MDZ-4821", date: "2026-11-17", time: "20:30", guests: 3, sentAt: 5 }));
    migrateLegacy(s);
    expect(s.getItem(LEGACY_KEY)).toBeNull();
    const list = readBookings(s);
    expect(list).toHaveLength(1);
    expect(list[0]).toMatchObject({ reference: "MDZ-4821", status: "pending", guests: 3, name: "", sentAt: 5 });
    migrateLegacy(s);
    expect(readBookings(s)).toHaveLength(1);
  });

  it("ignores broken stored data", () => {
    const s = memory();
    s.setItem(BOOKINGS_KEY, "{not json");
    expect(readBookings(s)).toEqual([]);
    s.setItem(BOOKINGS_KEY, JSON.stringify([{ reference: 1 }, null, "x"]));
    expect(readBookings(s)).toEqual([]);
  });
});
