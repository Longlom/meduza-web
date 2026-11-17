# Meduza web app — design handoff

**Meduza — Cocktails & Cuisine**, 157 Nguyễn Thiện Thuật, Nha Trang.
It's a restaurant-lounge serving brunch, dinner, signature cocktails and hookah. It's open daily 12:00–02:00, Vietnam time (GMT+7).

This document is the spec. The screen files in `screens/` give the exact visuals, and `../design-system/` (`@meduza/ui`) holds the building blocks. When this document and a screen file disagree, **this document wins**, and you should flag the conflict.

Visual reference (owner-only link, may change): https://claude.ai/artifact/4TX3ajSx36dgq2BjLkTrsH

---

## 1. Product principles

1. **Mobile first.** Design and build for 390 px wide first, then scale up to desktop. Most guests arrive on a phone over 4G.
2. **Book in three taps from anywhere.** "Book" is always one tap away: in the tab bar, or as the primary button.
3. **Actions at the bottom.** Primary buttons, bottom sheets and the tab bar sit in the thumb zone. Photos may run under the status bar, but controls never do (respect the safe areas).
4. **One accent leads each screen.**
   - Glow (cyan `#7AD7F0`) is for night, the lounge and cocktails.
   - Lantern (amber `#F0A860`) is for dining and brunch.
5. **Tap targets are 44 px or larger.** Body text is 15 px or larger, and text contrast is at least 4.5:1.
6. **Fast.** Hero images under 150 KB (AVIF/WebP), and the largest content visible (LCP) under 2.5 s on 4G. Menu page images are cached for offline reading at the table.

## 2. Stack (proposed, confirm before building)

| Concern | Proposal |
|---|---|
| Framework | Next.js (App Router) + TypeScript, deployed as a PWA (installable, offline menu) |
| UI | `@meduza/ui` from `../design-system` (tokens, CSS, React components). Never hand-roll colours or spacing. |
| i18n | EN (default) and RU at launch, VI later. URL prefix `/en`, `/ru`. |
| Data | A simple database (SQLite/Postgres via Prisma or similar) for bookings and menu metadata |
| Hostess notifications | Telegram bot: new booking → hostess chat with Confirm / Decline buttons |
| Menu PDFs | Turn each uploaded PDF into page images (WebP, ~900 px wide, plus a 2× version) when it's uploaded |

## 3. Navigation

The bottom tab bar on phones has four tabs, and only four:

| Tab | Route | Screen file |
|---|---|---|
| Meduza (home) | `/` | `screens/m1-home.dc.html` |
| Menu | `/menu/[brunch\|cocktails\|dinner]` | `screens/m2-menu-reader.dc.html` |
| Book | `/book`, or `/booking/[ref]` when the guest has an active booking | `screens/m3-booking.dc.html`, `screens/m4-my-booking.dc.html` |
| Visit | `/visit` | `screens/m5-visit.dc.html` |

On desktop, a floating glass pill nav replaces the tab bar. See `screens/desktop-*.dc.html`.

## 4. Screens

### M1 · Home (`/`)
The sections, top to bottom:

1. Hero
   - Contents: jellyfish-tank photo, "Open now · until 02:00" status badge, headline "Smoke. Sip. *Relax.*" (italic serif on "Relax."), one-line intro with the address, and a primary **Book a table** button.
   - **Open/closed status is live**, computed from hours in Asia/Ho_Chi_Minh.
2. Quick actions: Menu, Call (`tel:`), Directions (maps deep link), Message (Telegram deep link).
3. **Featured carousel, which depends on the time of day.**
   - **Evening:** the 10 signature cocktails. Each card shows its menu page image, name, jellyfish strength and price.
   - **Day:** brunch highlights from the brunch menu pages.
   - The switch time is `[EVENING_STARTS]`, a placeholder until the owner confirms.
   - Every card opens the menu reader on that item's page: `/menu/cocktails?page=N`.
4. "Brunch to last call": three wide cards (Brunch, Dinner, Lounge · Hookah from 600k ₫).
5. "Our menus": three menu covers that open the reader.
6. Visit card (light Pearl theme): hours, address, and **Directions & contacts**.

