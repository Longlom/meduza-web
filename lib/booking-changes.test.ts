import { describe, expect, it } from "vitest";
import { buildIcs } from "@/lib/calendar";
import { formatBookingMessage, formatCancelMessage } from "@/lib/telegram";
import { BookingSchema, CancelSchema, REFERENCE_RE } from "@/lib/validation";

const valid = { name: "Anna", phone: "+84 90 123 4567", date: "2026-11-20", time: "20:30", guests: 2 };

describe("replaces field", () => {
  it("accepts a well-formed reference and rejects others", () => {
    expect(BookingSchema.safeParse({ ...valid, replaces: "MDZ-4821" }).success).toBe(true);
    expect(BookingSchema.safeParse(valid).success).toBe(true);
    for (const bad of ["MDZ-482", "mdz-4821", "MDZ-48211", "4821", "MDZ-4821 "]) {
      expect(BookingSchema.safeParse({ ...valid, replaces: bad }).success).toBe(false);
    }
    expect(REFERENCE_RE.test("MDZ-0000")).toBe(true);
  });

  it("marks the hostess message as a change", () => {
    const b = BookingSchema.parse({ ...valid, time: "21:00", replaces: "MDZ-4821" });
    const text = formatBookingMessage(b, "MDZ-5555");
    expect(text).toContain("Change request — replaces MDZ-4821");
    expect(text).toContain("New reference: MDZ-5555");
    expect(text).toContain("21:00");
  });

  it("keeps the normal title without it", () => {
    const text = formatBookingMessage(BookingSchema.parse(valid), "MDZ-5555");
    expect(text).toContain("New booking · MDZ-5555");
    expect(text).not.toContain("Change request");
  });
});

describe("cancellation", () => {
  const cancel = { reference: "MDZ-4821", name: "Anna", phone: "+84 90 123 4567", date: "2026-11-20", time: "20:30" };

  it("builds the hostess message", () => {
    const text = formatCancelMessage(CancelSchema.parse(cancel));
    expect(text).toContain("Cancellation requested · MDZ-4821");
    expect(text).toContain("20:30");
    expect(text).toContain("Please verify with the guest");
  });

  it("spells out the real date after midnight", () => {
    const text = formatCancelMessage(CancelSchema.parse({ ...cancel, time: "01:00" }));
    expect(text).toContain("After midnight: Sat 21 Nov 01:00, still the Fri 20 Nov night.");
  });

  it("rejects a bad reference, phone or time", () => {
    expect(CancelSchema.safeParse({ ...cancel, reference: "XYZ-1" }).success).toBe(false);
    expect(CancelSchema.safeParse({ ...cancel, phone: "12" }).success).toBe(false);
    // A booking carried over from the old storage has no name or phone: still allowed.
    expect(CancelSchema.safeParse({ ...cancel, name: "", phone: "" }).success).toBe(true);
    expect(CancelSchema.safeParse({ ...cancel, time: "08:00" }).success).toBe(false);
  });
});

describe("calendar file", () => {
  it("puts the booking at the right Vietnam time with the reference in the title", () => {
    const ics = buildIcs({ reference: "MDZ-4821", date: "2026-11-20", time: "20:30", guests: 2, title: "Table at Meduza", note: "n" });
    expect(ics).toContain("DTSTART:20261120T133000Z"); // 20:30 in GMT+7
    expect(ics).toContain("DTEND:20261120T153000Z");
    expect(ics).toContain("SUMMARY:Table at Meduza · MDZ-4821");
  });

  it("rolls an after-midnight slot to the next calendar day", () => {
    const ics = buildIcs({ reference: "MDZ-4821", date: "2026-11-20", time: "01:00", guests: 2, title: "T", note: "n" });
    expect(ics).toContain("DTSTART:20261120T180000Z"); // 01:00 on the 21st, GMT+7
  });
});
