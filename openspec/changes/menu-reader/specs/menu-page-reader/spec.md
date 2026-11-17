# Spec Delta

## Purpose

Lets guests read Meduza's printed menus page by page on any device, turn pages naturally, zoom into details, and jump straight to any page.

## ADDED Requirements

### Requirement: Menus and default menu
The reader SHALL offer three menus: Brunch (7 pages), Cocktails (12) and Dinner (14). The bare `/{locale}/menu` URL SHALL redirect to a default menu chosen from Vietnam time: Brunch during the day, and the evening default menu after the evening start.

#### Scenario: Daytime visit
- **WHEN** a guest opens `/en/menu` at 11:00 Vietnam time
- **THEN** the guest is redirected to `/en/menu/brunch`

#### Scenario: Evening visit
- **WHEN** a guest opens `/en/menu` after the evening start
- **THEN** the guest is redirected to the configured evening default menu

### Requirement: Reader layout on a phone
At 390 px width the screen SHALL show a large "Menu" title with Contents and Share buttons, a Brunch / Cocktails / Dinner segmented control, the current page at A4 ratio fitted to the available height, and under it: previous, "Page name · N of M" (opens Contents), zoom and next.

#### Scenario: Phone layout
- **WHEN** a guest opens `/en/menu/dinner?page=3` on a phone
- **THEN** page 3 is shown with the segmented control above it and the controls row below it

### Requirement: Turning pages
A guest SHALL be able to turn pages by swiping, by tapping the left or right third of the page, with the previous and next buttons, and with the arrow keys. Previous SHALL be disabled on the first page and next on the last.

#### Scenario: Swipe
- **WHEN** a guest swipes left on page 3
- **THEN** page 4 is shown and the page indicator reads "4 of M"

#### Scenario: Tap zones
- **WHEN** a guest taps the right third of the page
- **THEN** the next page is shown

#### Scenario: End of menu
- **WHEN** the last page is shown
- **THEN** the next button is disabled and swiping forward does nothing

### Requirement: Zoom and pan
A guest SHALL be able to zoom by tapping the middle third, pinching, or using the zoom button, and to pan while zoomed. Turning a page or changing menu SHALL reset the zoom.

#### Scenario: Zoom in and pan
- **WHEN** a guest taps the middle third of a page
- **THEN** the page zooms in, the zoom button shows its active state and the guest can drag to pan

#### Scenario: Zoom resets
- **WHEN** a guest zooms in and then turns the page
- **THEN** the next page is shown unzoomed

### Requirement: Contents
The Contents button SHALL open a sheet listing every page of the current menu with a thumbnail, number and title, marking the current page. Choosing a page SHALL jump to it and close the sheet. The sheet SHALL close by dragging down, tapping outside or pressing Escape.

#### Scenario: Jump to a page
- **WHEN** a guest opens Contents and taps "Pasta"
- **THEN** the sheet closes and the Pasta page is shown

#### Scenario: Dismiss
- **WHEN** the Contents sheet is open and the guest presses Escape
- **THEN** the sheet closes and focus returns to the Contents button

#### Scenario: Contents on desktop
- **WHEN** a guest views the reader at 900 px and above
- **THEN** the contents are a permanent sidebar listing every page, and choosing a page shows its spread

### Requirement: Deep links
`?page=N` (1-based) SHALL open that page. A number outside the range SHALL be clamped to the first or last page, and a non-number SHALL open the menu's default page. Turning pages SHALL update `?page` without adding browser history entries.

#### Scenario: Valid deep link
- **WHEN** a guest opens `/en/menu/cocktails?page=4`
- **THEN** page 4, "The Siren Secret", is shown

#### Scenario: Out of range
- **WHEN** a guest opens `/en/menu/cocktails?page=99`
- **THEN** page 12, the last page, is shown

### Requirement: Switching menus
Choosing another menu in the segmented control SHALL show that menu's first content page (page 2) and reset zoom. The cover stays reachable with previous.

#### Scenario: Switch to Dinner
- **WHEN** a guest on Brunch taps Dinner
- **THEN** page 2 of the Dinner menu is shown and `?page=2` is in the address

### Requirement: Desktop spreads
At 900 px and above the reader SHALL show book-style spreads: the cover alone, then pairs of pages, with a single page last when the count is odd. Arrow keys SHALL turn spreads, clicking a page SHALL zoom it, and "Back to spread" SHALL return.

#### Scenario: Spread pairing
- **WHEN** a guest opens page 2 of a 14-page menu at 1280 px
- **THEN** pages 2 and 3 are shown side by side with the label "Pages 2–3 of 14"

### Requirement: Accessible reader
Each page image SHALL have text alternatives of the form "Dinner menu, page 4: Salads". All controls SHALL be real buttons with labels, targets at least 44 px, and the page change SHALL be announced politely. Animations SHALL respect reduced motion.

#### Scenario: Screen reader
- **WHEN** a screen-reader user turns to page 4
- **THEN** the new page name and "4 of 14" are announced

### Requirement: No layout shift
Pages SHALL reserve their A4 space before the image loads, and the current page and its neighbours SHALL be preloaded.

#### Scenario: Slow connection
- **WHEN** a page image is still loading
- **THEN** a placeholder of the same size is shown and the controls do not move

### Requirement: Mobile first
The reader SHALL be designed for a 390 px phone first, with touch gestures as the primary input; desktop spreads and keyboard control are enhancements added from 900 px.

#### Scenario: Phone first
- **WHEN** a guest opens the reader at 390 px
- **THEN** a single page fills the available height, every control is within thumb reach, and nothing requires a mouse or keyboard
