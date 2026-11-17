# home-hero Specification

## Purpose
Tells a guest within seconds what Meduza is, whether it is open now, and how to book or get in touch.

## Requirements

### Requirement: Hero content
The Home hero SHALL show the jellyfish tank photo, the headline "Smoke. Sip. Relax." with only "Relax." in the serif italic accent, a one-line intro that includes the address 157 Nguyễn Thiện Thuật, and one primary "Book a table" button.

#### Scenario: Phone hero
- **WHEN** a guest opens `/en` at 390 px width
- **THEN** the hero shows the photo, headline, intro and a single filled "Book a table" button linking to `/en/book`

### Requirement: Live open status
The hero SHALL show a status badge computed from Vietnam time: "Open now · until 02:00" while open, and the next opening time while closed. Before the browser computes it, the badge SHALL show the daily hours.

#### Scenario: Open in the evening
- **WHEN** the Vietnam time is 21:15
- **THEN** the badge reads "Open now · until 02:00"

#### Scenario: Closed in the morning
- **WHEN** the Vietnam time is 09:00
- **THEN** the badge shows that Meduza opens at 12:00

### Requirement: Quick actions
Below the hero SHALL be four quick actions: Menu, Call, Directions and Message. Menu SHALL open the menu reader, Directions SHALL open the maps link, and Call and Message SHALL be links only when their values are confirmed.

#### Scenario: Confirmed phone
- **WHEN** the phone number is confirmed
- **THEN** Call is a `tel:` link

#### Scenario: Placeholder handle
- **WHEN** the Telegram handle is still a placeholder
- **THEN** Message is shown as plain text with the placeholder and is not a link

### Requirement: One filled button
Only the "Book a table" button SHALL be filled and glowing on the screen; other actions SHALL be secondary or ghost.

#### Scenario: Visual hierarchy
- **WHEN** the home page is rendered
- **THEN** exactly one filled primary button is visible in the first viewport

### Requirement: Fast hero image
The hero photo SHALL be served in a modern format sized for the viewport, no larger than 150 KB for a phone, with explicit width and height and no layout shift.

#### Scenario: Phone download
- **WHEN** the hero loads on a 390 px viewport
- **THEN** the image transferred is under 150 KB and the page does not shift when it appears

### Requirement: Mobile first
The hero SHALL be designed for 390 px first: the status, headline, Book button and quick actions SHALL fit the first screen with the Book button within thumb reach, and the desktop hero is an enhancement from 900 px.

#### Scenario: Phone first
- **WHEN** a guest opens Home at 390 px
- **THEN** the Book a table button and the four quick actions are visible without scrolling past the hero
