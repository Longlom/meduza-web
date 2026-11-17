import { describe, expect, it } from "vitest";
import { BookingSchema, checkSchedule, fieldErrors, normalizeInstagram, phoneOk } from "@/lib/validation";

const base = {
  name: "Anna",
  phone: "+84 90 123 4567",
  date: "2026-11-20",
  time: "20:30",
  guests: 2
};

const errorsOf = (input: Record<string, unknown>) => {
  const r = BookingSchema.safeParse({ ...base, ...input });
  return r.success ? {} : fieldErrors(r.error);
};

describe("phone", () => {
  it("needs 8 to 15 digits and only phone characters", () => {
    expect(phoneOk("+84 90 123 4567")).toBe(true);
    expect(phoneOk("12")).toBe(false);
    expect(phoneOk("+84 90 123 4567 89 01234")).toBe(false);
    expect(phoneOk("call me")).toBe(false);
  });
});

describe("instagram", () => {
  it("accepts @name, name and links", () => {
    expect(normalizeInstagram("@anna.nt")).toBe("anna.nt");
    expect(normalizeInstagram("https://www.instagram.com/anna.nt/?hl=en")).toBe("anna.nt");
  });
  it("rejects spaces and symbols", () => {
    expect(errorsOf({ instagram: "bad name!" }).instagram).toBe("instagram");
  });
  it("is optional", () => {
    expect(errorsOf({}).instagram).toBeUndefined();
  });
});

describe("booking fields", () => {
  it("accepts a valid request", () => {
    expect(BookingSchema.safeParse(base).success).toBe(true);
  });
  it("reports guest limits with their own codes", () => {
    expect(errorsOf({ guests: 0 }).guests).toBe("guests");
    expect(errorsOf({ guests: 21 }).guests).toBe("guests_max");
  });
  it("reports hours and last-time errors separately", () => {
    expect(errorsOf({ time: "03:00" }).time).toBe("time_hours");
    expect(errorsOf({ time: "20:15" }).time).toBe("time_hours");
    expect(errorsOf({ time: "01:00" }).time).toBe("time_last");
    expect(errorsOf({ time: "23:30" }).time).toBeUndefined();
  });
  it("rejects impossible dates", () => {
    expect(errorsOf({ date: "2026-02-31" }).date).toBe("date");
  });
});

describe("schedule rules", () => {
  const now = new Date("2026-11-17T11:00:00Z"); // 18:00 in Nha Trang
  it("rejects slots under 1.5 hours ahead", () => {
    expect(checkSchedule("2026-11-17", "19:00", now)).toBe("time_past");
    expect(checkSchedule("2026-11-17", "19:30", now)).toBeNull();
  });
  it("rejects dates more than 60 days ahead", () => {
    expect(checkSchedule("2027-03-01", "20:00", now)).toBe("date_far");
  });
});
