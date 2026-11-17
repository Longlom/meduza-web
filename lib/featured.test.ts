import { describe, expect, it } from "vitest";
import { dayCards, eveningCards } from "@/lib/featured";
import { MENUS, pageCount, pageTitle } from "@/lib/menu/manifest";

describe("evening cards", () => {
  const cards = eveningCards();
  it("are the 10 signature cocktails with strength and price", () => {
    expect(cards).toHaveLength(10);
    expect(cards.every((c) => c.menu === "cocktails" && c.strength && c.price)).toBe(true);
  });
  it("open the page that carries the cocktail's name", () => {
    expect(pageTitle("cocktails", cards[2].page, "en")).toBe("The Siren Secret");
    expect(cards[2].page).toBe(4);
  });
});

describe("day cards", () => {
  const cards = dayCards();
  it("are five brunch pages inside the menu", () => {
    expect(cards).toHaveLength(5);
    for (const c of cards) {
      expect(c.page).toBeGreaterThanOrEqual(2);
      expect(c.page).toBeLessThanOrEqual(pageCount("brunch"));
      expect(MENUS.brunch.pages[c.page - 1].en.length).toBeGreaterThan(0);
    }
  });
  it("show the lowest real price where the design says 'from'", () => {
    expect(cards.find((c) => c.page === 2)?.from).toBe(200_000);
    expect(cards.find((c) => c.page === 6)?.from).toBe(150_000);
  });
});
