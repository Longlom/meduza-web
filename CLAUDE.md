# Meduza web app — rules for Claude Code

The spec is in `design/HANDOFF.md`, so read it before any feature work. Visual source per screen is in `design/screens/`, and the design system is in `design-system/` (`@meduza/ui`).

## Always
- **Mobile first.** Build at 390 px wide first, then add desktop.
- **Use `@meduza/ui`:** import `@meduza/ui/styles.css` once, and use its components and `--mz-*` CSS variables.
  - Never hardcode hex colours, font sizes, radii or shadows.
  - If a token is missing, add it to `design-system/tokens/tokens.json` and run `npm run tokens`. Don't inline it.
- **Themes:** `data-theme="abyss"` (dark, default) or `"pearl"` (light). `data-mood="lantern"` switches the accent to amber for brunch and dining.
- **Accessibility:**
  - Tap targets ≥ 44 px, and every control is a real `<button>`, `<a>` or `<input>` with a label.
  - Icon-only buttons get an `aria-label`.
  - Text contrast ≥ 4.5:1, and respect `prefers-reduced-motion`.
- **Safe areas:** controls never go under the status bar or the home indicator (`env(safe-area-inset-*)`).
- **Time:** all time logic uses `Asia/Ho_Chi_Minh`.
  - Opening hours are 12:00–02:00, and times after midnight belong to the previous opening day.
  - Bookings are allowed from 1.5 h ahead.
- **Prices:** always format with `formatPrice()` (VND, locale-aware) and tabular figures.
- **Copy:** EN and RU from the start, with no hardcoded user-facing strings outside the i18n files.
- **Images:** next-gen formats (AVIF/WebP), with explicit width and height, and lazy-load below the fold.

## Never
- Don't add a seating/area choice to booking. It was removed on purpose.
- Don't show a second, list-style menu. The Menu tab is the PDF page reader; the text menu exists only as a hidden layer for search engines and screen readers.
- Don't invent prices, hours, policies or contact details. Keep the `[PLACEHOLDER]` and list it in your summary.
- Don't use emoji as UI icons. Use the line icons in `@meduza/ui` (`src/icons.tsx`).

## Working style
- Work in the small steps listed in `design/HANDOFF.md` §8. Propose a plan before large changes.
- After each step, compare the UI against the matching `design/screens/*.dc.html` at 390 px and at desktop width, and say what differs.
