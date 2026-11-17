# Spec Delta

## Purpose

Lets a guest see, use and manage their booking request after sending it, using only their own device until Meduza has a database.

## ADDED Requirements

### Requirement: Local booking record
After a request succeeds, the app SHALL store it on the guest's device only: reference, date, time, guests, name, phone, Instagram, notes and the time it was sent. A record SHALL stay active until the opening day it belongs to has ended and SHALL then be removed on the next visit. Nothing SHALL be stored on a server for this.

#### Scenario: Stored on send
- **WHEN** a request succeeds
- **THEN** a record with the reference and details exists on the device

#### Scenario: Expired record
- **WHEN** the guest opens the app after the booking's opening day ended
- **THEN** the record is removed and the Book tab shows the booking form

### Requirement: Ticket page
`/{locale}/booking/[ref]` SHALL show a ticket with the area photo, a status badge, the date and time in large type, the guest count and the reference. A pending booking SHALL show the badge "Request sent" with a slow pulse. The page SHALL include the tab bar and a timeline: Request sent (with the time sent), Arrive. Until bookings have a backend, nothing on the ticket SHALL mention the hostess confirming.

#### Scenario: Pending ticket
- **WHEN** a guest opens the ticket for a booking sent at 18:02
- **THEN** the ticket shows "Request sent", the timeline shows "Request sent 18:02" and Arrive pending

#### Scenario: Reduced motion
- **WHEN** the guest prefers reduced motion
- **THEN** the status badge does not pulse

### Requirement: Honest status
Until bookings have a database, the ticket SHALL only show Request sent, Cancelled or Changed, and SHALL NOT claim Confirmed or Declined or describe a confirmation step.

#### Scenario: No false confirmation
- **WHEN** the hostess confirms in Telegram
- **THEN** the ticket still shows "Request sent" and never shows "Confirmed"

### Requirement: Unknown booking on this device
If no record matches the reference on this device, the page SHALL say it cannot find the booking here and offer "Make a new booking" and "Message us".

#### Scenario: Link opened on another phone
- **WHEN** a guest opens `/en/booking/MDZ-4821` on a device without that record
- **THEN** the page explains the booking is not on this device and shows the two actions

### Requirement: Book tab shows the active booking
While a record is active, the Book tab SHALL open that booking's ticket; otherwise it SHALL open the booking form. After a successful request the guest SHALL land on that booking's ticket; there is no separate confirmation screen.

#### Scenario: Active booking
- **WHEN** a guest with an active booking taps the Book tab
- **THEN** the ticket opens

#### Scenario: No booking
- **WHEN** a guest without an active booking taps the Book tab
- **THEN** the booking form opens

### Requirement: Ticket actions
The ticket SHALL offer Directions, Message us, Add to calendar, Change and Cancel booking. Message us SHALL be a link only when the Telegram handle is confirmed. Add to calendar SHALL download an event for the booking time in Vietnam time.

#### Scenario: Add to calendar
- **WHEN** a guest taps Add to calendar for 20:30
- **THEN** a calendar file downloads with the event at 20:30 Vietnam time and the reference in its title

#### Scenario: Message placeholder
- **WHEN** the Telegram handle is a placeholder
- **THEN** "Message us" shows plain text and is not a link

### Requirement: Mobile first
The ticket SHALL be designed for a phone first, readable at arm's length at the table, with actions of at least 44 px; the desktop layout is an enhancement from 900 px.

#### Scenario: Phone first
- **WHEN** a guest opens the ticket at 390 px
- **THEN** the date, time and reference are large, and Directions, Add to calendar, Change and Cancel are thumb-sized and reachable
