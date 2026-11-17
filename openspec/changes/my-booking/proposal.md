# Proposal

## Why

After a guest sends a booking request they want to see it again, add it to their calendar, find the way, and change or cancel it. The booking form already works and tells the hostess in Telegram, but it has no spec, and the guest can see nothing once the confirmation screen is closed. There is no database or server of Meduza's own yet, so the first version must work from the guest's own device, and be honest that the hostess confirms in Telegram or by phone.

## What Changes

- Document the booking behaviour that already exists as the `table-booking` capability, so later changes have a contract to modify.
- Keep each request on the guest's device and add the "My booking" ticket page `/{locale}/booking/[ref]` (status, timeline, actions).
- Make the Book tab open the ticket while the guest has an active booking, and add "View my booking" to the confirmation screen.
- Add Change (reopens the form pre-filled) and Cancel booking, both sent to the hostess in Telegram as requests she verifies.
- Add Directions, Message us and Add to calendar to the ticket.
- Design the local storage so a database can replace it later and bring real Confirmed and Declined statuses.

## Capabilities

### New Capabilities
- `table-booking`: the existing request flow, rules, hostess message and confirmation.
- `my-booking-ticket`: local record, ticket page, Book tab behaviour and ticket actions.
- `booking-changes`: change and cancel requests to the hostess.

### Modified Capabilities
<!-- none: no specs exist yet, so the current booking behaviour is introduced here as table-booking -->

## Impact

- New: `lib/my-bookings.ts`, `app/[locale]/(site)/booking/[ref]/page.tsx`, `components/booking/Ticket.tsx`, `app/api/booking/cancel/route.ts`, `lib/i18n/*` strings.
- Changed: `components/BookingFlow.tsx` (prefill, `replaces`, View my booking), `components/SentView.tsx`, `components/SiteTabBar.tsx`, `lib/validation.ts` (optional `replaces`), `lib/telegram.ts` (change and cancel messages).
- Depends on `app-shell` (layout, tab bar, venue info) and the existing booking form.

## Out of Scope

- Confirmed and Declined statuses, the Telegram Confirm/Decline/Call buttons, and a booking list for the hostess: these need a hosted database and a webhook (a later change).
- Opening a booking on another device or after clearing browser data.
- Email or SMS notifications, accounts, deposits and payments.
- A staff view.

## New [PLACEHOLDER] values

- `[CONFIRM TIME]`: "usually within [CONFIRM TIME]" on the pending ticket.
- `[HOLD POLICY]`: shown on the confirmation and the ticket.
- `[DEPOSIT / CANCELLATION POLICY]`: shown in the cancel confirmation.
- `[MAX_GUESTS]` (20) already exists and is documented in `table-booking`.
