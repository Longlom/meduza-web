# Proposal

## Why

While testing on a phone, a number of features and texts were hidden because they need a backend that does not exist yet (hostess confirmation, change and cancel handling), or owner content that has not been supplied (hold and cancellation policies, dress code, payment, hookah rule, Grab pickup). The code, strings and styles for most of them are still in the repository, but nothing records what was hidden, why, or how to bring it back. This change is that record, and the plan to restore each item when its precondition is met.

## What Changes

- Record every hidden item, the commit that hid it, the exact original wording (EN and RU) and the precondition for showing it again (see `design.md`).
- Define the rules for hidden features: they stay restorable, and a flag or a documented git reference says how (`specs/hidden-features/spec.md`).
- Provide one restore task group per item (`tasks.md`). Nothing here changes behaviour today: all tasks start unchecked and are done only when the precondition is met.

## Capabilities

### New Capabilities
- `hidden-features`: the register of hidden features and the conditions for restoring them.

### Modified Capabilities
<!-- none: restoring an item later will modify the capability it belongs to (my-booking-ticket, table-booking, booking-changes, visit-*) in its own change -->

## Impact

- No code changes. Documentation only: this change folder.
- Restoring an item later touches `components/booking/Ticket.tsx`, `lib/i18n/{en,ru}.ts`, `lib/venue.ts`, `lib/venue-info.ts`, `components/visit/*`, `components/SiteTabBar.tsx`, `components/MobileLanguageSwitch.tsx`, `app/[locale]/(site)/layout.tsx`, `app/ticket.css`, `app/visit.css`, `app/booking.css`.

## Out of Scope

- Building the backend (database, Telegram webhook with Confirm and Decline buttons). It is the precondition for several items, but it is its own change.
- Choosing the real policy texts. The owner supplies them.

## Still-visible placeholders (not hidden)

For reference, `npm run placeholders` still lists markers that guests may see or that are used in code: `[MAP EMBED]` (visible under the pin on the Visit page), `[DINNER HOURS]`, `[EVENING_STARTS]`, `[MAX_GUESTS]`, `[MENU_EVENING_DEFAULT]`, `[HOLD POLICY]` and `[DEPOSIT / CANCELLATION POLICY]` (constants only, not displayed).
