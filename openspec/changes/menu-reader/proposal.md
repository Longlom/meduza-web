# Proposal

## Why

The printed menus (brunch 7 pages, cocktails 12, dinner 14) are the owner's real design and the only menu guests should see. Guests read at the table on a phone, often on weak 4G, and share pages in Telegram, Zalo and Instagram. A page reader that feels like turning printed pages, works offline, and still gives search engines and screen readers the full text, is the heart of the app and feeds the Home screen.

## What Changes

- Add `/{locale}/menu` (redirects to the right menu by time of day) and `/{locale}/menu/[menu]?page=N` for `brunch`, `cocktails` and `dinner`.
- Build the page reader: segmented control, swipe and tap-zone page turning, zoom and pan, Contents sheet, Share, previous/next controls. On desktop it shows book-style spreads.
- Add a build script that turns the menu PDFs into optimised page images (AVIF and WebP, three sizes) and one Open Graph image per page.
- Render the full menu as visually hidden semantic HTML (the parked list is the data model), without showing a second visible menu.
- Add per-page sharing (Web Share with copy fallback) and per-page Open Graph metadata.
- Cache viewed pages and prefetch the current menu so it can be read offline.
- Add a design-system `BottomSheet` and a `.mz-visually-hidden` utility.

## Capabilities

### New Capabilities
- `menu-page-reader`: default menu by time, page turning, zoom, contents, deep links, desktop spreads, accessibility.
- `menu-text-layer`: hidden, complete, semantic text menu with prices and markers.
- `menu-sharing`: Share action and per-page Open Graph metadata.
- `menu-offline`: caching and prefetching of menu page images for offline reading.

### Modified Capabilities
<!-- none -->

## Impact

- New: `app/[locale]/(site)/menu/**`, `components/menu/*`, `lib/menu/manifest.ts`, `lib/menu/items.ts`, `scripts/menu-images.mjs`, `public/menu/**`, `public/og/menu/**`, design-system `BottomSheet`.
- Changed: `public/sw.js` (image caching rule from `app-shell`), `lib/i18n/*`, `package.json` (`sharp` devDependency).
- Depends on the `app-shell` change (layout, locale, service worker).
- Needs `poppler` (`pdftoppm`) on the machine that runs the image script; generated images are committed so deployment does not need it.

## Out of Scope

- Table QR code generation (a later polish task; this change only guarantees stable `?page=N` links).
- A visible list or search menu, dish detail sheets, ordering, allergen filters.
- Wine, spirits, classic cocktails, soft drinks and shisha text: the PDFs are not supplied, so the text layer omits them and nothing is invented.
- Admin upload of PDFs.
- Structured data (JSON-LD) for the menu.

## New [PLACEHOLDER] values

- `[MENU_EVENING_DEFAULT]`: which menu opens in the evening. Provisional value `cocktails`, to be confirmed by the owner.
- `[BRUNCH END]` and `[EVENING_STARTS]` (from `app-shell`) decide when the default switches from Brunch.
- Brunch item names in English are translations of the Russian-only PDF and are flagged unconfirmed.
- Vegetarian and spicy markers are flagged unconfirmed.
