# localization Specification

## Purpose
Presents every screen in English or Russian under a locale URL prefix, keeps both languages complete, and leaves room to add Vietnamese later.

## Requirements

### Requirement: Locale URL prefix
Every page SHALL live under `/en` or `/ru`. Any other first path segment that is not a known locale SHALL be redirected as described below, and an unknown locale under a valid page path SHALL return 404.

#### Scenario: Valid locale
- **WHEN** a guest opens `/ru/book`
- **THEN** the page is shown in Russian with `lang="ru"` on the document

#### Scenario: Unknown locale
- **WHEN** a guest opens `/de/book`
- **THEN** the guest is redirected to the matching page in a supported locale

### Requirement: Locale detection on bare URLs
Bare URLs SHALL redirect to a locale prefix chosen from the first language in the browser's Accept-Language header: Russian when it starts with `ru`, English otherwise. Path and query SHALL be preserved, and `/book` and `/booking` SHALL redirect to `/{locale}/book`.

#### Scenario: Russian browser
- **WHEN** a guest whose browser prefers `ru-RU` opens `/`
- **THEN** the guest is redirected to `/ru`

#### Scenario: Legacy booking link
- **WHEN** a guest opens `/booking`
- **THEN** the guest is redirected to `/{locale}/book`

### Requirement: Language switch
Each site page SHALL offer a link to the same page in the other locale, preserving page-specific query parameters.

#### Scenario: Switch on a phone
- **WHEN** a guest views any site page at 390 px
- **THEN** the EN / RU switch is shown at the top right, clear of the notch, and has targets of at least 44 px

#### Scenario: Switching on a menu page
- **WHEN** a guest viewing `/en/menu/cocktails?page=4` follows the Russian link
- **THEN** the guest lands on `/ru/menu/cocktails?page=4`

### Requirement: Dictionaries are complete and typed
All user-facing text SHALL come from locale dictionaries. The Russian dictionary SHALL have exactly the same keys as the English one, and a missing or extra key SHALL fail the type check.

#### Scenario: Missing Russian key
- **WHEN** a key is added to the English dictionary only
- **THEN** `npm run typecheck` fails and names the missing key

### Requirement: Alternate language links
Each page SHALL declare its alternate-language versions for search engines.

#### Scenario: Alternates
- **WHEN** a crawler fetches `/en/visit`
- **THEN** the page declares `/en/visit` and `/ru/visit` as language alternates

### Requirement: Locale-aware formats
Prices SHALL be formatted per locale in VND (`260,000 ₫` in English, `260 000 ₫` in Russian), and dates and times SHALL be shown in Vietnam time.

#### Scenario: Price in Russian
- **WHEN** a price of 260000 is shown on a Russian page
- **THEN** it reads `260 000 ₫`

### Requirement: Vietnamese is not offered until complete
Vietnamese SHALL NOT appear as a language option or URL until its dictionary is complete.

#### Scenario: Switcher options
- **WHEN** the language switch is shown
- **THEN** it offers only EN and RU

### Requirement: Mobile first
Language handling SHALL be usable on a phone first: the language switch SHALL be reachable at 390 px, and the longest Russian text SHALL fit its control without overflow or truncation.

#### Scenario: Phone first
- **WHEN** a guest opens any site page at 390 px
- **THEN** an EN / RU switch of at least 44 px is visible at the top of the screen and the Russian labels fit without clipping
