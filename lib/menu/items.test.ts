import { describe, expect, it } from "vitest";
import { COCKTAILS, STRENGTH_WORDS } from "@/lib/menu/cocktails";
import { FOOD_MENUS } from "@/lib/menu/items";
import { pageTitle } from "@/lib/menu/manifest";

describe("signature cocktails", () => {
  it("match the handoff table", () => {
    const table: Array<[string, number, number]> = [
      ["Eyes of Meduza", 2, 280_000],
      ["Frozen Gaze", 2, 260_000],
      ["The Siren Secret", 3, 260_000],
      ["Pearl Venom", 2, 260_000],
      ["Abyss Whisper", 2, 260_000],
      ["Lush by Meduza", 1, 280_000],
      ["Neptune’s Kiss", 1, 260_000],
      ["The Oasis", 1, 260_000],
      ["Eden Above", 3, 280_000],
      ["Coastal Bloom", 1, 280_000]
    ];
    expect(COCKTAILS.map((c) => [c.name, c.strength, c.price])).toEqual(table);
  });

  it("sit on the page that carries their name", () => {
    for (const c of COCKTAILS) expect(pageTitle("cocktails", c.page, "en")).toBe(c.name);
  });

  it("have strength words in both languages", () => {
    expect(STRENGTH_WORDS.en[3]).toBe("Strong");
    expect(STRENGTH_WORDS.ru[1]).toBe("Лёгкий");
  });
});

describe("food menus", () => {
  const items = Object.values(FOOD_MENUS).flatMap((sections) => sections.flatMap((s) => s.items));

  it("hold the 58 brunch and dinner items", () => {
    expect(items).toHaveLength(58);
  });

  it("expand printed thousands to full VND", () => {
    const tartare = FOOD_MENUS.dinner.flatMap((s) => s.items).find((i) => i.name.startsWith("Salmon & mango tartare"));
    expect(tartare?.price).toBe(240_000);
  });

  it("flags every English brunch name as unconfirmed, and markers where present", () => {
    for (const i of FOOD_MENUS.brunch.flatMap((s) => s.items)) expect(i.unconfirmed).toContain("name");
    for (const i of items.filter((i) => i.veg)) expect(i.unconfirmed).toContain("veg");
    for (const i of items.filter((i) => i.spicy)) expect(i.unconfirmed).toContain("spicy");
    expect(FOOD_MENUS.dinner.flatMap((s) => s.items).filter((i) => !i.veg && !i.spicy).every((i) => !i.unconfirmed)).toBe(true);
  });

  it("have no invented prices: every priced item is a multiple of 10,000 VND", () => {
    for (const i of items) if (i.price) expect(i.price % 10_000).toBe(0);
  });
});
