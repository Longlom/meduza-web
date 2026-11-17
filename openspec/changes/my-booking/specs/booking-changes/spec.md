# Spec Delta

## Purpose

Lets a guest ask the hostess to change or cancel a booking without a database, treating them as requests the hostess verifies.

## ADDED Requirements

### Requirement: Cancel request
"Cancel booking" SHALL ask for confirmation in a destructive-styled dialog that shows the date and time (the deposit and cancellation policy is hidden until the owner supplies it). Confirming SHALL send a cancellation request to the hostess in Telegram with the reference and details, mark the local record Cancelled, and show "Cancellation request sent."

#### Scenario: Confirmed cancel
- **WHEN** a guest confirms the cancellation
- **THEN** a message "Cancellation requested · MDZ-4821" with the booking details reaches the hostess and the ticket shows Cancelled

#### Scenario: Cancel fails
- **WHEN** the request cannot be delivered
- **THEN** the booking stays active and the guest sees an error with the option to try again

### Requirement: Change request
"Change" SHALL open the booking form pre-filled with the record's values. Submitting SHALL send a new request marked as a change of the old reference, create a new reference and record, and mark the old record Changed with a link to the new ticket.

#### Scenario: Change time
- **WHEN** a guest changes 20:30 to 21:00 and submits
- **THEN** the hostess receives "Change request — replaces MDZ-4821" with the new details and the new reference, and the old ticket shows Changed

#### Scenario: Normal rules apply
- **WHEN** a guest changes to a time less than 1.5 hours ahead
- **THEN** the form rejects it like any other request

### Requirement: Requests are verified by the hostess
Change and cancel requests SHALL be treated as requests for the hostess to verify, not as proof that a booking exists. The guest wording SHALL say only that the request was sent, and SHALL NOT promise a confirmation.

#### Scenario: Wording
- **WHEN** a cancellation is sent
- **THEN** the guest sees "Cancellation request sent." and no promise of a confirmation

### Requirement: Same protections
Change and cancel requests SHALL use the same validation, hidden-field check and rate limits as new bookings.

#### Scenario: Flood of cancels
- **WHEN** one IP address sends more than 8 requests in 10 minutes
- **THEN** further requests are rejected with "Too many requests"

### Requirement: Not after the booking time
Change and Cancel SHALL NOT be offered once the booked time has passed.

#### Scenario: Past booking
- **WHEN** the booked time has passed but the opening day has not ended
- **THEN** the ticket shows Directions, Message us and Add to calendar only

### Requirement: Mobile first
Change and cancel SHALL be designed for the phone first: the confirmation SHALL be a bottom sheet or full-width dialog with thumb-sized buttons at 390 px, and the destructive action SHALL be clearly separated from the safe one.

#### Scenario: Phone first
- **WHEN** a guest taps Cancel booking at 390 px
- **THEN** the confirmation fills the width, the destructive button is clearly separate from "Keep my booking", and both are at least 44 px tall
