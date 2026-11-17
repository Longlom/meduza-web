import { describe, expect, it } from "vitest";
import { VENUE, contactHref, directionsHref, openStatus, venueValue } from "@/lib/venue-info";

const vn = (date: string, hhmm: string) => new Date(`${date}T${hhmm}:00+07:00`);

describe("placeholders", () => {
  it("flags bracketed values", () => {
    expect(venueValue("[PHONE]").placeholder).toBe(true);
    expect(venueValue("+84 90 123 4567").placeholder).toBe(false);
  });

  it("flags every unconfirmed entry in the venue record", () => {
    const flagged = Object.entries(VENUE)
      .filter(([, v]) => v.value.startsWith("["))
      .every(([, v]) => v.placeholder);
    expect(flagged).toBe(true);
    expect(VENUE.phone.placeholder).toBe(true);
    expect(VENUE.address.placeholder).toBe(false);
  });

  it("never gives a link for a placeholder", () => {
    expect(contactHref("phone")).toBeNull();
    expect(contactHref("telegram")).toBeNull();
    expect(contactHref("grab")).toBeNull();
  });

  it("always gives a directions link with the encoded address", () => {
    expect(contactHref("directions")).toBe(directionsHref());
    expect(directionsHref()).toContain("destination=157%20Nguy%E1%BB%85n%20Thi%E1%BB%87n%20Thu%E1%BA%ADt");
  });
});

describe("open status", () => {
  it("is open at 01:59 until 02:00", () => {
    expect(openStatus(vn("2026-11-18", "01:59"))).toEqual({ open: true, until: "02:00" });
  });
  it("is closed at 02:00 and opens at 12:00", () => {
    expect(openStatus(vn("2026-11-18", "02:00"))).toEqual({ open: false, opensAt: "12:00" });
  });
  it("is closed at 11:59", () => {
    expect(openStatus(vn("2026-11-18", "11:59")).open).toBe(false);
  });
});
