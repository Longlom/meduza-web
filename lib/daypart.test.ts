import { describe, expect, it } from "vitest";
import { daypart } from "@/lib/daypart";
import { defaultMenu } from "@/lib/menu/default";

const vn = (date: string, hhmm: string) => new Date(`${date}T${hhmm}:00+07:00`);

describe("daypart", () => {
  it("is day before the evening start", () => {
    expect(daypart(vn("2026-11-17", "11:00"))).toBe("day");
    expect(daypart(vn("2026-11-17", "16:59"))).toBe("day");
  });
  it("is evening from the start, and still after midnight", () => {
    expect(daypart(vn("2026-11-17", "17:00"))).toBe("evening");
    expect(daypart(vn("2026-11-18", "01:30"))).toBe("evening");
  });
  it("is day again from 02:00", () => {
    expect(daypart(vn("2026-11-18", "02:00"))).toBe("day");
  });
});

describe("default menu", () => {
  it("is brunch during the day and the evening default after the start", () => {
    expect(defaultMenu(vn("2026-11-17", "11:00"))).toBe("brunch");
    expect(defaultMenu(vn("2026-11-17", "21:00"))).toBe("cocktails");
    expect(defaultMenu(vn("2026-11-18", "01:00"))).toBe("cocktails");
  });
});
