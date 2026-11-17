# Tasks

## 1. Page images

- [x] 1.1 Render the PDF pages sharply without installing anything (macOS PDFKit via `scripts/render-pdf.swift`). Verify all 7 + 12 + 14 pages render at 1800 px and one page matches the printed design.
- [x] 1.2 Add `sharp` as a devDependency and write `scripts/menu-images.mjs` (PDF page to 450/900/1800 px AVIF and WebP, hashed names). Verify the script outputs 7 + 12 + 14 pages in all sizes.
- [x] 1.3 Extend the script to write 1200×630 Open Graph JPEGs per page. Verify one file opens and shows the page centred on the dark background.
- [x] 1.4 Verify the hero page images are small (900 px AVIF under 150 KB each) and commit the generated files; add an `npm run menu:images` script and document it in the README.

## 2. Data

- [x] 2.1 Create `lib/menu/manifest.ts` with menus, page counts, page titles (EN and RU) and image paths. Verify a Vitest test checks 7, 12 and 14 pages and that every title exists in both locales.
- [x] 2.2 Write `scripts/extract-parked-menu.mjs` that evaluates the parked list data and generates `lib/menu/items.ts`. Verify it yields the 58 brunch and dinner items (the parked list also holds 18 condensed mock drink items, which are excluded) and review the output by hand.
- [x] 2.3 Add the 10 signature cocktails with strengths and prices from the handoff, and mark unconfirmed content. Verify a Vitest test checks the table values and the price expansion (240 to 240,000).
- [x] 2.4 Add `npm run menu:unconfirmed` and verify it lists the unconfirmed brunch names and markers.

## 3. Design system

- [x] 3.1 Add `.mz-visually-hidden` to `design-system/src/styles/base.css` and verify the text stays in the accessibility tree.
- [x] 3.2 Build `BottomSheet` (native `<dialog>`, grabber, 55%/92% snaps, scrim, drag to close, Escape, side-panel mode from 900 px). Verify with the keyboard and by dragging at 390 px. Check against `design/screens/m2-menu-reader.dc.html` and `desktop-menu.dc.html`.

## 4. Reader screen

- [x] 4.1 Create the routes: `/menu` (dynamic redirect by Vietnam time) and `/menu/[menu]` reading `?page`. Verify the redirect at 11:00 and after the evening start, and the clamping of `?page=0`, `99` and `abc`.
- [x] 4.2 Build the phone layout: title, Contents and Share buttons, segmented control, fitted A4 stage with reserved space, controls row. Check at 390 px against `m2-menu-reader.dc.html`.
- [x] 4.3 Add page turning: swipe, tap thirds, buttons and arrow keys, with disabled ends. Verify each input on page 1, a middle page and the last page, and check at 390 px.
- [x] 4.4 Add zoom and pan (Pointer Events, 1800 px image on zoom, reset on page or menu change). Verify tap, pinch and button zoom in browser emulation; check at 390 px.
- [x] 4.5 Wire the Contents sheet with thumbnails and the current page marker, with jump, drag, scrim and Escape. Verify focus returns to the button; check at 390 px.
- [x] 4.6 Update `?page` with `replaceState` and verify browser Back does not step through pages.
- [x] 4.7 Add the desktop spread layout (cover alone, then pairs), arrow keys, click-to-zoom and "Back to spread". Check at 1280 px against `desktop-menu.dc.html`.
- [ ] 4.8 Add alt text, live announcements, 44 px targets and reduced-motion behaviour. Verify with a screen reader pass and the accessibility audit; check at 390 px and at desktop width.
- [x] 4.9 Preload the neighbouring pages and verify no layout shift on a throttled "Slow 4G" connection.

## 5. Text layer and sharing

- [x] 5.1 Build the server `MenuTextLayer` with semantic headings and lists, VAT notes and locale prices, and embed it in the menu route. Verify with `curl` that the HTML contains the dinner items and with the browser that nothing visible appears.
- [x] 5.2 Add the Share button (Web Share and copy fallback with confirmation). Verify both paths; check at 390 px and desktop width.
- [x] 5.3 Add per-page `generateMetadata` with Open Graph title and image, and verify `?page=4` on cocktails names "The Siren Secret" in the page source.

## 6. Offline

- [x] 6.1 Extend `public/sw.js` with a cache-first versioned cache for menu images and remove old versions on activate. Verify a viewed page opens offline in a production build.
- [x] 6.2 Add idle prefetch of the current menu with data-saver and 2g checks. Verify requests in the network panel on normal and "save-data" settings.
- [x] 6.3 Add the offline gap message with "Try again". Verify with the network disabled; check at 390 px and desktop width.

## 7. Integration

- [x] 7.1 Run `npm run typecheck`, `npm test`, `npm run check:tokens`, `npm run placeholders` and `npm run build`, and confirm all pass.
- [x] 7.2 Run Lighthouse on `/en/menu/dinner` at mobile width and confirm performance and accessibility are at least 95, with the largest content under 2.5 s on throttled 4G.
- [x] 7.3 Update the README for the menu scripts and verify the commands run as written.

## Workflow follow-up

- Confirm the evening default menu and the unconfirmed items with the owner before launch.
- Archive the change after review.
