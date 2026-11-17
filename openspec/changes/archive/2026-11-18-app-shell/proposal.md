# Proposal

## Why

Every Meduza screen (Home, Menu, Book, Visit, My booking) shares the same navigation, language handling, theme, installability and venue facts. Most guests arrive on a phone over 4G, so "Book" must always be one tap away and the app must work like an installed app. Building this once, first, stops each later screen from reinventing it, and gives one honest place for values the owner has not confirmed yet.

## What Changes

- Add the four-tab phone navigation (Meduza, Menu, Book, Visit) and the floating desktop nav, with safe-area handling.
- Move the temporary home page into a shared "site" layout. The booking form keeps its own full-screen layout.
- Finish EN and RU localization for shared text: locale prefix, language switcher, `hreflang`, same-keys check.
- Add theme scoping helpers: Abyss by default, Pearl blocks, Lantern mood per section.
- Make the app installable (manifest, icons, service worker, offline page).
- Add `venue-info`: one record for address, hours and contacts, with a placeholder flag, a placeholder report command, and the live open/closed status.
- Add test tooling (Vitest) and cover the existing time and booking-validation rules.
- Add an optional `renderLink` prop to the design-system `NavBar` and `TabBar` so they can use client-side navigation.

## Capabilities

### New Capabilities
- `app-navigation`: phone tab bar, desktop nav, full-screen booking flow, safe areas, client-side navigation.
- `localization`: EN/RU locale URLs, detection, switching, parity of dictionaries, locale formats.
- `site-theming`: Abyss default, Pearl blocks, Lantern mood, tokens-only styling.
- `installable-app`: manifest, icons, service worker, offline fallback.
- `venue-info`: single venue record, placeholder handling and report, live open/closed status, directions link.

### Modified Capabilities
<!-- none: no specs exist yet -->

## Impact

- New: `app/[locale]/(site)/layout.tsx`, `components/SiteTabBar.tsx`, `components/SiteNav.tsx`, `components/OpenStatus.tsx`, `components/VenueAction.tsx`, `lib/venue-info.ts`, `app/manifest.ts`, `public/sw.js`, `scripts/placeholders.mjs`, `scripts/check-tokens.mjs`, Vitest config and tests.
- Changed: `design-system/src/components/Navigation.tsx` (backwards compatible), `lib/i18n/*`, `middleware.ts` (alternates only if needed), `package.json` (Vitest devDependency, scripts).
- No runtime dependency is added. No database or server is needed.

## Out of Scope

- Home, Menu, Visit and My booking screens (their own changes).
- Vietnamese (VI) text. The structure allows it later.
- Push notifications, accounts, any database.
- A real logo master. The traced PNG stays until the owner supplies the vector file.

## New [PLACEHOLDER] values

Held in `lib/venue-info.ts` and shown as plain text, never as links, until confirmed: `[PHONE]`, `[TELEGRAM @HANDLE]`, `[ZALO NUMBER]`, `[INSTAGRAM @HANDLE]`, `[GRAB PICKUP POINT]`, `[BRUNCH HOURS]`, `[DINNER HOURS]`, `[KITCHEN CLOSES]`, `[EVENING_STARTS]`, `[BRUNCH END]`.
