# Tasks

## 1. Content

- [x] 1.1 Add the `visit` namespace to the EN and RU dictionaries (labels, tiles, notes). Verify `npm run typecheck` passes and fails when a Russian key is removed.
- [x] 1.2 Add the Grab pickup, map embed, brunch hours, kitchen closing, dress code, payment and hookah rule entries to `lib/venue-info.ts` as flagged placeholders. Verify `npm run placeholders` lists them.

## 2. Location

- [x] 2.1 Build the map slot (placeholder block with address and "Open in Maps", or the embed when configured). Verify both states with a temporary configured value, and check at 390 px against `design/screens/m5-visit.dc.html`.
- [x] 2.2 Build the Directions and "Open in Grab" actions with `VenueAction`. Verify Directions opens the right address and Grab shows plain text while a placeholder; check at 390 px.

## 3. Practical info

- [x] 3.1 Build the hours card with `OpenStatus` and the placeholder rows. Verify the badge at 22:00, 01:59, 02:00 and 11:59 with a faked clock; check at 390 px against `m5-visit.dc.html`.
- [x] 3.2 Build the contact list (Telegram, Zalo, Instagram, Call) with 44 px rows. Verify placeholder rows are not links and a confirmed value becomes a correct link (`t.me`, `zalo.me`, `instagram.com`, `tel:`); check at 390 px.
- [x] 3.3 ~~Build the "Good to know" tiles.~~ Removed at the owner's request; the dress code, payment and hookah placeholders went with it.

## 4. Desktop and page

- [x] 4.1 Create `/{locale}/visit` and the two-column desktop layout from 900 px. Check at 1280 px against the visit block of `design/screens/desktop-home.dc.html` and note differences for review.
- [x] 4.2 Add the `alternates` metadata and verify `/en/visit` and `/ru/visit` both render with the tab bar and desktop nav marking Visit as current; check at 390 px and desktop width.

## 5. Integration

- [x] 5.1 Run `npm run typecheck`, `npm test`, `npm run check:tokens`, `npm run placeholders` and `npm run build`, and confirm all pass.
- [x] 5.2 Run Lighthouse on `/en/visit` at mobile width and confirm accessibility is at least 95.

## Workflow follow-up

- Send the owner the placeholder list and fill in confirmed values.
- Archive the change after review.
