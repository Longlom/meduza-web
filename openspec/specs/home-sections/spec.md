# home-sections Specification

## Purpose
Helps guests choose between brunch, dinner and the lounge, open the menus, and find the venue.

## Requirements

### Requirement: Experience cards
A "Brunch to last call" section SHALL show three wide photo cards: Brunch (Pasta Club and Vietnamese brunch, with hours), Dinner (with hours) and Lounge ("until 02:00", hookah from 600,000 ₫). Brunch and Dinner SHALL use the Lantern accent.

#### Scenario: Cards on a phone
- **WHEN** a guest scrolls to the section at 390 px
- **THEN** three full-width cards are shown with their titles and the Brunch and Dinner eyebrows in Lantern

#### Scenario: Hours not yet confirmed
- **WHEN** the brunch hours are still a placeholder
- **THEN** the card shows `[BRUNCH HOURS]` as plain text

### Requirement: Menu covers
An "Our menus" section SHALL show covers for Brunch (7 pages), Cocktails (12 pages) and Dinner (14 pages), each opening that menu in the reader.

#### Scenario: Open the dinner menu
- **WHEN** a guest taps the Dinner cover
- **THEN** the menu reader opens Dinner

### Requirement: Visit card
A card in the Pearl theme SHALL show the daily hours, the address and a "Directions & contacts" action to the Visit page.

#### Scenario: Pearl card
- **WHEN** a guest scrolls to the end of Home
- **THEN** a light card shows "Daily · 12:00 – 02:00", the address and the Visit action, while the page stays dark

### Requirement: Desktop layout
At 900 px and above, Home SHALL follow the desktop design: a larger hero with "Book a table" and "Open the menu", the three experience cards with short descriptions in a row, the menu covers and the visit block with hours, address and phone.

#### Scenario: Desktop
- **WHEN** a guest opens Home at 1280 px
- **THEN** the experience cards share one row and the visit block lists hours, address and phone

### Requirement: Locale and prices
All Home text SHALL come from the locale dictionaries and prices SHALL use the locale price format.

#### Scenario: Russian hookah price
- **WHEN** Home is shown in Russian
- **THEN** the hookah price reads `600 000 ₫`

### Requirement: Mobile first
Home sections SHALL be designed as a single phone column first, with the desktop rows and grids added from 900 px.

#### Scenario: Phone first
- **WHEN** a guest scrolls Home at 390 px
- **THEN** each section is one full-width column with no horizontal page scroll
