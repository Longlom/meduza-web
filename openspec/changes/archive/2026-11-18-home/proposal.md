# Proposal

## Why

Home is the first screen most guests see, usually on a phone in a taxi or on the beach. It has to say in seconds what Meduza is, whether it is open, and what to order or read next, and it has to put "Book a table" within one tap. What it features should match the time of day: cocktails at night, brunch in the day.

## What Changes

- Replace the temporary home stub with the real Home screen (phone and desktop layouts).
- Hero: tank photo, live open/closed badge, "Smoke. Sip. *Relax.*" headline, intro with the address, primary Book button.
- Quick actions: Menu, Call, Directions, Message (placeholder-aware).
- A time-of-day featured carousel: the 10 signature cocktails in the evening, brunch highlights by day, each card opening the menu reader on that page.
- "Brunch to last call" cards (Brunch, Dinner, Lounge), "Our menus" covers, and a Pearl visit card.
- Optimised photography with explicit dimensions and a hero under 150 KB.

## Capabilities

### New Capabilities
- `home-hero`: hero, live status, primary booking action and quick actions.
- `home-featured-carousel`: time-of-day featured content linking into the menu reader.
- `home-sections`: dining cards, menu covers and the visit card.

### Modified Capabilities
<!-- none -->

## Impact

- New: `app/[locale]/(site)/page.tsx` (replaces the stub), `components/home/*`, `lib/daypart.ts`, optimised photos in `public/photos`, copy in `lib/i18n/*`.
- Depends on `app-shell` (layout, venue info, status, tab bar) and `menu-reader` (page images, deep links, manifest).
- No new runtime dependency (uses `next/image`).

## Out of Scope

- Brunch, Dinner and Lounge detail pages (the cards link to the menu reader and Visit).
- Photo gallery or "Spaces" page.
- Newsletter, events, reviews.
- Real hookah blend descriptions (placeholders on Visit).

## New [PLACEHOLDER] values

- `[EVENING_STARTS]`: when Home switches from brunch to cocktails. Provisional value 17:00 (the start of the Evening booking group in the design), flagged for owner confirmation.
- `[BRUNCH END]`: shown in the day carousel eyebrow "Until [BRUNCH END]".
- `[BRUNCH HOURS]` and `[DINNER HOURS]`: shown on the Brunch and Dinner cards.
- `[PHONE]` and `[TELEGRAM @HANDLE]`: Call and Message quick actions render as plain text until confirmed.