### M2 · Menu (`/menu/[menu]?page=N`): the printed-menu reader
- **This is the only menu the guest sees.** There is no separate list menu in the UI.
- **Layout:**
  - Header: large title "Menu", **Contents** button, **Share** button.
  - Below it, a segmented control: Brunch / Cocktails / Dinner.
  - The page image in the middle, at A4 ratio, fitted to the height.
  - Under the page: previous button, then "Page name · N of M" (tapping it opens Contents), zoom, next button.
  - The tab bar sits below.
- **Interactions:**
  - Swipe left/right, or tap the left or right third of the page, to turn pages.
  - Tap the middle third, or pinch, to zoom. Pan while zoomed. The zoom button toggles zoom.
  - **Contents** opens a bottom sheet listing every page with a thumbnail and title. Tapping one jumps to that page.
- **Which menu opens by default** depends on the time of day: Brunch in the day, Dinner or Cocktails in the evening.
- **Deep links:** `?page=N` opens that page, which is used by table QR codes and links shared in Telegram, Zalo and Instagram. Each menu page needs its own Open Graph image.
- **Hidden text layer (required).** Render the full menu as semantic HTML: visually hidden, but available to search engines and screen readers. Use the parked list design (`screens/parked-list-menu.dc.html`) as the data model. It is **not** shown as a separate UI.
- **Page data** (titles are in `screens/m2-menu-reader.dc.html`; images are in `assets/menu-pages/`):
  - Brunch: 7 pages
  - Cocktails: 12 pages
  - Dinner: 14 pages
- **Source PDFs:** `../info/menu/*.pdf`

### M3 · Booking (`/book`): mirrors the live form at meduza-nt.com/booking
**No seating area choice.** The flow is two steps, plus a confirmation screen:

1. **Date, time & guests**
   - Date: horizontal date strip, today first, swipeable, 14 days ahead plus "More dates".
   - Time: 30-minute slots from **12:00 to 02:00**, grouped Day (12:00–16:30), Evening (17:00–21:30) and Late (22:00–02:00).
     - **Bookable only from 1.5 hours ahead** (today, earlier slots are disabled).
     - Times after midnight belong to the *previous* opening day.
   - Guests: stepper from 1 to `[MAX_GUESTS]`. The max is unconfirmed; 20 for now.
2. **Your details**
   - Name: required.
   - Phone: required, `inputmode="tel"`, `+84` hint.
   - Instagram: optional, with "@" before the field and the help text "Preferred contact — we'll message you there if you add it."
   - Special requests: optional.
   - Note: "A hostess will confirm your booking in Telegram or by phone."
   - The primary button says **Book**.
3. **Request sent**
   - Shows date, time and guests, then **View my booking** and **Make another booking**.

A sticky primary button sits at the bottom and shows the live summary ("Today, 16 Nov · 20:30 · 2 guests").
The desktop layout is a two-column form with a summary card. See `screens/desktop-booking.dc.html`.

### M4 · My booking (`/booking/[ref]`)
- **Ticket card:** area photo, status badge, date and time in large type, guest count and reference number.
- **Statuses:** `pending` ("Waiting for the hostess", amber, slow pulse) → `confirmed` (green) or `declined`/`cancelled`.
- **Timeline:** Request sent → Hostess confirms (in Telegram or by phone) → Arrive.
- **Actions:** Directions, Message us, Add to calendar (.ics), Change (reopens the booking form prefilled), and Cancel booking (destructive, asks for confirmation).

### M5 · Visit (`/visit`)
- Map embed (dark style, single glowing pin), **Directions** and **Open in Grab**.
- Hours card with a live open/closed badge.
- Contact list: Telegram, Zalo, Instagram, Call.
- "Good to know" tiles (all placeholders for now).

## 5. Booking backend (behaviour)

1. The guest submits → create a booking (`status=pending`, reference like `MDZ-1234`).
2. **Validate on the server:**
   - Inside opening hours.
   - At least 1.5 hours ahead in Asia/Ho_Chi_Minh.
   - Guests between 1 and max.
   - Phone is valid.
3. **Notify the hostess** in a Telegram chat with all details and inline buttons: **Confirm** / **Decline** / **Call guest**.
4. When the hostess acts, update the status. The guest sees it on `/booking/[ref]`, and the hostess contacts them in Telegram or by phone (Instagram if given).
5. Keep the reference in local storage so the Book tab shows "My booking" while a booking is active.
6. **Rate-limit** submissions and add a honeypot field. No captcha unless spam appears.

