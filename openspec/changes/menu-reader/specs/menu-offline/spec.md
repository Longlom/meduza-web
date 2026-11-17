# Spec Delta

## Purpose

Keeps the menu readable at the table when the phone has a weak or no connection.

## ADDED Requirements

### Requirement: Viewed pages are cached
Every menu page image a guest views SHALL be stored for later offline reading.

#### Scenario: Revisit offline
- **WHEN** a guest viewed Dinner page 5 earlier and is now offline
- **THEN** page 5 still opens with its image

### Requirement: Prefetch the current menu
While the guest reads, the app SHALL fetch the remaining pages of the current menu in the background when the connection allows. It SHALL NOT prefetch when the device asks to save data or the connection is very slow.

#### Scenario: Good connection
- **WHEN** a guest opens Cocktails on a normal connection
- **THEN** the other cocktail pages are fetched in the background after the first page is shown

#### Scenario: Data saver
- **WHEN** the device has data saving enabled
- **THEN** only pages the guest actually views are fetched

### Requirement: Offline gaps are explained
When a page is not cached and the device is offline, the reader SHALL show a message in the page area with a retry action, and the controls SHALL stay usable.

#### Scenario: Uncached page
- **WHEN** a guest offline turns to a page never loaded
- **THEN** a "Page not available offline" message with "Try again" is shown in place of the image

### Requirement: Cache is bounded and versioned
Cached images SHALL be versioned by content so new menus replace old pages, and old versions SHALL be removed.

#### Scenario: Menu updated
- **WHEN** a new version of a menu page is deployed
- **THEN** the next visit shows the new image and the old one is removed from the cache

### Requirement: Mobile first
Offline behaviour SHALL be designed for a weak phone connection first, and verified on a throttled slow 4G profile before faster connections.

#### Scenario: Phone first
- **WHEN** the menu is opened on a throttled slow 4G connection
- **THEN** the first page appears without waiting for the remaining pages, which load in the background
