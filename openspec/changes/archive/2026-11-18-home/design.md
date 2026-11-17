# Design

## Context

Home today is a stub (logo, one line, one button). The design is `m1-home.dc.html` (phone) and `desktop-home.dc.html`. Its data: 10 cocktails (page image, name, strength, price) and 5 brunch highlight pages, with the cocktail table repeated in `HANDOFF.md`. Photos live in `design/assets/photos` (7 to 288 KB each) and `menu-crops`. The shell, venue record and live status come from `app-shell`; page images, the manifest and deep links come from `menu-reader`. See `proposal.md` for scope.

## Goals / Non-Goals

**Goals:**
- A fast first paint on 4G, with the hero as the largest content under 2.5 s.
- Content that follows the time of day with no hydration warnings and no visible jump.

**Non-Goals:**
- A CMS for Home content: copy is in the dictionaries and the featured items come from the menu data.

## Decisions

**Server component with small client islands.** The page and all static sections are server components. Client islands: `OpenStatus` (from `app-shell`) and `FeaturedCarousel` (needs the live clock). Everything else needs no JavaScript.

**Time of day.** `lib/daypart.ts` exports `daypart(now)` returning `"day"` or `"evening"` from Vietnam time and the evening start (provisional 17:00 in `lib/venue-info.ts`, flagged). The page uses `export const revalidate = 60`, so cached HTML is at most one minute old. The page passes the server's `initialDaypart` to the island, which renders it on the first client render (so hydration matches) and then recomputes in an effect and on a 60 s tick. *Alternative:* fully dynamic rendering. Rejected: it removes caching for a page that changes once a day. *Alternative:* render client-only after mount. Rejected: layout shift and no content without JavaScript.

**Featured data.** `lib/featured.ts` derives evening cards from `lib/menu/items.ts` (cocktails with strength and price) and day cards from a short list of brunch page numbers from the m1 design, so a menu update changes Home automatically. Cards use the 450 px page images from `menu-reader`.

**Carousel.** CSS scroll-snap with `scroll-padding` to show the next card; on desktop, previous and next buttons call `scrollBy`. No library.

**Photography.** Use `next/image` (built-in optimiser, AVIF and WebP) for the hero and experience cards, with explicit `width` and `height`, `priority` only on the hero, `sizes` set per layout and quality tuned so the phone hero is under 150 KB. Source photos are copied from `design/assets/photos` into `public/photos`. Menu page images keep using the pre-generated files.

**Theme.** The Visit card uses the design-system `Theme` wrapper with `pearl`; brunch and dinner cards use `data-mood="lantern"`. Glow stays the leading accent of the screen (one filled button).

**Quick actions.** Built from `VenueAction`, so Call and Message degrade to plain text while values are placeholders.

**Copy and prices.** Add a `home` namespace to both dictionaries. The hookah "from" price is the lowest hookah price constant formatted with `formatPrice`.

## Risks / Trade-offs

- [ISR serves a stale daypart for up to 60 s] → the client corrects it after hydration.
- [The hero photo may exceed 150 KB at high pixel density] → cap `sizes`, test on a 3× phone emulation, and lower the quality if needed.
- [The evening start is unconfirmed] → one flagged constant; the report command lists it.
- [Home depends on menu data being final] → the carousel reads from the same reviewed data as the text layer, so wrong data is fixed in one place.

## Open Questions

- Which brunch pages the day carousel should highlight beyond the five in the m1 design (owner preference only; the list is a constant).
