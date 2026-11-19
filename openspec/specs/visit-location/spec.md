# visit-location Specification

## Purpose
Shows guests where Meduza is and gets them there with the maps or ride app they already use.

## Requirements

### Requirement: Map area
The top of the Visit page SHALL show a map area with the address "157 Nguyễn Thiện Thuật, Nha Trang, Khánh Hòa" and an OpenStreetMap embed centred on the venue with a marker and the "© OpenStreetMap contributors" credit. The map SHALL be darkened in the dark theme.

#### Scenario: Map shown
- **WHEN** a guest opens the Visit page
- **THEN** the area shows the OpenStreetMap map with its credit and a marker

#### Scenario: Map embed unavailable
- **WHEN** the map embed is a placeholder
- **THEN** the area shows a pin, the `[MAP EMBED]` marker and a working "Open in Maps" link, and no empty frame

### Requirement: Map does not trap scrolling
The map SHALL NOT capture touch or mouse gestures, and a tap on it SHALL open the venue in Google Maps.

#### Scenario: Swipe over the map
- **WHEN** a guest swipes down starting on the map at 390 px
- **THEN** the page scrolls and the map does not move

### Requirement: Directions
A "Directions" action SHALL open the guest's maps app with the venue address as destination.

#### Scenario: Directions on a phone
- **WHEN** a guest taps Directions
- **THEN** a maps link with the venue address as destination opens

### Requirement: Layout on phone and desktop
On a phone the map area SHALL be full width at the top with the Directions action beneath it. On desktop the map and actions SHALL sit beside the hours and contacts in two columns.

#### Scenario: Desktop columns
- **WHEN** a guest opens `/en/visit` at 1280 px
- **THEN** the map column and the information column are side by side

### Requirement: Mobile first
The location area SHALL be designed for a phone first: the map and the Directions action SHALL be reachable by thumb at 390 px, and the desktop two-column layout is an enhancement from 900 px.

#### Scenario: Phone first
- **WHEN** a guest opens Visit at 390 px
- **THEN** the map is full width and both actions are at least 44 px tall beneath it
