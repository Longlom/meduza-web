# Spec Delta

## Purpose

Holds one authoritative record of Meduza's address, hours and contacts, and shows honestly when a value is still a placeholder awaiting the owner.

## ADDED Requirements

### Requirement: Single venue record
Address, opening hours, contacts, maps and Grab details SHALL be defined once and read by every screen. The address is 157 Nguyễn Thiện Thuật, Nha Trang, and the hours are daily 12:00–02:00 Vietnam time.

#### Scenario: One place to edit
- **WHEN** a contact value is changed in the venue record
- **THEN** every screen that shows it displays the new value without further edits

### Requirement: Placeholders are visible and never act as links
A value that is still a placeholder SHALL be shown as plain text in its bracketed form and SHALL NOT be rendered as a link or button action.

#### Scenario: Unconfirmed phone number
- **WHEN** the phone value is `[PHONE]`
- **THEN** it is shown as plain text and no `tel:` link is rendered

#### Scenario: Confirmed phone number
- **WHEN** the phone value is a real number
- **THEN** it is rendered as a `tel:` link

### Requirement: Placeholder report
A command SHALL list every value that is still a placeholder, with where it is used.

#### Scenario: Listing placeholders
- **WHEN** `npm run placeholders` runs
- **THEN** it prints each remaining placeholder name and exits successfully

### Requirement: Live open or closed status
The status SHALL be computed from Vietnam time: open from 12:00 until 02:00 the next day, closed otherwise. Open shows "Open now · until 02:00" and closed shows the next opening time.

#### Scenario: Open late at night
- **WHEN** the Vietnam time is 01:59
- **THEN** the status is Open now

#### Scenario: Closed at closing time
- **WHEN** the Vietnam time is 02:00
- **THEN** the status is Closed and shows that it opens at 12:00

#### Scenario: Closed in the morning
- **WHEN** the Vietnam time is 11:59
- **THEN** the status is Closed

### Requirement: No mismatch on first load
The status SHALL NOT cause a server and browser mismatch: before it is computed in the browser, the page shows the hours instead of a status.

#### Scenario: First paint
- **WHEN** a page with the status is first rendered
- **THEN** it shows "Daily 12:00 – 02:00" until the browser computes the live state

### Requirement: Directions link
A directions action SHALL open the guest's maps app with the venue address as destination.

#### Scenario: Directions on a phone
- **WHEN** the guest taps Directions
- **THEN** a maps link for 157 Nguyễn Thiện Thuật, Nha Trang opens

### Requirement: Mobile first
Venue actions SHALL be designed for one-tap use on a phone: call, message and directions targets SHALL be at least 44 px, and text SHALL be at least 15 px.

#### Scenario: Phone first
- **WHEN** a guest views a venue action at 390 px
- **THEN** its tappable area is at least 44 px and its text is at least 15 px
