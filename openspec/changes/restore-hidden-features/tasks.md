# Tasks

Every task is unchecked on purpose: it is done only when its precondition is met. Details, original wording and commit ids are in `design.md`. Restore in a separate change (see the last requirement of the spec) and tick the group here when it lands.

## 1. Ticket buttons (flags)

- [ ] 1.1 Change button (A1): set `SHOW_CHANGE = true` in `components/booking/Ticket.tsx`. Precondition: the hostess handles change requests. Verify a change request sends "Change request — replaces MDZ-…" and the old ticket shows Changed.
- [ ] 1.2 Cancel booking (A2): set `SHOW_CANCEL = true`, and restore the cancellation policy line (3.2) first. Verify cancel success and failure paths and the rate limit.
- [ ] 1.3 Make another booking (A3): set `SHOW_ANOTHER = true`. Verify it opens `/{locale}/book`.

## 2. Hostess confirmation wording (needs a backend)

- [ ] 2.1 Add a backend that records a hostess's Confirm and Decline (hosted database plus Telegram webhook buttons), and the `confirmed` and `declined` statuses in `lib/my-bookings.ts` and the ticket.
- [ ] 2.2 Restore the pending badge and note (B1, B2 with the real `[CONFIRM TIME]`, re-add `CONFIRM_TIME_PLACEHOLDER` or its real text) and the "Hostess is checking tables" timeline step (B3). Verify with the Confirmed and Declined states.
- [ ] 2.3 Restore the form note, intro, page description and calendar note (B4, B6, B7, B8) in EN and RU. Verify the booking form and `generateMetadata` output.
- [ ] 2.4 Restore the cancelled, changed, timeline and cancel-sheet wording (B9 to B13) together with 1.1 and 1.2.

## 3. Owner content

- [ ] 3.1 Hold policy (C1): the owner supplies the text; put it in `HOLD_POLICY_PLACEHOLDER` in `lib/venue.ts`, then restore the line and its `.tk-ticket__policy` style on the ticket.
- [ ] 3.2 Deposit and cancellation policy (C2): supply the text and restore the line in the cancel sheet.
- [ ] 3.3 "Good to know" tiles (C3): supply dress code, payment and hookah rule; restore `VisitKnow`, the strings and `.vs-tiles` styles from `549f6ea^`. Verify at 390 px and 1280 px.
- [ ] 3.4 Open in Grab (C4): supply the pickup point and link format; restore the button, strings and `grabPickup` from `08630d9^`. Verify it opens Grab and is plain text while unconfirmed.

- [ ] 3.5 Telegram contact (E1): the owner supplies a Telegram username; set `VENUE.telegram` in `lib/venue-info.ts` (for example `@meduza_nhatrang`) and check the Home action, the ticket tile and the Visit row appear and open `https://t.me/<username>`.

## 4. Behaviour and UI

- [ ] 4.1 Book tab opens the active ticket (D1): use `useActiveReference` in `SiteTabBar`; do it together with 1.3.
- [ ] 4.2 Separate "Request sent" screen (D2): only if a confirmation moment is wanted again; restore from `864b287^`.
- [ ] 4.3 "via meduza-nt.com" timeline line (D3): re-add `sentSub` in both dictionaries and the ticket step.
- [ ] 4.4 EN / RU pill on every phone page (D4): render the wrapper on every page and restore `--site-lang-space` to 52 px.

## Workflow follow-up

- Send the owner the list of missing content (see Open Questions in `design.md`).
- Keep this change open (do not archive) until every group is done or dropped.
