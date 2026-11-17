# Design

## Context

The booking form (`components/BookingFlow.tsx`), the API route (`app/api/booking/route.ts`), the Telegram message and the confirmation screen exist and work, with dry-run mode for local testing. The only thing stored after a request is a single `mdz:last-booking` record in `localStorage`. There is no database or server of Meduza's own. The design is `m4-my-booking.dc.html`. See `proposal.md` for scope and the specs for behaviour.

## Goals / Non-Goals

**Goals:**
- Give the guest a ticket page that works fully from the device.
- Make Change and Cancel useful without a database by routing them to the hostess.
- Keep the storage layer small so a database can replace it without changing the screens.

**Non-Goals:**
- Server-side state, real Confirmed or Declined statuses, Telegram callback buttons.

## Decisions

**Storage layer.** `lib/my-bookings.ts` owns a versioned key (`mdz:bookings:v1`) holding a small list of records with a status of `pending`, `cancelled` or `changed`. It exposes a `useSyncExternalStore` hook (subscribing to the `storage` event for other tabs), `saveBooking`, `getBooking(ref)`, `activeBooking(now)` and `pruneExpired(now)`. Screens never touch `localStorage` directly. It migrates the old `mdz:last-booking` key. Active means: until the opening day of the booking ends (`currentOpeningDay(now)` is later than the booking date). *Why this rule:* it needs no new numbers. When a database arrives, `getBooking` becomes an async fetch and statuses gain `confirmed` and `declined`; the ticket component already renders by status.

**PII on the device.** Name and phone are kept locally so Change can pre-fill the form. They never leave the browser except in the booking request. Records are pruned after the opening day ends. This is stated in the privacy note in the README.

**Ticket page is a client page.** `/booking/[ref]` renders a client component that reads the record, because the server cannot know it. Unknown reference gets the "not on this device" state. The page is not indexable (`robots: noindex`).

**Book tab target.** The Book tab always links to `/book` for now. `useActiveReference` (`lib/my-bookings.ts`) is kept so the tab can open the active ticket again later.

**Cancel.** New route `app/api/booking/cancel/route.ts` accepts `{ reference, date, time, name, phone, locale, website }`, reuses the booking rate limiter and honeypot, validates the reference format (`^MDZ-\d{4}$`) and fields, and sends a Telegram message via new `formatCancelMessage`. The server cannot verify the booking exists, so the message says "requested" and the hostess confirms by phone or Telegram. In dry-run mode it prints instead of sending.

**Change.** `/book?change=MDZ-1234` reads the record and pre-fills `BookingFlow`. The payload gains an optional `replaces` field (validated with the same reference pattern), and `formatBookingMessage` prefixes "Change request — replaces MDZ-1234". On success the new record is saved and the old record is marked `changed` with a pointer to the new reference.

**Hostess message language.** English, as today; revisit when the hostess' language is known.

**Calendar.** Reuse `lib/calendar.ts`; the 2-hour length remains an assumption, not a policy.

## Risks / Trade-offs

- [Anyone can send a fake cancellation for a reference they invent] → rate limits, wording that says "requested", and the hostess verifying by phone; a database later allows real verification.
- [Records vanish if the guest clears site data or switches phone] → the unknown-booking state explains and offers a new booking and a message.
- [Guests may expect a Confirmed status] → copy and spec forbid claiming it; the pending text names Telegram or phone.
- [Two tabs editing records] → a single storage module and the `storage` event keep them in step.

## Open Questions

- The real texts for `[HOLD POLICY]` and `[DEPOSIT / CANCELLATION POLICY]` (owner). The layout works with the placeholders.
