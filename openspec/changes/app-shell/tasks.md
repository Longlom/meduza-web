# Tasks

## 1. Test tooling

- [x] 1.1 Add Vitest as a devDependency with an `npm test` script, and verify `npm test` runs and reports zero tests without error.
- [x] 1.2 Write tests for `lib/time.ts` and `lib/slots.ts`: opening day at 00:30 and 02:00, after-midnight slots, 1.5 h lead, `BOOKING_LAST_TIME` cut-off. Verify `npm test` passes.
- [x] 1.3 Write tests for `lib/validation.ts`: phone digits, Instagram normalization, guests max, `time_hours` and `time_last` codes. Verify `npm test` passes.

## 2. Design-system groundwork

- [x] 2.1 Add an optional `renderLink` prop to `NavBar` and `TabBar` in `design-system/src/components/Navigation.tsx`, defaulting to the current `<a>`. Verify `npm run typecheck` passes and the booking page still renders its nav at 1280 px.

## 3. Venue info and placeholders

- [x] 3.1 Create `lib/venue-info.ts` with address, hours and every placeholder from the proposal as `{ value, placeholder }` entries. Verify with a Vitest test that each placeholder entry is flagged.
- [x] 3.2 Create `VenueAction` (link only when confirmed, plain text otherwise) and test both states in Vitest or in the browser with a temporary confirmed value.
- [x] 3.3 Add `scripts/placeholders.mjs` and the `npm run placeholders` script. Verify the command prints all placeholder names and exits 0.
- [x] 3.4 Create the `OpenStatus` client component with a pure `openStatus(now)` function. Verify tests for 01:59, 02:00 and 11:59, and check the first paint shows only the hours.
- [x] 3.5 Add the Directions link builder and verify the URL opens the right address in a maps app. Check at 390 px and at desktop width against `design/screens/m5-visit.dc.html`.

## 4. Navigation and layout

- [x] 4.1 Create the `(site)` route group layout and move the stub home into it; keep `book/` outside. Verify `/en` shows the shell and `/en/book` does not.
- [x] 4.2 Build `SiteTabBar` (four tabs, `next/link`, current marker) shown below 900 px. Check at 390 px against `design/screens/m0-mobile-rules.dc.html` and `m1-home.dc.html`.
- [x] 4.3 Build `SiteNav` (logo, Menu, Book, Visit, language switch, Book a table) shown from 900 px. Check at 1280 px against `design/screens/desktop-home.dc.html`.
- [x] 4.4 Add safe-area padding for the tab bar and verify with the browser emulating a notched device. Check at 390 px and desktop width.
- [x] 4.5 Verify tab changes do not reload the document (no `document` navigation in the network panel) and that keyboard focus rings are visible. Check at 390 px and desktop width.

## 5. Localization

- [x] 5.1 Add `nav`, `common` and `venue` namespaces to `en.ts` and `ru.ts`, and make `ru` satisfy the `Dict` type. Verify removing one key from `ru` fails `npm run typecheck`.
- [x] 5.2 Build the language switch (desktop nav and a phone switch at the top right, clear of the notch) preserving the current query string. Verify `/en/menu/cocktails?page=4` switches to `/ru/...?page=4`. Check at 390 px and desktop width.
- [x] 5.3 Add `alternates.languages` through `generateMetadata` for shell pages and verify the `<link rel="alternate" hreflang>` tags in the page source.

## 6. Theming

- [x] 6.1 Add a `Pearl` block wrapper usage and a `data-mood="lantern"` helper, and verify a demo block renders in Pearl while the page stays Abyss. Check contrast of the block text is at least 4.5:1.
- [x] 6.2 Add `scripts/check-tokens.mjs` and the `npm run check:tokens` script, with an allow-list for `themeColor` and manifest colours. Make it also fail on any `max-width` media query in app styles (mobile first). Verify it passes now and fails when a hex colour or a `max-width` query is added to `app/booking.css`.

## 7. Installable app

- [x] 7.1 Generate icons (192, 512, maskable 512, Apple touch) from the logo with a script into `public/icons`, and verify the files exist at the expected sizes.
- [x] 7.2 Add `app/manifest.ts` and the iOS metadata, and verify the manifest passes the browser's installability check.
- [x] 7.3 Write `public/sw.js` (network-first HTML, stale-while-revalidate static, no `/api`) and register it in production only. Verify offline revisit works in a production build with the network disabled.
- [x] 7.4 Add the branded offline page with "Try again" and verify it shows for an unvisited page when offline. Check at 390 px and desktop width.
- [x] 7.5 Verify submitting the booking form offline shows the "No connection" message and keeps the form values.

## 8. Integration

- [x] 8.1 Run `npm run typecheck`, `npm test`, `npm run check:tokens` and `npm run build`, and confirm all pass.
- [x] 8.2 Run Lighthouse on `/en` at mobile width and confirm accessibility is at least 95 and the app is installable.
- [x] 8.3 Update `README.md` with the new commands (`test`, `placeholders`, `check:tokens`) and verify the documented commands run as written.

## Workflow follow-up

- Archive the change after the shell is reviewed and merged.
