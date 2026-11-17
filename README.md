# Meduza web

Website and booking app for **Meduza — Cocktails & Cuisine**, Nha Trang. Next.js 15 (App Router), React 19, TypeScript, using the `@meduza/ui` design system from `design-system/`.

The spec is `design/HANDOFF.md`; project rules for Claude Code are in `CLAUDE.md`.

## Run
Needs Node 20 or 22. **Mobile first:** build and check everything at 390 px first, then desktop (styles use `min-width` queries only).

```bash
npm install
npm run dev              # http://localhost:3000, redirects to /en or /ru
npm run build && npm start
npm run typecheck        # also fails if the Russian dictionary misses an English key
npm test                 # Vitest: time rules, slots, validation, venue info
npm run check:tokens     # fails on hardcoded colours or max-width media queries
npm run placeholders     # lists every [PLACEHOLDER] still to confirm with the owner
npm run icons            # regenerates public/icons from public/logo
```

Environment (see `.env.example`): `TELEGRAM_BOT_TOKEN`, `TELEGRAM_CHAT_ID`, `TELEGRAM_DRY_RUN`, `BOOKING_LAST_TIME`, optional `SITE_URL` (default `https://meduza-nt.com`).

## App shell
- Phone: four-tab bar (Meduza, Menu, Book, Visit) and an EN / RU switch top right. Desktop (900 px and up): floating nav. The booking form is full screen without the tab bar.
- Installable web app: manifest, icons and a small service worker (`public/sw.js`, production only). Visited pages work offline, and a page never opened shows a branded offline page. `/api/*` is never cached, and a new worker version waits until open pages close.
- Venue facts and placeholders live in `lib/venue-info.ts`. A value in square brackets is a placeholder: it shows as plain text and never becomes a link.

## Menu images
The menu pages come from the PDFs in `info/menu/`. `npm run menu:images` renders them (macOS PDFKit, nothing to install), writes AVIF and WebP at 450, 900 and 1800 px with content-hashed names to `public/menu/`, one 1200×630 share image per page to `public/og/menu/`, and `lib/menu/image-hashes.json`. The output is committed, so a deploy needs neither Swift nor the PDFs. Run it again whenever a PDF changes.

## Menu reader
`/en/menu` redirects to the right menu for the moment (brunch by day, cocktails after the evening start; both are provisional, see `[EVENING_STARTS]` and `[MENU_EVENING_DEFAULT]` in `npm run placeholders`). `/en/menu/<brunch|cocktails|dinner>?page=N` opens page N (a number outside the range is clamped; anything else opens page 2). Phone: swipe, tap the left or right third to turn, tap the middle to zoom, Contents sheet, Share. Desktop: book-style spreads with a Contents sidebar and arrow keys.
- The full text menu is in the page HTML, visually hidden, for search engines and screen readers (`lib/menu/items.ts`, `lib/menu/cocktails.ts`). Wine, spirits and the rest of the bar are not there until their PDFs are supplied.
- `npm run menu:unconfirmed` lists dishes and markers the owner has not confirmed (English brunch names are translations; vegetarian and spicy markers are not published until confirmed).
- Offline: viewed pages are cached by the service worker (production build); the rest of the menu is fetched in the background unless data saving or a 2g connection is detected.

## Booking (first slice)
- Guests book at `/en/book` or `/ru/book`. `/`, `/book` and `/booking` redirect there by browser language.
- Phone: two steps (date, time & guests → your details). Desktop: one page with a summary card.
- The server checks the request and sends it to the hostess in **Telegram**. There is no database yet.
- With `TELEGRAM_DRY_RUN=1` (or no bot configured in development) a booking is **printed in the terminal** instead of sent. Copy `.env.example` to `.env.local` to use a real bot.

### Rules (`lib/venue.ts`, `lib/time.ts`)
- Open **12:00–02:00**, Vietnam time (GMT+7), slots every 30 minutes.
- Bookable only from **1.5 hours ahead**, checked in the browser and again on the server.
- Times after midnight belong to the **previous opening day**; the Telegram message spells out the real date.
- **Last bookable time** is `BOOKING_LAST_TIME` (23:30). Later slots are not shown and the server rejects them. Empty means closing time (02:00).
- Guests 1–20 (`MAX_GUESTS` is a placeholder until the owner confirms).
- Honeypot field plus a best-effort in-memory rate limit (per server instance; a shared store comes with the database).

### My booking (stored on the guest's device)
After a request succeeds the app keeps it in the browser's `localStorage` (key `mdz:bookings:v1`, code in `lib/my-bookings.ts`) so the guest can reopen it at `/en/booking/MDZ-1234`, add it to a calendar, change it or cancel it. There is no database yet.
- **What is stored on the device:** reference, date, time, guests, name, phone, Instagram handle, notes, when the request was sent, and its status (`pending`, `cancelled` or `changed`, plus when and, for a change, the new reference). Name and phone are kept so Change can pre-fill the form.
- **What leaves the device:** only the booking, change or cancel request itself, which goes to the hostess in Telegram. Nothing else is sent to a server, and the ticket page is not indexed by search engines.
- **How long:** a record is removed on the next visit after the opening day it belongs to has ended (after 02:00). Clearing site data removes it earlier; the ticket then says it cannot find the booking on this device.
- **Statuses:** the ticket only says *Request sent*, *Cancelled* or *Changed*. It never claims *Confirmed* and never mentions a hostess confirming, because there is no backend to know. After booking, the guest lands on the ticket (the Book tab).
- **Change** reopens the form pre-filled (`/book?change=MDZ-1234`); the hostess gets "Change request — replaces MDZ-1234" with a new reference. **Cancel** (`POST /api/booking/cancel`) sends "Cancellation requested · MDZ-1234". Both are requests the hostess checks with the guest, use the same honeypot and the same 8-per-IP limit as new bookings, and are offered only until the booked time.

### Telegram bot setup
1. Create a bot via **BotFather** and get `TELEGRAM_BOT_TOKEN`.
2. Get `TELEGRAM_CHAT_ID`: message the bot (or add it to a group), then read the id with `getUpdates`.

## Layout
- `app/[locale]/…` pages, `app/api/booking` API route, `middleware.ts` locale redirects.
- `components/` UI, `lib/` rules, validation, i18n (`lib/i18n`, EN and RU), Telegram.
- `app/booking.css` layout only; colours, type, radii and spacing come from `--mz-*` tokens.
- `design-system/` `@meduza/ui`, `design/` spec and screens, `info/` source material from the owner.
