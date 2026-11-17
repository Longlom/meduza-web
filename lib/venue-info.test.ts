import { describe, expect, it } from "vitest";
import { MAPS_LINK, VENUE, contactHref, directionsHref, openStatus, venueValue } from "@/lib/venue-info";

// What the record looked like before the owner confirmed the contacts.
const unconfirmed = {
  ...VENUE,
  phone: venueValue("[PHONE]"),
  telegram: venueValue("[TELEGRAM @HANDLE]"),
  zalo: venueValue("[ZALO NUMBER]"),
  instagram: venueValue("[INSTAGRAM @HANDLE]")
};

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
    expect(VENUE.address.placeholder).toBe(false);
    expect(VENUE.mapEmbed.placeholder).toBe(true);
  });

  it("never gives a link for a placeholder", () => {
    expect(contactHref("phone", unconfirmed)).toBeNull();
    expect(contactHref("telegram", unconfirmed)).toBeNull();
    expect(contactHref("zalo", unconfirmed)).toBeNull();
    expect(contactHref("instagram", unconfirmed)).toBeNull();
  });

  it("builds the confirmed contact links", () => {
    expect(contactHref("phone")).toBe("tel:+84889761669");
    expect(contactHref("zalo")).toBe("https://zalo.me/84889761669");
    expect(contactHref("instagram")).toBe("https://instagram.com/meduza_nhatrang");
    // Telegram is a phone number, so it opens the chat by number.
    expect(contactHref("telegram")).toBe("https://t.me/+84889761669");
  });

  it("holds the confirmed hours", () => {
    expect(VENUE.brunchHours.value).toBe("12:00 – 16:00");
    expect(VENUE.kitchenCloses.value).toBe("00:30");
    expect(VENUE.brunchEnd.value).toBe("16:00");
  });

  it("always gives the Google Maps link for directions", () => {
    expect(contactHref("directions")).toBe(directionsHref());
    expect(directionsHref()).toBe(MAPS_LINK);
    expect(MAPS_LINK).toBe("https://maps.app.goo.gl/aCXWFbkuG3wcHPTB6");
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
