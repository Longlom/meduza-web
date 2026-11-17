import { describe, expect, it } from "vitest";
import { imageChoice, prefetchUrls, shouldPrefetch } from "@/lib/menu/offline";

describe("shouldPrefetch", () => {
  it("prefetches on a normal connection and when the API is missing", () => {
    expect(shouldPrefetch(undefined)).toBe(true);
    expect(shouldPrefetch({ effectiveType: "4g" })).toBe(true);
    expect(shouldPrefetch({ effectiveType: "3g" })).toBe(true);
  });
  it("does not prefetch with data saver or a 2g connection", () => {
    expect(shouldPrefetch({ saveData: true, effectiveType: "4g" })).toBe(false);
    expect(shouldPrefetch({ effectiveType: "2g" })).toBe(false);
    expect(shouldPrefetch({ effectiveType: "slow-2g" })).toBe(false);
  });
});

describe("prefetch list", () => {
  it("covers every page of the menu in the chosen size", () => {
    const urls = prefetchUrls("cocktails", "avif", 900);
    expect(urls).toHaveLength(12);
    expect(urls.every((u) => u.endsWith("-900.avif"))).toBe(true);
    expect(new Set(urls).size).toBe(12);
  });
  it("reads the choice back from a loaded image URL", () => {
    expect(imageChoice("http://x/menu/dinner/04-d749c507-900.avif")).toEqual({ width: 900, ext: "avif" });
    expect(imageChoice("/menu/dinner/04-d749c507-450.webp")).toEqual({ width: 450, ext: "webp" });
    expect(imageChoice("/photos/tank.jpg")).toBeNull();
  });
});
