# Design

## Context

Hidden means: not shown to guests now, but intended to come back. Two kinds exist. **Flagged** items still have their code in the app and are switched by a constant. **Removed** items had their code deleted; the last version is recoverable from git with `git show <commit>^:<path>` (the commit named below removed it, so its parent has the old file). Every commit is on `master`.

Why things were hidden: there is no backend, so the app cannot know whether a hostess confirmed, and cancel and change requests only reach Telegram as messages. Owner content (policies, dress code, payment, hookah rule, Grab pickup) was never supplied.

## The register

### A. Flagged (code is in place, set the flag to `true`)

| # | Item | Where | Hidden in | Precondition to restore |
|---|---|---|---|---|
| A1 | **Change** button on the ticket | `SHOW_CHANGE` in `components/booking/Ticket.tsx` (the `/book?change=MDZ-…` flow, `replaces` field and Telegram "Change request — replaces …" message still work) | `23888d0` | Decide the hostess can handle change requests; ideally the backend can mark the old booking changed. |
| A2 | **Cancel booking** button and its confirmation sheet | `SHOW_CANCEL` in `Ticket.tsx` (the sheet, `POST /api/booking/cancel`, `formatCancelMessage` and rate limits still work) | `1dbddb6` | Same as A1, plus the cancellation policy text (C2). |
| A3 | **Make another booking** link on the ticket | `SHOW_ANOTHER` in `Ticket.tsx` | `1dbddb6` | None technical; needed again once guests can have several bookings or the Book tab opens the ticket (D1). |

### B. Hostess-confirmation wording (removed, needs a backend)

These texts promised or described a hostess confirmation. They were reworded or removed in `a641d3f` and `864b287`. Restore only when a backend can really record Confirmed and Declined (statuses `confirmed` and `declined` are planned in `lib/my-bookings.ts`).

| # | Where it was | Original EN | Original RU |
|---|---|---|---|
| B1 | Ticket badge, pending (`ticket.statusPending`) | Waiting for the hostess | Ждём хостес |
| B2 | Ticket note, pending (`ticket.pendingNote`, used the `[CONFIRM TIME]` placeholder, constant `CONFIRM_TIME_PLACEHOLDER` in `lib/venue.ts`) | A hostess will confirm your booking in Telegram or by phone, usually within [CONFIRM TIME]. | Хостес подтвердит бронь в Telegram или по телефону, обычно в течение [CONFIRM TIME]. |
| B3 | Timeline step 2 (`ticket.checking`, `ticket.checkingSub`) | Hostess is checking tables / In Telegram or by phone | Хостес проверяет столы / В Telegram или по телефону |
| B4 | Booking form note, phone and desktop summary (`book.hostessNote`) | A hostess will confirm your booking in Telegram or by phone. | Хостес подтвердит бронь в Telegram или по телефону. |
| B5 | "Request sent" screen text (`book.sentText`) | A hostess will confirm your booking in Telegram or by phone. | Хостес подтвердит бронь в Telegram или по телефону. |
| B6 | Booking page intro (`book.intro`) | Request a table and a hostess will confirm your booking in Telegram or by phone. | Оставьте заявку, и хостес подтвердит бронь в Telegram или по телефону. |
| B7 | Page description tail (`meta.description`) | … A hostess confirms in Telegram or by phone. | … Хостес подтвердит бронь в Telegram или по телефону. |
| B8 | Calendar note (`book.calendarNote`) | Request sent — waiting for the hostess to confirm. | Заявка отправлена — ждём подтверждения хостес. |
| B9 | Cancelled note (`ticket.cancelledNote`) | The hostess has been told and will confirm the cancellation in Telegram or by phone. | Хостес получила сообщение и подтвердит отмену в Telegram или по телефону. |
| B10 | Changed note (`ticket.changedNote`) | You sent a change request. The hostess will confirm the new booking in Telegram or by phone. | Вы отправили запрос на изменение. Хостес подтвердит новую бронь в Telegram или по телефону. |
| B11 | Timeline subtitles (`ticket.cancelRequestedSub`, `ticket.changeRequestedSub`) | The hostess will confirm / New request sent to the hostess | Хостес подтвердит / Новая заявка отправлена хостес |
| B12 | Cancel sheet intro (`ticket.cancelIntro`) | We will tell the hostess that you want to cancel. She confirms in Telegram or by phone. | Мы сообщим хостес, что вы хотите отменить бронь. Она подтвердит в Telegram или по телефону. |
| B13 | After cancelling (`ticket.cancelSent`) | Cancellation sent. The hostess has been told and will confirm in Telegram or by phone. | Отмена отправлена. Хостес получила сообщение и подтвердит в Telegram или по телефону. |

The current neutral wording (kept): badge "Request sent" / «Заявка отправлена», timeline Request sent → Arrive, cancel and change notes that only say the request was sent. When real confirmation exists, the ticket also needs the Confirmed and Declined states (the design for Confirmed is in `design/screens/m4-my-booking.dc.html`).

Full old strings: `git show 5b4bf5b:lib/i18n/en.ts` and `git show 5b4bf5b:lib/i18n/ru.ts`.

### C. Owner-content placeholders no longer displayed

