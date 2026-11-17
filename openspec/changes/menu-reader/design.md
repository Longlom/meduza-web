# Design

## Context

The menus exist as three PDFs in `info/menu/` (originals and `_compressed` copies) and as 33 rasterised JPEGs in `design/assets/menu-pages/` (910×1287, 4.7 MB). The parked list screen (`design/screens/parked-list-menu.dc.html`) holds 76 brunch and dinner items with Russian names and prices in thousands; the cocktail strengths and prices are in `HANDOFF.md`. The reader behaviour comes from `m2-menu-reader.dc.html` (phone) and `desktop-menu.dc.html` (spreads: cover alone, then pairs). `app-shell` provides the layout, locale routing and the service worker. See `proposal.md` and the specs for scope and behaviour.

## Goals / Non-Goals

**Goals:**
- Pages that feel like paper: fast swipe, smooth pinch zoom, no layout shift.
- Sharp text when zoomed, small images when not.
- Searchable text without a second visible menu.

**Non-Goals:**
- A CMS or upload flow. New PDFs are processed by re-running the script and committing the output.
- Dish-level pages or filters.

## Decisions

**Image pipeline.** `scripts/menu-images.mjs` renders each PDF page at 1800 px width with macOS PDFKit (`scripts/render-pdf.swift`, no software to install), then `sharp` writes AVIF and WebP at 450, 900 and 1800 px into `public/menu/{menu}/{nn}-{w}.{avif,webp}`, and a 1200×630 JPEG (page centred on the Abyss background) into `public/og/menu/{menu}-{nn}.jpg`. Output is committed so deployment needs neither Swift nor the PDFs; re-running the script needs a Mac. *Why not the existing JPEGs:* they are 910 px wide, so a true 2× or zoomed view would be blurry; they remain the fallback if poppler cannot be installed. *Alternative:* render at runtime in an API route. Rejected: slow, costly, needs a server toolchain.

**Reader is a client component, the route is dynamic.** `/menu/[menu]` reads `searchParams` on the server so the first HTML already shows the requested page and carries per-page Open Graph metadata. HTML is not cached, but images are static and immutable. `/menu` is a tiny dynamic redirect using Vietnam time. *Alternative:* path-based pages (`/menu/cocktails/4`). Rejected: the handoff fixes `?page=N`, and table QR codes depend on it.

**Gestures without a library.** Pointer Events on one stage element. Swipe needs more than 50 px, mostly horizontal, and ignores the first 20 px at the screen edge (iOS back gesture). Pinch uses two pointers and toggles zoom (out past 1.3x, in below 0.75x). Zoomed, the page is a native scroll container (an image at 230% width), so panning is the browser's own scrolling; `touch-action` is `pan-y` on the stage. *Alternative:* `@use-gesture`. Rejected for now to avoid a dependency; revisit if gestures prove fragile.

**Zoom uses the 1800 px image only when zoomed;** the fitted view uses 900 px (450 px for Contents thumbnails and Home cards). `<picture>` gives AVIF with a WebP fallback for older Safari.

**Contents.** On a phone, a new design-system `BottomSheet` built on a native `<dialog>` (focus trap, Escape, scrim) with a grabber, snaps at 55% and 92% and drag-to-close, per the mobile rules; it will be reused for later sheets. On desktop the design (`desktop-menu`) shows Contents as a permanent sidebar next to the spread, so that is what is built; the sheet's side-panel mode exists but the reader does not use it.

**Data model.** `lib/menu/manifest.ts` holds menus, page count and per-locale page titles (taken from the m2 screen). `lib/menu/items.ts` holds the text menu. A one-off script `scripts/extract-parked-menu.mjs` evaluates the parked list data in a sandbox to generate the first `items.ts`, which is then reviewed and edited by hand and becomes the source of truth. Items carry `confirmed` flags; `npm run menu:unconfirmed` reports them. `MenuTextLayer` is a server component using a new `.mz-visually-hidden` utility (not `display:none`, which hides text from assistive technology) and a system font, so the invisible Russian and Vietnamese text never makes a phone download web-font files. Vegetarian and spicy markers are published only once confirmed; all current markers are unconfirmed, so none is shown.

**Default menu.** `/menu` chooses Brunch before the evening start and the configured evening default (provisional `cocktails`) after it. The evening default matches Home's evening carousel and the Glow identity; it is flagged for owner confirmation.

**Offline.** The `app-shell` service worker gains a cache-first rule for `/menu/**` images in a versioned cache, and the reader messages it to prefetch the rest of the current menu when idle, skipping when `navigator.connection.saveData` is on or the type is `2g`. File names carry a content hash so a new menu never serves an old page.

**Opening page.** Switching menus opens page 2 (first content page), as in `m2` and `desktop-menu`; a deep link without `page` opens page 2 too. The cover is reachable with previous.

**Offline, as built.** `public/sw-menu-version.js` (written by the image script, imported by the worker) names the menu cache, so changing any page replaces the cache and deletes the old one. The reader asks the worker to cache the pages being read on a first visit (before the worker controls the page) and, unless data saving or 2g, the rest of the menu after 1.5 s. Neighbouring pages are preloaded only after the visible page has loaded, so they never compete with it. A page that cannot load shows "Page not available offline" with Try again; broken Contents thumbnails are hidden.

**Metadata.** `htmlLimitedBots: /.*/` sends metadata up front for every client: the reader reads `?page=`, which makes the route dynamic, and Next would otherwise stream the `<head>` tags after the first chunk.

## Risks / Trade-offs

- [Rendering depends on macOS PDFKit] → output is committed; on another OS install poppler (`pdftoppm`) and swap the render step. No install was needed here.
- [Gesture conflicts with the browser (back swipe, page zoom)] → edge exclusion, `touch-action` switching, tests on iOS Safari and Chrome Android emulation.
- [Large images use memory when zoomed] → load the 1800 px image only on zoom and release on page change.
- [AVIF in old browsers] → WebP fallback through `<picture>`.
- [Committed images grow the repo (measured 19 MB for pages plus 1.8 MB for share images)] → acceptable; use hashed names so old versions can be deleted when menus change.
- [Hidden text diverges from the printed pages] → single reviewed data file and the unconfirmed report; owner confirmation before launch.

## Open Questions

- Whether the evening default should be Dinner instead of Cocktails (owner decision; only the default constant changes).
