import { COCKTAILS, type Strength } from "@/lib/menu/cocktails";
import { FOOD_MENUS } from "@/lib/menu/items";
import type { MenuId } from "@/lib/menu/manifest";

/** One card of the Home carousel. It always opens the menu reader on `page` of `menu`. */
export type FeaturedCard = {
  menu: MenuId;
  page: number;
  /** Jellyfish strength (cocktails). */
  strength?: Strength;
  /** Exact price (cocktails). */
  price?: number;
  /** Lowest price in the section, shown as "from …" (brunch). */
  from?: number;
  /** Key of a short description in the dictionary (brunch pages without a price line). */
  note?: "viet" | "classic" | "sweet";
};

const lowest = (menu: "brunch" | "dinner", sectionId: string) => {
  const prices = FOOD_MENUS[menu].find((s) => s.id === sectionId)?.items.flatMap((i) => (i.price ? [i.price] : [])) ?? [];
  return prices.length ? Math.min(...prices) : undefined;
};

/** Evening: the 10 signature cocktails, in menu order. */
export function eveningCards(): FeaturedCard[] {
  return COCKTAILS.map((c) => ({ menu: "cocktails", page: c.page, strength: c.strength, price: c.price }));
}

/** Day: brunch highlights, taken from the brunch menu pages in the M1 design. */
export function dayCards(): FeaturedCard[] {
  return [
    { menu: "brunch", page: 2, from: lowest("brunch", "pasta") },
    { menu: "brunch", page: 4, note: "viet" },
    { menu: "brunch", page: 5, note: "classic" },
    { menu: "brunch", page: 6, from: lowest("brunch", "classic") },
    { menu: "brunch", page: 7, note: "sweet" }
  ];
}
