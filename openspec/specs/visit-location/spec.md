# visit-location Specification

## Purpose
Shows guests where Meduza is and gets them there with the maps or ride app they already use.

## Requirements

### Requirement: Map area
The top of the Visit page SHALL show a map area with the address "157 Nguyễn Thiện Thuật, Nha Trang, Khánh Hòa". When a map embed is supplied it SHALL be shown in the dark style with one glowing pin. Until then the area SHALL show the address and an "Open in Maps" action in place of the map, with the `[MAP EMBED]` marker.

#### Scenario: Map not supplied
- **WHEN** the map embed is still a placeholder
- **THEN** the area shows the address, the `[MAP EMBED]` marker and a working "Open in Maps" link, and no empty frame

#### Scenario: Map supplied
- **WHEN** a map embed is configured
- **THEN** the area shows the map with the dark style and a single pin

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
