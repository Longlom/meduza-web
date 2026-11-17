# Proposal

## Why

Guests who are on their way, or deciding whether to come, need the practical facts at once: where it is, how to get there, when it is open, how to reach a hostess, and what to know before arriving. Today none of this exists in the app, and most of the values still wait for the owner, so the screen must be honest about what is not confirmed yet.

## What Changes

- Add `/{locale}/visit` with the map area, Directions and "Open in Grab", the hours card with live status, the contact list and "Good to know" tiles.
- Use the shared venue record and placeholder rules, so unconfirmed values show as plain bracketed text and never as dead links.
- Provide a desktop layout. There is no desktop Visit screen in the design, so it is derived from the visit block on the desktop Home screen.

## Capabilities

### New Capabilities
- `visit-location`: map area, directions and Grab action.
- `visit-practical-info`: hours card, contact list and "Good to know" tiles.

### Modified Capabilities
<!-- none -->

## Impact

- New: `app/[locale]/(site)/visit/page.tsx`, `components/visit/*`, `visit` namespace in `lib/i18n/*`.
- Depends on `app-shell` (layout, venue record, live status, `VenueAction`).
- No new dependency and no server code.

## Out of Scope

- A live interactive map (until a map embed is supplied).
- Reviews, parking guides, transport timetables.
- Table booking from this page beyond the existing Book tab.

## New [PLACEHOLDER] values

`[MAP EMBED]`, `[GRAB PICKUP POINT]`, `[BRUNCH HOURS]`, `[KITCHEN CLOSES]`, `[DRESS CODE]`, `[PAYMENT METHODS]`, `[HOOKAH AGE/ZONE RULE]`, plus the contact placeholders from `app-shell` (`[PHONE]`, `[TELEGRAM @HANDLE]`, `[ZALO NUMBER]`, `[INSTAGRAM @HANDLE]`). The design file shows `[STREET ADDRESS]`, which is superseded: the address is given in `HANDOFF.md` and the venue record.
