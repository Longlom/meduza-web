# Design

## Context

The app is Next.js 15 (App Router) at the repo root. `app/[locale]/layout.tsx` is the root layout (`<html lang>`), the booking form already works at `/{locale}/book`, and `/{locale}` is a temporary stub. `@meduza/ui` is imported through a tsconfig path alias from `design-system/src`. The design system's `NavBar` and `TabBar` render plain `<a>` tags, so they cause full page loads. See `proposal.md` for motivation and the specs for behaviour.

## Goals / Non-Goals

**Goals:**
- One shared site layout (tab bar on phone, nav on desktop) used by Home, Menu, Visit and My booking.
- Venue facts and placeholders in one typed module.
- Installable, with a small offline shell, without adding a runtime dependency.

**Non-Goals:**
- Page content for Home, Menu, Visit (later changes).
- A generic CMS or settings UI for venue values.

## Decisions

**Route groups.** `app/[locale]/(site)/layout.tsx` wraps pages that show the tab bar or nav. `app/[locale]/book/` stays outside it (own full-screen header and sticky button), as in the design. *Alternative:* one layout that hides the tab bar by pathname. Rejected: client-side pathname checks cause a flash and couple the layout to routes.

**Client navigation in the design system.** Add an optional `renderLink(props)` prop to `NavBar` and `TabBar`; the default stays a plain `<a>`, so nothing breaks. The app passes `next/link`. *Alternative:* re-implement both with `mz-*` classes in the app. Rejected: it forks the design system and drifts.

**Breakpoint.** The shell switches at 900 px, matching the booking screens. The design system's own nav hides links below 760 px, which is superseded because the tab bar owns phones.

**Venue record.** `lib/venue-info.ts` exports typed entries `{ value, placeholder: boolean }` plus helpers. `VenueAction` renders a link only when `placeholder` is false. `scripts/placeholders.mjs` imports the record and lists placeholders. *Alternative:* environment variables. Rejected: these are content, they must be reviewable in git, and the browser needs them.

**Live status.** A client component computes open/closed from `isOpenNow` and ticks every 30 s. The server renders the hours text only, so there is no hydration mismatch.

**Localization.** Keep the two typed dictionaries (`en.ts`, `ru.ts`, `Dict` type), grow them by namespace (`nav`, `common`, `venue`). Dictionaries contain functions (plurals), so client components call `getDict(locale)` themselves and receive only `locale` as a prop. The language switcher keeps `searchParams` for the current page. `alternates.languages` is set through `generateMetadata` per page.

**Installability.** Hand-written `public/sw.js` registered from a small client component in production only. Strategy: network-first for HTML with cache fallback, stale-while-revalidate for `/_next/static`, no caching of `/api`. Icons are generated once from the traced logo PNG by a script into `public/icons`. *Alternative:* `serwist` or `next-pwa`. Rejected for now: extra dependency and build coupling for a small amount of logic; revisit if caching rules grow (the menu change adds image caching).

**Tests.** Add Vitest for pure logic (`lib/time`, `lib/slots`, `lib/validation`, `lib/venue-info`). UI is checked in the browser against the screen files.

## Risks / Trade-offs

- [Service worker serves stale pages after a deploy] → network-first HTML, versioned cache name, clean old caches on activate.
- [The traced logo is low resolution (514 px) for a 512 px maskable icon] → pad it onto an Abyss square; replace when the vector logo arrives.
- [Placeholders in the venue record look unfinished to guests] → intended: honest and visible until the owner supplies values; the report command keeps the list short.
- [Changing the design system `Navigation.tsx` again] → the change is additive and typed; booking already depends on this package.
