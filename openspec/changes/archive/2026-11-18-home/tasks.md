# Tasks

## 1. Data and time of day

- [x] 1.1 Add `lib/daypart.ts` with `daypart(now)` using Vietnam time and the flagged evening start. Verify Vitest cases at 11:00, 16:59, 17:00 and 01:30 (still evening after midnight).
- [x] 1.2 Add `lib/featured.ts` building the evening cocktail cards and the day brunch cards from the menu data. Verify a test that the evening list has 10 cards with strengths and that each card's link and page match the manifest.
- [x] 1.3 Add the `home` namespace to the EN and RU dictionaries. Verify `npm run typecheck` fails if a Russian key is missing and passes when complete.

## 2. Photography

- [x] 2.1 Copy the hero, lounge, dining and bar photos into `public/photos` and add them with `next/image` sizes. Verify the phone hero transfer is under 150 KB in the network panel.

## 3. Hero and quick actions

- [x] 3.1 Build the hero: photo, `OpenStatus`, headline with serif "Relax.", intro with the address, single glowing Book button. Check at 390 px against `design/screens/m1-home.dc.html`.
- [x] 3.2 Build quick actions with `VenueAction` (Menu, Call, Directions, Message). Verify placeholders render as plain text and a temporary confirmed value renders a link; check at 390 px.
- [x] 3.3 Build the desktop hero with "Book a table" and "Open the menu". Check at 1280 px against `design/screens/desktop-home.dc.html`.

## 4. Featured carousel

- [x] 4.1 Build `FeaturedCarousel` (scroll-snap, "See all", card links to `?page=N`). Verify each of the 10 cards opens the right page and check at 390 px against `m1-home.dc.html`.
- [x] 4.2 Add `initialDaypart`, the live switch on mount and a 60 s tick. Verify no hydration warning in the console when the time is faked across 17:00, and check both states at 390 px.
- [x] 4.3 Add desktop controls (previous and next) and accessible names with strength and price. Verify with the keyboard and check at 1280 px.

## 5. Sections

- [x] 5.1 Build the "Brunch to last call" cards with Lantern accents and placeholder hours. Check at 390 px and 1280 px against the m1 and desktop screens.
- [x] 5.2 Build "Our menus" covers with page counts linking to each menu. Verify the three links and check at 390 px and 1280 px.
- [x] 5.3 Build the Pearl visit card (hours, address, Directions & contacts) and the desktop visit block. Verify only the card is light and contrast is at least 4.5:1; check at 390 px and 1280 px.

## 6. Integration

- [x] 6.1 Remove the old stub, add `revalidate = 60`, and verify `/en` and `/ru` build and render in both languages.
- [x] 6.2 Run `npm run typecheck`, `npm test`, `npm run check:tokens`, `npm run placeholders` and `npm run build`, and confirm all pass.
- [x] 6.3 Run Lighthouse on `/en` at mobile width and confirm performance and accessibility are at least 95 and the largest content paints under 2.5 s on throttled 4G.

## Workflow follow-up

- All sections are built, including the time-of-day carousel.
- Lighthouse (mobile, production build): with applied 4G throttling performance is 99 and the largest paint 1.6–1.7 s in both languages, accessibility 100, layout shift 0. Lighthouse's default simulated throttling swings between 94 and 97 (largest paint 2.6–3.1 s). Fonts went from 289 KB to 118 KB by drawing the dong sign with a system font, and the nav logo has a 10 KB version.
- The desktop design also shows an "Inside Meduza" photo gallery and a footer that the handoff and these specs do not include. Not built; add them through `openspec-update-change` if wanted.

- Confirm the evening start and the brunch end with the owner before launch.
- Archive the change after review.
