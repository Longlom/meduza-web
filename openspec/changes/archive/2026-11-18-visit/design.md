# Design

## Context

The phone design is `m5-visit.dc.html`: a map block, Directions (the "Open in Grab" button was removed at the owner's request), an hours card with a live badge, a "Talk to the hostess" list (Telegram, Zalo, Instagram, Call). The "Good to know" tiles were removed at the owner's request. Almost every value is a placeholder, and no desktop Visit screen exists; the desktop Home screen has a visit block (hours, address, phone, map). The venue record, `VenueAction` and `OpenStatus` come from `app-shell`. See `proposal.md` for scope.

## Goals / Non-Goals

**Goals:**
- A page that is useful today (address, hours, directions) and fills in as the owner confirms values.
- Placeholders that are obvious to the team and never produce broken links.

**Non-Goals:**
- An interactive map or a map API key.

## Decisions

**All content from the venue record.** The page is a server component reading `lib/venue-info.ts` and the dictionaries; only `OpenStatus` is a client island. Adding a confirmed value in one place updates Visit, Home and Booking.

**Map without a key.** The free Google embed cannot be styled dark and a styled map needs a provider key. Until the owner supplies `[MAP EMBED]`, show the address block with an "Open in Maps" link built from the address. When a dark embed or static image is provided, the map slot renders it with a `title` and lazy loading. *Alternative:* an unstyled free embed now. Rejected: it clashes with the Abyss design and still counts as the supplied embed.

**Desktop layout.** Derived from the desktop Home visit block: a two-column grid (map and actions left, hours, contacts and tiles right) from 900 px. Flagged for review because no screen exists.

**Languages tile.** "EN · RU · VI" describes the languages the team speaks, as in the design; it does not imply a Vietnamese website, which `localization` still excludes.

## Risks / Trade-offs

- [The page looks sparse while values are placeholders] → intended and visible; the report command shows what remains.
- [No desktop design] → derive from the Home visit block and ask for review before launch.
- [A guessed address link opens the wrong spot] → build the maps link from the address in the venue record and confirm it with the owner once.

## Open Questions

- Whether the owner wants a custom dark map image or embed (the page works without both).
