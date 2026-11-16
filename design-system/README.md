# @meduza/ui — Abyss & Lantern

The design system for **Meduza — Cocktails & Cuisine**, Nha Trang. It includes tokens, CSS and React + TypeScript components for the website, menu and booking app.

Two lights in one room. **Abyss** is the deep blue of the jellyfish tank, and it is the default dark theme. **Pearl** is the cream plaster and rattan, used as the light theme for brunch, print and receipts. Each theme has two **moods** that change the leading accent. **Glow** (cyan) is for the lounge, bar and hookah. **Lantern** (amber) is for dining and brunch.

## Quick start

```bash
npm install
npm run dev      # style guide at http://localhost:5173 (demo/)
npm run build    # regenerates tokens, typechecks, builds the style guide
```

Use it in an app (React 18+, any bundler that handles CSS and PNG imports, such as Vite or Next.js):

```tsx
import '@meduza/ui/styles.css';            // tokens + base + components
import { Button, MenuItem, Stepper } from '@meduza/ui';

<html data-theme="abyss">                  // or "pearl"
<section data-mood="lantern">…</section>   // amber accent for a dining/brunch block
```

Load the fonts once in `<head>`. They cover Latin, Vietnamese and Cyrillic, and on Apple devices they fall back to SF Pro:

```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=Inter+Tight:wght@500;600;700&family=Instrument+Serif:ital@0;1&display=swap&subset=vietnamese,cyrillic">
```

## Structure

| Path | What |
|---|---|
| `tokens/tokens.json` | **The source of truth.** Edit colours, type, space, radius and motion here. |
| `scripts/build-tokens.mjs` | Generates `src/styles/tokens.css` (CSS variables) and `src/tokens.ts` (typed values). Run it with `npm run tokens`. |
| `src/styles/` | `tokens.css` (generated), `base.css` (reset, type classes, layout), `components.css`, `fonts.css` (optional) |
| `src/components/` | React components |
| `src/icons.tsx` | Line icons with the jellyfish glyph |
| `src/utils.ts` | `cx`, `formatPrice`, `formatPriceCompact`, `buildSlots`, `VENUE_TIME_ZONE` |
| `assets/` | Logo PNGs. **Temporary:** they are traced from a menu photo, so replace them with the vector master. |
| `demo/` | Living style guide (Vite). Its photos live in `demo/public/photos`. |

## Tokens

Product code should use the **semantic** variables, never raw hex values:

| Role | Variable | Abyss | Pearl |
|---|---|---|---|
| Page ground | `--mz-bg` | #05070E | #F5F3EF |
| Card | `--mz-surface` | #0B1020 | #FFFFFF |
| Field / raised | `--mz-surface-raised` | #131A2E | #EFE7D8 |
| Text | `--mz-text` | #F5F5F7 (18.5:1) | #1D1D1F (15.2:1) |
| Secondary text | `--mz-text-secondary` | #A7ABB8 (8.8:1) | #5E5E63 (5.8:1) |
| Primary action | `--mz-accent` | Glow #7AD7F0 | Glow Deep #0B6A88 |
| Text on accent | `--mz-on-accent` | #05070E | #FFFFFF |
| Lantern accent | `--mz-secondary` | #F0A860 | #8A4E12 |

The rest of the scales:

- **Type:** use `.mz-display`, `.mz-title-1..3`, `.mz-headline`, `.mz-body`, `.mz-callout`, `.mz-footnote`, `.mz-caption`, `.mz-eyebrow`, and `.mz-accent-serif` for one italic phrase.
- **Space:** a 4-pt scale from `--mz-space-1` (4px) to `--mz-space-32` (128px), plus the fluid `--mz-space-page-x` and `--mz-space-section-y`.
- **Radius:** xs 10, sm 14, md 18, lg 22, xl 28, 2xl 32, pill.
- **Motion:** Tide is 240 ms `cubic-bezier(.2,.8,.2,1)`, for UI. Drift is 700 ms `cubic-bezier(.16,1,.3,1)`, for reveals. Both are disabled under `prefers-reduced-motion`.

## Components

| Component | Notes |
|---|---|
| `Button` | Variants `primary`, `secondary`, `inverse` and `ghost`; sizes `sm` 44, `md` 52, `lg` 56. It becomes an `<a>` when given `href`. `glow` adds the accent halo. |
| `IconButton` | 44×44. `aria-label` is required. |
| `Tag`, `StatusBadge` | Pills for Signature, Chef's pick and Vegetarian. `StatusBadge` is the live "Open now". |
| `SegmentedControl` | iOS-style. Arrow keys move the selection. Use `role="tabs"` to switch content and `"radio"` for a form value. |
| `ChipGroup` | Scrolling filter chips for menu categories. |
| `Stepper` | Guest counter, 1–12 by default. |
| `TextField`, `TextArea` | Label, hint and error, with aria wired up. |
| `DateStrip`, `TimeSlots`, `nextDays`, `venueDateKey` | Booking pickers in Vietnam time. Unavailable slots are struck through. |
| `MenuSection`, `MenuItem`, `PriceTable`, `StrengthMeter` | Menu rows with veg, spicy and strength markers. Prices are formatted per locale (`260,000 ₫`, `260 000 ₫`, `260.000 ₫`). |
| `Card`, `Glass`, `MediaCard` | Surfaces. `MediaCard` is a full-bleed photo tile with a scrim. |
| `NavBar`, `TabBar`, `Logo` | Floating glass nav. Its links hide below 760 px, so pair it with `TabBar`, which has four items at most. |
| `Theme` | Scopes `theme` and `mood` to a subtree. |

## Rules

1. **One filled button per view.** Glow is the primary action at night, Lantern on dining and brunch surfaces.
2. **One accent leads a screen.** Never put Glow and Lantern as equals side by side.
3. **Serif italic once per screen**, and only for an editorial phrase, never for UI.
4. **Tap targets are 44 px or more**, and every control is a real `<button>`, `<a>` or `<input>`.
5. **Prices** always go through `formatPrice` and use tabular figures.
6. **Photography:** night only and no flash. Let the tank or the lanterns be the light source.
7. **Contrast** is 4.5:1 for text. Every pair in the tokens table passes in both themes.

## To do when the owner's files arrive

- Replace `assets/logo-white.png` and `assets/logo-ink.png` with exports from the vector logo, and add an SVG.
- Add the brunch menu, address, phone, messenger handles and booking policies (these are placeholders in the designs).