## 6. Content and data

- **Prices:**
  - VND, formatted per locale with `formatPrice()` from `@meduza/ui`: en `260,000 ₫`, ru `260 000 ₫`, vi `260.000 ₫`.
  - Printed menus show prices in thousands ("240"); expand them to full VND in the app.
- **VAT:** food 8%, drinks and hookah 10% (both included in prices).
- **Cocktail strength:** 1–3 jellyfish (Light / Mild / Strong), taken from the cocktail PDF:

  | Cocktail | Strength | Price (₫) |
  |---|---|---|
  | Eyes of Meduza | 2 | 280,000 |
  | Frozen Gaze | 2 | 260,000 |
  | The Siren Secret | 3 | 260,000 |
  | Pearl Venom | 2 | 260,000 |
  | Abyss Whisper | 2 | 260,000 |
  | Lush by Meduza | 1 | 280,000 |
  | Neptune's Kiss | 1 | 260,000 |
  | The Oasis | 1 | 260,000 |
  | Eden Above | 3 | 280,000 |
  | Coastal Bloom | 1 | 280,000 |

- **Full menu text:**
  - The parked list menu (`screens/parked-list-menu.dc.html`) holds every brunch and dinner item from the new PDFs, in EN with RU.
  - The **EN brunch names are translations** (the brunch PDF is Russian only), so confirm them with the owner.
  - **Vegetarian and spicy markers are unconfirmed.**
- **Placeholders still to get from the owner:**

  | Topic | Placeholders |
  |---|---|
  | Hours | `[BRUNCH HOURS]`, `[DINNER HOURS]`, `[EVENING_STARTS]`, `[KITCHEN CLOSES]` |
  | Contacts | `[PHONE]`, `[TELEGRAM @HANDLE]`, `[ZALO NUMBER]`, `[INSTAGRAM @HANDLE]` |
  | Booking | `[MAX_GUESTS]`, `[HOLD POLICY]`, `[DEPOSIT / CANCELLATION POLICY]`, `[CONFIRM TIME]` |
  | Venue | `[MAP EMBED]`, Grab pickup point |
  | Visit page | `[DRESS CODE]`, `[PAYMENT METHODS]`, `[HOOKAH AGE/ZONE RULE]` |
  | Hookah | `[BLEND DESCRIPTION]` for each of the four blends |
  | Bar | wine, spirits and classic cocktails PDF (not provided yet) |

- **Logo:** `assets/logo/` holds temporary PNGs traced from a photo. Replace them with the vector master.

## 7. Files in this folder

```
design/
  HANDOFF.md            ← this spec
  screens/              ← design source per screen (.dc.html), linked to each other
    m0-mobile-rules     mobile rules, thumb zone, mobile type scale
    m1-home  m2-menu-reader  m3-booking  m4-my-booking  m5-visit
    parked-list-menu    data model for the hidden text menu (not a UI screen)
    desktop-home  desktop-menu  desktop-booking
    ds-01-foundations  ds-02-components
  assets/
    logo/  photos/  menu-pages/ (pages of the three PDFs)  menu-crops/ (section photos)
```

**How to read the screen files:** they are design-tool source files. They won't run standalone (they load a `support.js` runtime that isn't included), so read them as a precise spec:
- Inline `style` attributes give the exact sizes, colours and spacing.
- `{{…}}` are data bindings, and `<sc-for>` / `<sc-if>` are loops and conditions.
- The `<script type="text/x-dc">` block shows the screen's data and interaction logic.

Map every raw hex value to the matching `@meduza/ui` token (`--mz-*`). The token table is in `../design-system/README.md`.

## 8. Build order

1. Read this file and `CLAUDE.md`, then propose the folder structure and stack. **Don't write code yet.**
2. Set up the app, wire in `@meduza/ui`, and add the mobile type scale (from `m0-mobile-rules`) as tokens.
3. App shell: tab bar, routes, i18n (EN/RU), safe areas, PWA manifest.
4. Menu reader, including the PDF-to-images pipeline, deep links and the hidden text layer.
5. Booking form (front end), then the booking API and Telegram hostess bot, then My booking.
6. Home (time-of-day logic) and Visit.
7. Desktop layouts, Lighthouse pass (performance and accessibility ≥ 95), OG images and table QR codes.
