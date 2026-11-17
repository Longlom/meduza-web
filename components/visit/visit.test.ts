import { createElement as h } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { VisitContacts } from "@/components/visit/VisitContacts";
import { VisitMap } from "@/components/visit/VisitMap";
import { VENUE, directionsHref, openStatus, venueValue } from "@/lib/venue-info";

const confirmed = {
  ...VENUE,
  phone: venueValue("+84 90 123 4567"),
  telegram: venueValue("@meduza_nt"),
  zalo: venueValue("0901234567"),
  instagram: venueValue("@meduza.nt"),
  mapEmbed: venueValue("https://www.google.com/maps/embed?pb=test")
};

describe("VisitContacts", () => {
  it("shows no links while every value is a placeholder", () => {
    const html = renderToStaticMarkup(h(VisitContacts, { locale: "en" }));
    expect(html).not.toContain("<a");
    for (const m of ["[TELEGRAM @HANDLE]", "[ZALO NUMBER]", "[INSTAGRAM @HANDLE]", "[PHONE]"]) expect(html).toContain(m);
  });

  it("turns confirmed values into the right links", () => {
    const html = renderToStaticMarkup(h(VisitContacts, { locale: "en", venue: confirmed }));
    expect(html).toContain('href="https://t.me/meduza_nt"');
    expect(html).toContain('href="https://zalo.me/0901234567"');
    expect(html).toContain('href="https://instagram.com/meduza.nt"');
    expect(html).toContain('href="tel:+84901234567"');
  });

  it("is localised", () => {
    expect(renderToStaticMarkup(h(VisitContacts, { locale: "ru" }))).toContain("Связь с хостес");
  });
});

describe("VisitMap", () => {
  it("shows the address slot with the marker while the embed is a placeholder", () => {
    const html = renderToStaticMarkup(h(VisitMap, { locale: "en" }));
    expect(html).not.toContain("<iframe");
    expect(html).toContain("[MAP EMBED]");
    expect(html).toContain("Open in Maps");
  });

  it("embeds the map once configured", () => {
    const html = renderToStaticMarkup(h(VisitMap, { locale: "en", venue: confirmed }));
    expect(html).toContain('<iframe');
    expect(html).toContain("maps/embed?pb=test");
    expect(html).not.toContain("[MAP EMBED]");
  });

  it("ignores a non-https embed value", () => {
    const html = renderToStaticMarkup(h(VisitMap, { locale: "en", venue: { ...VENUE, mapEmbed: venueValue("http://x") } }));
    expect(html).not.toContain("<iframe");
  });
});

describe("Visit hours badge and directions", () => {
  // Vietnam is UTC+7, so 22:00 there is 15:00Z.
  const at = (hh: number, mm: number) => new Date(Date.UTC(2026, 5, 10, hh - 7, mm));
  it("is open until 02:00 and closed from 02:00 to 11:59", () => {
    expect(openStatus(at(22, 0)).open).toBe(true);
    expect(openStatus(new Date(Date.UTC(2026, 5, 10, 18, 59))).open).toBe(true); // 01:59 next day
    expect(openStatus(new Date(Date.UTC(2026, 5, 10, 19, 0))).open).toBe(false); // 02:00
    expect(openStatus(at(11, 59)).open).toBe(false);
    expect(openStatus(at(12, 0)).open).toBe(true);
  });
  it("directions target the full address", () => {
    expect(decodeURIComponent(directionsHref())).toContain("157 Nguyễn Thiện Thuật, Nha Trang, Khánh Hòa");
  });
});
