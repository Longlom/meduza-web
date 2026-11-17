# Spec Delta

## Purpose

Gives search engines and screen-reader users the full menu as real text, without ever showing a second, list-style menu to guests.

## ADDED Requirements

### Requirement: Full text on every menu page
Every menu page URL SHALL include the complete text of its menu as semantic HTML: sections as headings, items as list entries with names, descriptions and prices. The text SHALL be visually hidden and remain available to assistive technology and crawlers.

#### Scenario: Crawler reads dinner
- **WHEN** the HTML of `/en/menu/dinner` is read without running scripts
- **THEN** it contains the dinner sections, item names and prices as text

#### Scenario: Not shown to sighted guests
- **WHEN** a guest views the menu page
- **THEN** no list or text version of the menu is visible

### Requirement: Prices in full VND
Printed prices in thousands SHALL be expanded to full VND and formatted for the page's locale, with tabular figures. The page SHALL state that food prices include 8% VAT and drinks and hookah prices include 10% VAT.

#### Scenario: Price expansion
- **WHEN** the printed price is "240"
- **THEN** the text layer shows `240,000 ₫` on the English page and `240 000 ₫` on the Russian page

### Requirement: Cocktail strength as text
Each signature cocktail SHALL show its strength as a word (Light, Mild or Strong) next to its jellyfish rating, using the strength and price table from the handoff.

#### Scenario: Strength wording
- **WHEN** the text layer lists "The Siren Secret"
- **THEN** it states strength Strong and price `260,000 ₫`

### Requirement: Unconfirmed content is flagged
Data that the owner has not confirmed (English brunch names translated from Russian, vegetarian and spicy markers) SHALL be marked unconfirmed in the data and SHALL be listed by a report command. Dietary markers SHALL be published only once confirmed.

#### Scenario: Unconfirmed markers are not published
- **WHEN** a vegetarian or spicy marker has not been confirmed
- **THEN** the text layer omits it until it is confirmed

#### Scenario: Report
- **WHEN** `npm run menu:unconfirmed` runs
- **THEN** it lists every unconfirmed item and marker and exits successfully

### Requirement: Nothing invented
The text layer SHALL contain only items present in the supplied PDFs and handoff. Menus without a supplied source (wine, spirits, classic cocktails, soft drinks, shisha) SHALL be omitted.

#### Scenario: Missing bar menu
- **WHEN** the text layer is generated
- **THEN** it has no entries for wine, spirits or shisha

### Requirement: Mobile first
The text layer SHALL cost a phone almost nothing: it SHALL be plain server-rendered text with no images or scripts, and SHALL NOT add visible content or layout shift at 390 px.

#### Scenario: Phone first
- **WHEN** a phone loads a menu page
- **THEN** the page shows only the reader, the hidden text adds no visible element, and the layout does not shift
