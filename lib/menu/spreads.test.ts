import { describe, expect, it } from "vitest";
import { nextSpreadStart, prevSpreadStart, spreadPages, spreadStart } from "@/lib/menu/spreads";

describe("spreads", () => {
  it("shows the cover alone and then pairs", () => {
    expect(spreadPages(1, 14)).toEqual([1]);
    expect(spreadPages(2, 14)).toEqual([2, 3]);
    expect(spreadPages(3, 14)).toEqual([2, 3]);
    expect(spreadPages(4, 14)).toEqual([4, 5]);
  });

  it("puts the last page alone when the count is even", () => {
    expect(spreadPages(14, 14)).toEqual([14]);
    expect(spreadPages(12, 12)).toEqual([12]);
  });

  it("pairs the last two pages when the count is odd", () => {
    expect(spreadPages(7, 7)).toEqual([6, 7]);
    expect(spreadStart(7)).toBe(6);
  });

  it("walks forward and back through a 7 page menu", () => {
    const seen: number[] = [];
    for (let p: number | null = 1; p !== null; p = nextSpreadStart(p, 7)) seen.push(p);
    expect(seen).toEqual([1, 2, 4, 6]);
    expect(prevSpreadStart(6)).toBe(4);
    expect(prevSpreadStart(2)).toBe(1);
    expect(prevSpreadStart(1)).toBeNull();
    expect(nextSpreadStart(6, 7)).toBeNull();
  });
});
