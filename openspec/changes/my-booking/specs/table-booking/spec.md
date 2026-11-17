# Spec Delta

## Purpose

Lets a guest request a table in a few taps and delivers the request to the hostess, within Meduza's hours and rules, without a server of Meduza's own.

## ADDED Requirements

### Requirement: Booking request fields
A request SHALL contain a name (2 to 80 characters), a phone number (8 to 15 digits), a date, a time, a guest count from 1 to the maximum (20 for now), an optional Instagram handle and optional special requests of up to 800 characters. There SHALL be no seating or area choice.

#### Scenario: Valid request
- **WHEN** a guest enters a name, a valid phone, a date, a time and 2 guests
- **THEN** the request is accepted

#### Scenario: Too many guests
- **WHEN** a guest asks for more than the maximum number of guests
- **THEN** the form shows "For larger groups, please contact the hostess."

#### Scenario: Instagram formats
- **WHEN** a guest types `@anna.nt` or pastes an instagram.com link
- **THEN** the handle `anna.nt` is used

### Requirement: Dates and times
The date picker SHALL offer the next 14 opening days starting from today's opening day. Times SHALL be every 30 minutes from 12:00 up to the last bookable time (23:30 by configuration), grouped Day (12:00–16:30), Evening (17:00–21:30) and Late. Slots less than 1.5 hours ahead SHALL be disabled, and a day with no remaining slots SHALL be disabled.

#### Scenario: Slots today
- **WHEN** it is 18:00 in Vietnam
- **THEN** today's slots before 19:30 are disabled and 19:30 is selectable

#### Scenario: Last time
- **WHEN** the last bookable time is 23:30
- **THEN** no slot after 23:30 is offered and the server rejects one

### Requirement: Opening day after midnight
Times from 00:00 to 02:00 SHALL belong to the previous opening day, and "today" SHALL mean the current opening day until 02:00.

#### Scenario: After midnight
- **WHEN** a guest books "Fri 20 Nov" at 01:00 where allowed
- **THEN** the table is for the night of Friday, which is 01:00 on Saturday

### Requirement: Server validation
The server SHALL re-check every rule (fields, hours, last time, 1.5 hours ahead, at most 60 days ahead) and return a coded error that the form shows in the guest's language.

#### Scenario: Slot taken by time
- **WHEN** a request arrives for a slot less than 1.5 hours ahead
- **THEN** the server rejects it and the guest sees "Tables can be booked from 1.5 hours ahead."

### Requirement: Delivery to the hostess
An accepted request SHALL be sent to the hostess's Telegram chat with the reference, the opening day and time (with an extra line giving the real calendar date for after-midnight times), guests, name, phone, Instagram link or a dash, notes and the guest's language. If delivery fails the guest SHALL see an error and no confirmation.

#### Scenario: After-midnight message
- **WHEN** a request is for 01:00 on the Friday opening day
- **THEN** the message includes "After midnight: Sat 21 Nov 01:00, still the Fri 20 Nov night."

#### Scenario: Telegram unavailable
- **WHEN** Telegram rejects the message
- **THEN** the guest sees "We could not reach the hostess" and no reference is shown

### Requirement: Reference number
Each accepted request SHALL receive a reference of the form `MDZ-` followed by four digits, shown to the guest and included in the hostess message.

#### Scenario: Reference
- **WHEN** a request is accepted
- **THEN** the confirmation shows a reference such as `MDZ-4821`

### Requirement: Abuse protection
A hidden form field SHALL silently discard bot submissions, returning a normal success without sending anything. Requests SHALL be limited to 8 per IP address and 3 per phone number in 10 minutes.

#### Scenario: Bot
- **WHEN** a submission has the hidden field filled
- **THEN** the response looks successful and nothing is sent to Telegram

#### Scenario: Too many requests
- **WHEN** the same phone number submits a fourth request within 10 minutes
- **THEN** the request is rejected with "Too many requests"

### Requirement: After the request
After success the guest SHALL land on the booking's ticket page (the Book tab), which shows date, time, guests, reference, the `[HOLD POLICY]` text, "Add to calendar" and "Make another booking", without any wording about the hostess confirming.

#### Scenario: Landing
- **WHEN** a request succeeds
- **THEN** the ticket opens with the details and the reference

### Requirement: Mobile first
Booking SHALL be designed for the phone first: a two-step flow with a sticky primary button in the thumb zone, 44 px controls and no keyboard before the details step; the one-page desktop layout is an enhancement from 900 px.

#### Scenario: Phone first
- **WHEN** a guest books at 390 px
- **THEN** the first step needs no typing, the primary button stays in the thumb zone, and the keyboard first appears on the details step
