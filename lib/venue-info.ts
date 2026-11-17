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

/** Lowest hookah price (Meduza Classic), VND. Shown as "from …" on Home. */
export const HOOKAH_FROM_VND = 600_000;

export const VENUE = {
  address: venueValue("157 Nguyễn Thiện Thuật, Nha Trang"),
  addressFull: venueValue("157 Nguyễn Thiện Thuật, Nha Trang, Khánh Hòa"),
  phone: venueValue("+84889761669"),
  /** A phone number: Telegram opens the chat by number (t.me/+…). A handle such as "@name" also works. */
  telegram: venueValue("+84 889761669"),
  zalo: venueValue("+84889761669"),
  instagram: venueValue("@meduza_nhatrang"),
  /** An embeddable map address (https URL). While it is a placeholder the Visit page shows the address and a maps link instead. */
  mapEmbed: venueValue("[MAP EMBED]"),
  brunchHours: venueValue("12:00 – 16:00"),
  dinnerHours: venueValue("[DINNER HOURS]"),
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
    case "telegram": {
      // A phone number (digits, spaces, +) opens the chat by number; anything else is a handle.
      const isNumber = /^\+?[\d\s()-]+$/.test(v.value.trim());
      return isNumber ? `https://t.me/+${v.value.replace(/\D/g, "")}` : `https://t.me/${handle(v.value)}`;
    }
    case "zalo":
      return `https://zalo.me/${v.value.replace(/\D/g, "")}`;
    case "instagram":
      return `https://instagram.com/${handle(v.value)}`;
  }
}

/** The venue's Google Maps place link. Directions and "Open in Maps" both use it. */
export const MAPS_LINK = "https://maps.app.goo.gl/aCXWFbkuG3wcHPTB6";

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
