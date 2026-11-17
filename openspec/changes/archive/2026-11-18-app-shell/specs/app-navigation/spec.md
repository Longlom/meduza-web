# Spec Delta

## Purpose

Gives guests one consistent way to move between Meduza, Menu, Book and Visit on phone and desktop, with Book always one tap away and nothing hidden under the notch or home indicator.

## ADDED Requirements

### Requirement: Phone tab bar
Below 900 px width, site pages SHALL show a bottom tab bar with exactly four tabs in this order: Meduza, Menu, Book, Visit. The tab for the current section SHALL be marked as current.

#### Scenario: Tabs on a phone
- **WHEN** a guest opens the home page at 390 px width
- **THEN** a tab bar with the four tabs is fixed to the bottom and the Meduza tab is marked current

#### Scenario: Touch targets
- **WHEN** the tab bar is shown
- **THEN** every tab is at least 44 px tall and wide

### Requirement: Desktop navigation
At 900 px width and above, site pages SHALL show a floating glass navigation bar with the logo, links to Menu, Book and Visit, a language switch and a "Book a table" button, and SHALL NOT show the tab bar.

#### Scenario: Desktop nav
- **WHEN** a guest opens any site page at 1280 px width
- **THEN** the floating nav is shown, the tab bar is not, and the current section's link is marked current

### Requirement: Booking form is full screen
The booking form SHALL NOT show the tab bar. On a phone it SHALL use its own header (close or back, step label, progress) and sticky action button.

#### Scenario: No tab bar while booking
- **WHEN** a guest opens the booking form on a phone
- **THEN** no tab bar is visible and the sticky action button sits at the bottom of the screen

### Requirement: Safe areas
Interactive controls SHALL stay clear of the device's top inset and home indicator on notched phones.

#### Scenario: Bottom controls on a notched phone
- **WHEN** the tab bar or the booking sticky button is shown on a device with a bottom safe-area inset
- **THEN** the control's tappable area ends above the inset, and only its background extends behind it

### Requirement: Client-side navigation
Moving between tabs SHALL use client-side navigation without a full page reload.

#### Scenario: Switching tabs
- **WHEN** a guest taps another tab
- **THEN** the new page renders without the browser reloading the document and the tab bar keeps its position

### Requirement: Accessible navigation
Navigation SHALL be a labelled landmark made of real links, with a visible keyboard focus state.

#### Scenario: Keyboard use
- **WHEN** a guest tabs through the page with the keyboard
- **THEN** each nav link receives a visible focus outline and activates with Enter

### Requirement: Mobile first
Navigation SHALL be designed and built for 390 px first: the tab bar is the primary navigation, and the desktop nav is an enhancement added from 900 px with `min-width` rules only.

#### Scenario: Phone first
- **WHEN** a guest opens any site page at 390 px
- **THEN** every navigation item and the language switch is reachable with one thumb, without horizontal scrolling and without the desktop nav
