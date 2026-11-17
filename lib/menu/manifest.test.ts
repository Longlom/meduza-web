import { existsSync } from "node:fs";
import { describe, expect, it } from "vitest";
import {
  DEFAULT_PAGE,
  MENUS,
  MENU_IDS,
  clampPage,
  ogImage,
  pageAlt,
  pageCount,
  pageImage,
  pageTitle
} from "@/lib/menu/manifest";

describe("menu manifest", () => {
  it("has 7, 12 and 14 pages", () => {
    expect(pageCount("brunch")).toBe(7);
    expect(pageCount("cocktails")).toBe(12);
    expect(pageCount("dinner")).toBe(14);
  });

  it("has an English and a Russian title for every page", () => {
    for (const id of MENU_IDS) {
      for (const p of MENUS[id].pages) {
        expect(p.en.length).toBeGreaterThan(0);
        expect(p.ru.length).toBeGreaterThan(0);
      }
      expect(MENUS[id].title.en && MENUS[id].title.ru).toBeTruthy();
    }
  });

  it("names the pages the way the handoff does", () => {
    expect(pageTitle("cocktails", 4, "en")).toBe("The Siren Secret");
    expect(pageTitle("dinner", 4, "en")).toBe("Salads");
    expect(pageAlt("dinner", 4, "en")).toBe("Dinner menu, page 4: Salads");
  });

  it("has an image file for every page, size and format", () => {
    for (const id of MENU_IDS) {
      for (let p = 1; p <= pageCount(id); p++) {
        for (const w of [450, 900, 1800] as const) {
          for (const ext of ["avif", "webp"] as const) {
            expect(existsSync(`public${pageImage(id, p, w, ext)}`), `${id} ${p} ${w} ${ext}`).toBe(true);
          }
        }
        expect(existsSync(`public${ogImage(id, p)}`)).toBe(true);
      }
    }
  });
});

describe("?page=N", () => {
  it("opens that page", () => {
    expect(clampPage("cocktails", "4")).toBe(4);
  });
  it("clamps numbers outside the range", () => {
    expect(clampPage("cocktails", "99")).toBe(12);
    expect(clampPage("cocktails", "0")).toBe(1);
    expect(clampPage("cocktails", "-3")).toBe(1);
  });
  it("opens the default page for anything that is not a number", () => {
    expect(clampPage("cocktails", "abc")).toBe(DEFAULT_PAGE);
    expect(clampPage("cocktails", undefined)).toBe(DEFAULT_PAGE);
    expect(clampPage("cocktails", "2.5")).toBe(DEFAULT_PAGE);
    expect(clampPage("cocktails", "")).toBe(DEFAULT_PAGE);
  });
});
