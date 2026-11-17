import { describe, expect, it } from "vitest";
import { sectionOf } from "@/lib/sections";

describe("sectionOf", () => {
  it("maps paths to tabs", () => {
    expect(sectionOf("/en")).toBe("home");
    expect(sectionOf("/ru/menu/dinner")).toBe("menu");
    expect(sectionOf("/en/book")).toBe("book");
    expect(sectionOf("/en/booking/MDZ-1234")).toBe("book");
    expect(sectionOf("/en/visit")).toBe("visit");
    expect(sectionOf("/en/nope")).toBeNull();
  });
});