| # | Item | Where it showed | Hidden in | Constant kept | Precondition |
|---|---|---|---|---|---|
| C1 | `[HOLD POLICY]` line | Under the reference on the ticket (class `.tk-ticket__policy`, removed from `app/ticket.css`; it also showed on the old "Request sent" screen) | `62af42d` | `HOLD_POLICY_PLACEHOLDER` in `lib/venue.ts` | Owner supplies the real hold text. |
| C2 | `[DEPOSIT / CANCELLATION POLICY]` line | In the cancel sheet, under the intro | `62af42d` | `CANCEL_POLICY_PLACEHOLDER` in `lib/venue.ts` | Owner supplies the real text; restore together with A2. |
| C3 | "Good to know" tiles: Dress code `[DRESS CODE]`, Payment `[PAYMENT METHODS]`, Hookah `[HOOKAH AGE/ZONE RULE]`, Languages "EN · RU · VI" | Visit page, 2×2 tiles after the contact list. Strings: `visit.knowTitle`, `dress`, `payment`, `hookah`, `languages`, `languagesValue` (EN: Good to know / Dress code / Payment / Hookah / Languages; RU: Хорошо знать / Дресс-код / Оплата / Кальян / Языки). Venue entries `dressCode`, `payment`, `hookahRule` | `549f6ea` | none (deleted) | Owner supplies the three values. Component `components/visit/VisitKnow.tsx` and `.vs-tiles` CSS: `git show 549f6ea^:components/visit/VisitKnow.tsx`. |
| C4 | **Open in Grab** button with `[GRAB PICKUP POINT]` | Visit page, secondary button under Directions. Strings `visit.grab` (EN "Open in Grab", RU "Открыть в Grab"); venue entry `grabPickup`; contact kind `grab` | `08630d9` | none (deleted) | Owner supplies the pickup point (and a Grab deep link format). Code: `git show 08630d9^:app/[locale]/(site)/visit/page.tsx` and `git show 08630d9^:lib/venue-info.ts`. |

### D. Behaviour and UI removed

| # | Item | Hidden in | How to restore |
|---|---|---|---|
| D1 | **Book tab opens the active booking's ticket** instead of the form | `17d1015` | `components/SiteTabBar.tsx`: read `useActiveReference()` (still exported from `lib/my-bookings.ts`) and set the Book link to `/{locale}/booking/{ref}` when it returns a reference. Needs A3 so a guest can still make another booking. |
| D2 | **Separate "Request sent." confirmation screen** with "View my booking", "Add to calendar" and "Make another booking" (replaced by landing on the ticket) | `864b287` | `git show 864b287^:components/SentView.tsx` and the `sent` state in `components/BookingFlow.tsx`. Strings `book.sentTitle`, `sentText`, `viewBooking`. Probably not wanted again unless a confirmation moment is needed. |
| D3 | Ticket timeline subtitle **"via meduza-nt.com"** under Request sent | `4c96371` | Re-add `sentSub` (EN "via meduza-nt.com", RU "через meduza-nt.com") to both dictionaries and pass it as `sub` for the `sent` step in `Ticket.tsx`. |
| D4 | **Phone EN / RU pill on every page** (now home only) | `939ee24` | In `app/[locale]/(site)/layout.tsx` render the `site-mobile-lang` wrapper with `LanguageSwitch` on every page again (drop the pathname check in `components/MobileLanguageSwitch.tsx`) and set `--site-lang-space` in `app/booking.css` back to `calc(env(safe-area-inset-top) + 52px)`. |

### E. Contacts hidden until confirmed

| # | Item | Where | Hidden in | Precondition |
|---|---|---|---|---|
| E1 | **Telegram buttons**: Home quick action "Написать" / "Message", ticket "Message us" tile (and the one in the unknown-booking state), and the Telegram row in the Visit contact list | `telegramAvailable()` in `lib/venue-info.ts` hides them while `VENUE.telegram` is the placeholder `[TELEGRAM @HANDLE]` | this commit ("Telegram: stop linking by phone number") | The owner gives a Telegram **username**. Linking by phone number (`https://t.me/+84889761669`) was tried and Telegram answered "no such user" because the number is not searchable. Put the username in `VENUE.telegram` and the buttons return by themselves. |

## Decisions

- **Flags over deletion** where the feature is a button on an existing screen (A1–A3), so restoring is a one-line change. Wording and content items were removed or reworded, so their original text is recorded here instead.
- **Git as the archive.** The commit ids above are the source of truth for removed code; do not rely on this file for anything but pointers and strings.
- **Restore in its own change.** When an item comes back, open a change that modifies the relevant capability's spec (for example the ticket spec for B and C1), because the current specs describe the hidden state.

## Risks / Trade-offs

- [Hidden code rots: components change around it] → the flagged items stay compiled and covered by typecheck; removed items are only in git, so check them out and re-test before restoring.
- [Restoring B without a backend would make false promises] → B items are gated on a real Confirmed state; the spec forbids them until then.
- [Placeholder text shown raw to guests] → C items stay hidden until the owner gives the real text.

## Open Questions

- Is a backend with Telegram Confirm and Decline buttons planned, and when? It unlocks A1, A2 and B.
- Owner content still missing: hold policy, cancellation and deposit policy, dress code, payment methods, hookah age and zone rule, Grab pickup point, map embed.
