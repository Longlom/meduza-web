import { createElement as h } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { VenueAction } from "@/components/VenueAction";
import { VENUE, contactHref, venueValue } from "@/lib/venue-info";

const confirmed = {
  ...VENUE,
  phone: venueValue("+84 90 123 4567"),
  telegram: venueValue("@meduza_nt")
};

describe("VenueAction", () => {
  it("renders plain text, not a link, while the value is a placeholder", () => {
    const html = renderToStaticMarkup(h(VenueAction, { kind: "phone" }, "Call"));
    expect(html).not.toContain("<a");
    expect(html).not.toContain("tel:");
    expect(html).toContain("[PHONE]");
    expect(html).toContain('data-placeholder="true"');
  });

  it("renders a tel: link once the value is confirmed", () => {
    const html = renderToStaticMarkup(h(VenueAction, { kind: "phone", venue: confirmed }, "Call"));
    expect(html).toContain('href="tel:+84901234567"');
    expect(html).not.toContain("[PHONE]");
  });

  it("builds messenger links from confirmed handles", () => {
    expect(contactHref("telegram", confirmed)).toBe("https://t.me/meduza_nt");
  });
});
