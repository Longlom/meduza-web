# Spec Delta

## Purpose

Shows guests what matters at this moment, cocktails at night and brunch by day, and takes them to that exact menu page.

## ADDED Requirements

### Requirement: Evening content
From the evening start, the carousel SHALL show the 10 signature cocktails, titled "Signature cocktails" with the eyebrow "Rated in jellyfish". Each card SHALL show the menu page image, the name, the jellyfish strength and the price.

#### Scenario: Evening carousel
- **WHEN** the Vietnam time is after the evening start
- **THEN** the carousel lists the 10 signature cocktails in menu order, each with its strength and price

### Requirement: Daytime content
Before the evening start, the carousel SHALL show brunch highlights, titled "Brunch today" with the eyebrow "Until [BRUNCH END]", using the Lantern accent.

#### Scenario: Day carousel
- **WHEN** the Vietnam time is 11:00
- **THEN** the carousel shows brunch highlight cards and uses the Lantern accent

### Requirement: Cards open the right page
Each card SHALL link to the menu reader on that item's page, for example `/en/menu/cocktails?page=4` for "The Siren Secret".

#### Scenario: Open a cocktail
- **WHEN** a guest taps the "The Siren Secret" card
- **THEN** the menu reader opens Cocktails at page 4

### Requirement: Browsing
On a phone the carousel SHALL scroll horizontally with snapping, show the start of the next card, and have a "See all" link to the menu. On desktop it SHALL show several cards at once with visible previous and next controls.

#### Scenario: Phone scroll
- **WHEN** a guest swipes the carousel at 390 px
- **THEN** cards snap into place and the next card is partly visible

### Requirement: No mismatch or jump
The server SHALL render the set for the current Vietnam time. The browser SHALL start from that same set and switch only if the time of day has since changed, without console hydration errors.

#### Scenario: Cached page across the boundary
- **WHEN** a page rendered before the evening start is opened after it
- **THEN** the carousel hydrates without errors and then changes to the evening set

### Requirement: Accessible cards
Cards SHALL be real links with an accessible name that includes the item name and price, and the strength SHALL be available as text.

#### Scenario: Screen reader
- **WHEN** a screen-reader user focuses the first card
- **THEN** it announces "Eyes of Meduza 280,000 ₫, strength Mild", with the visible name and price first so the accessible name contains the visible text

### Requirement: Mobile first
The carousel SHALL be designed for swiping on a phone first; desktop buttons and several visible cards are enhancements from 900 px.

#### Scenario: Phone first
- **WHEN** a guest opens Home at 390 px
- **THEN** cards swipe with a thumb, one card plus a hint of the next is visible, and no button is required
