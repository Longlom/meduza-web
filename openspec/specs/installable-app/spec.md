# installable-app Specification

## Purpose
Lets guests install Meduza on their home screen and keep using the app shell when the connection drops.

## Requirements

### Requirement: Web app manifest
The site SHALL publish a manifest with the name "Meduza — Cocktails & Cuisine", short name "Meduza", standalone display, Abyss theme and background colours, and icons at 192 px, 512 px and a maskable 512 px.

#### Scenario: Manifest is valid
- **WHEN** the manifest is loaded in the browser's application tools
- **THEN** it parses without warnings and the app is reported as installable

### Requirement: Home-screen icon on iOS
Pages SHALL declare an Apple touch icon and the standalone-capable metadata so the iOS home-screen app opens without browser chrome.

#### Scenario: Add to Home Screen
- **WHEN** a guest adds the site to the iOS home screen
- **THEN** the jellyfish icon is used and the app opens full screen

### Requirement: Offline shell
Pages the guest has already visited and the app shell SHALL load from cache when offline. A page that was never visited SHALL show a branded offline page with a retry action.

#### Scenario: Offline revisit
- **WHEN** the guest is offline and opens the home page they visited earlier
- **THEN** the page loads from cache

#### Scenario: Offline new page
- **WHEN** the guest is offline and opens a page never visited
- **THEN** the offline page is shown with a "Try again" button

### Requirement: Booking needs a connection
Sending a booking SHALL never be queued silently. When offline, the guest SHALL see a clear connection error and keep everything they typed.

#### Scenario: Submit offline
- **WHEN** the guest submits the booking form while offline
- **THEN** a "No connection" message is shown and the form values are unchanged

### Requirement: API responses are never cached
The service worker SHALL NOT cache `/api/*` responses.

#### Scenario: API request
- **WHEN** the app calls `/api/booking`
- **THEN** the request always goes to the network

### Requirement: Safe updates
A new service worker version SHALL take over on the next launch without interrupting a page that is open.

#### Scenario: Update while open
- **WHEN** a new version is deployed while a guest has the app open
- **THEN** the open page keeps working and the new version is used on the next launch

### Requirement: Mobile first
Install and offline behaviour SHALL be designed for phones first: the installed app and the offline page SHALL be checked at 390 px in standalone mode before desktop.

#### Scenario: Phone first
- **WHEN** the app is installed on a phone and opened offline
- **THEN** the offline page is readable at 390 px and its action is a thumb-sized button
