# Tasks

## 1. Storage

- [x] 1.1 Create `lib/my-bookings.ts` (versioned key, `saveBooking`, `getBooking`, `activeBooking`, `pruneExpired`, migration of `mdz:last-booking`, subscribe hook). Verify Vitest cases for active, expired, after-midnight opening day and migration.
- [x] 1.2 Save the record from `BookingFlow` on success instead of the old key. Verify in the browser that a test booking creates the record (dry run on) and that it survives a reload.

## 2. Confirmation and Book tab

- [x] 2.1 Add "View my booking" to `SentView` linking to the ticket. Check at 390 px and desktop width against `design/screens/m3-booking.dc.html` and `desktop-booking.dc.html`.
- [x] 2.2 Make `SiteTabBar` link Book to the ticket while a record is active, correcting after hydration (removed for now: the Book tab always opens the form; `useActiveReference` in `lib/my-bookings.ts` is kept for later). Verified before removal; check at 390 px.

## 3. Ticket page

- [x] 3.1 Create `/{locale}/booking/[ref]` with the ticket card, "Request sent" badge with reduced-motion handling, and the timeline (no hostess-confirmation wording until there is a backend). Check at 390 px against `design/screens/m4-my-booking.dc.html`.
- [x] 3.2 Add the unknown-booking state with "Make a new booking" and "Message us", and `noindex` metadata. Verify with a reference that is not stored; check at 390 px and desktop width.
- [x] 3.3 Add Directions, Message us (placeholder-aware) and Add to calendar. Verify the downloaded `.ics` opens with the right time and the reference; check at 390 px and desktop width.
- [x] 3.4 Add a desktop layout for the ticket page. Check at 1280 px (no desktop design exists; note differences for review).

## 4. Change and cancel

- [x] 4.1 Extend `lib/validation.ts` and `lib/telegram.ts` with the optional `replaces` field and `formatCancelMessage`; add the change prefix to the booking message. Verify Vitest cases for the reference pattern and message text.
- [x] 4.2 Create `app/api/booking/cancel/route.ts` with validation, honeypot, shared rate limits and dry-run printing. Verify with `curl` for success, bad reference, honeypot and the ninth request from one IP.
- [x] 4.3 Build the cancel dialog with the `[DEPOSIT / CANCELLATION POLICY]` text, error state and Cancelled result. Verify cancel success and failure paths; check at 390 px and desktop width.
- [x] 4.4 Build the change flow: `/book?change=ref` pre-fills the form, submit sends `replaces`, old record becomes Changed with a link to the new ticket. Verify the Telegram dry-run output and the 1.5 h rule on change; check at 390 px and desktop width.
- [x] 4.5 Hide Change and Cancel once the booked time has passed. Verify with a faked clock.

## 5. Copy and integration

- [x] 5.1 Add all strings to the EN and RU dictionaries. Verify `npm run typecheck` fails when a Russian key is removed and passes when complete.
- [x] 5.2 Add a privacy note about data kept on the device to the README and verify it matches the stored fields.
- [x] 5.3 Run `npm run typecheck`, `npm test`, `npm run check:tokens`, `npm run placeholders` and `npm run build`, and confirm all pass.
- [x] 5.4 Send one clearly marked test booking, change and cancel to the real Telegram group only after the owner agrees, and verify the three messages read correctly. (Done 2026-11-18 through https://meduza-nt.com; the owner confirmed all three arrived and read correctly.)

## Workflow follow-up

- Plan the database and webhook change (Confirmed, Declined, Call buttons) as the next step.
- Archive the change after review.
