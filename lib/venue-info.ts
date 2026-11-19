import { OPEN_FROM, OPEN_TO } from "./venue";
import { isOpenNow } from "./time";

/**
 * One record for what guests need to know about Meduza.
 * A value written in square brackets (upper case) is a placeholder awaiting the owner: it is shown as plain text
 * and never turned into a link. To confirm a value, replace the bracketed text with the real one.
 */
export type VenueValue = { value: string; placeholder: boolean };

const PLACEHOLDER_RE = /^\[[^\]]+\]$/;

export function venueValue(value: string): VenueValue {
  return { value, placeholder: PLACEHOLDER_RE.test(value.trim()) };
}

export const VENUE_NAME = "Meduza — Cocktails & Cuisine";

/**
 * OpenStreetMap embed centred on the venue (12.23688, 109.19408); the app draws its own glowing pin on the
 * centre. No key or account needed. The bounding box is about 350 m across, which is street level.
 */
export const MAP_EMBED_URL =
  "https://www.openstreetmap.org/export/embed.html?bbox=109.1924764%2C12.2352777%2C109.1956764%2C12.2384777&layer=mapnik";

/** Lowest hookah price (Meduza Classic), VND. Shown as "from …" on Home. */
export const HOOKAH_FROM_VND = 600_000;

export const VENUE = {
  address: venueValue("157 Nguyễn Thiện Thuật, Nha Trang"),
  addressFull: venueValue("157 Nguyễn Thiện Thuật, Nha Trang, Khánh Hòa"),
  phone: venueValue("+84889761669"),
  /** Needs a Telegram username. A phone number does not work: t.me/+number says "no such user" unless the owner is findable by number. */
  telegram: venueValue("[TELEGRAM @HANDLE]"),
  zalo: venueValue("+84889761669"),
  instagram: venueValue("@meduza_nhatrang"),
  /** The embeddable map address (an https URL). If it is ever a placeholder the Visit page shows a pin and a maps link instead. */
  mapEmbed: venueValue(MAP_EMBED_URL),
  brunchHours: venueValue("12:00 – 16:00"),
  dinnerHours: venueValue("16:00 – 00:30"),
  kitchenCloses: venueValue("00:30"),
  eveningStarts: venueValue("[EVENING_STARTS]"),
  /** Brunch runs 12:00–16:00, so it ends at 16:00. */
  brunchEnd: venueValue("16:00")
} as const;

export type VenueRecord = typeof VENUE;

export type ContactKind = "phone" | "telegram" | "zalo" | "instagram" | "directions";

const handle = (v: string) => v.trim().replace(/^@+/, "");

/** The real link for a contact, or null while its value is still a placeholder. */
export function contactHref(kind: ContactKind, venue: VenueRecord = VENUE): string | null {
  if (kind === "directions") return directionsHref();
  const v = venue[kind];
  if (v.placeholder) return null;
  switch (kind) {
    case "phone":
      return `tel:${v.value.replace(/[^\d+]/g, "")}`;
    case "telegram":
      return `https://t.me/${handle(v.value)}`;
    case "zalo":
      return `https://zalo.me/${v.value.replace(/\D/g, "")}`;
    case "instagram":
      return `https://instagram.com/${handle(v.value)}`;
  }
}

/** The venue's Google Maps place link. Directions and "Open in Maps" both use it. */
export const MAPS_LINK = "https://maps.app.goo.gl/aCXWFbkuG3wcHPTB6";

/** True once a Telegram username is confirmed. Until then every Telegram button and row is hidden. */
export function telegramAvailable(venue: VenueRecord = VENUE): boolean {
  return !venue.telegram.placeholder;
}

/** Opens the venue in the guest's maps app. */
export function directionsHref(): string {
  return MAPS_LINK;
}

export type OpenStatusInfo =
  | { open: true; until: string }
  | { open: false; opensAt: string };

/** Open 12:00 until 02:00 the next day (Vietnam time). */
export function openStatus(now: Date): OpenStatusInfo {
  return isOpenNow(now) ? { open: true, until: OPEN_TO } : { open: false, opensAt: OPEN_FROM };
}
