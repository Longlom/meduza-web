# visit-practical-info Specification

## Purpose
Tells guests when Meduza is open, how to reach a hostess, and what to know before they arrive.

## Requirements

### Requirement: Hours card
The hours card SHALL show a live open or closed badge, "Every day 12:00 – 02:00", a Brunch row, a "Kitchen closes" row and the note "Vietnam time (GMT+7)". Brunch and Kitchen rows SHALL show their placeholders until confirmed.

#### Scenario: Open now
- **WHEN** the Vietnam time is 22:00
- **THEN** the badge reads Open now and the card shows "Every day 12:00 – 02:00"

#### Scenario: Unconfirmed rows
- **WHEN** the brunch hours and kitchen closing time are placeholders
- **THEN** their rows show `[BRUNCH HOURS]` and `[KITCHEN CLOSES]` as plain text

### Requirement: Contacts
A "Talk to the hostess" list SHALL offer Telegram, Zalo, Instagram and Call. Each entry SHALL be a link only when its value is confirmed; otherwise it SHALL show the placeholder as plain text. Each row SHALL be at least 44 px tall.

#### Scenario: Confirmed Telegram handle
- **WHEN** the Telegram handle is confirmed
- **THEN** the Telegram row links to the handle and shows it

#### Scenario: Unconfirmed Zalo
- **WHEN** the Zalo number is a placeholder
- **THEN** the Zalo row shows `[ZALO NUMBER]` and is not a link

### Requirement: Localized content
All text SHALL come from the locale dictionaries, and times SHALL be shown in Vietnam time.

#### Scenario: Russian page
- **WHEN** a guest opens `/ru/visit`
- **THEN** every label is Russian and the hours remain 12:00 – 02:00

### Requirement: Mobile first
Hours and contacts SHALL be designed as a single phone column first, with contact rows of at least 44 px, and the desktop layout added from 900 px.

#### Scenario: Phone first
- **WHEN** a guest opens Visit at 390 px
- **THEN** the hours card and contact rows stack in one column and every row is at least 44 px tall
