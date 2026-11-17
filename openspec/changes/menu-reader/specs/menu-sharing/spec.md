# Spec Delta

## Purpose

Lets guests send a specific menu page to friends and makes every page link show a proper preview in messengers.

## ADDED Requirements

### Requirement: Share action
The Share button SHALL share the link to the current page (`?page=N`) with the device share sheet when available, and otherwise copy the link and confirm it with a short message.

#### Scenario: Share sheet available
- **WHEN** a guest on a phone taps Share on page 4 of Cocktails
- **THEN** the device share sheet opens with the title and the link ending in `/menu/cocktails?page=4`

#### Scenario: Copy fallback
- **WHEN** the browser has no share sheet and the guest taps Share
- **THEN** the link is copied and "Link copied" is shown for a few seconds

### Requirement: Per-page link preview
Each menu page URL SHALL provide its own title, description and 1200×630 preview image showing that page, for messengers and social networks.

#### Scenario: Preview of one page
- **WHEN** a messenger fetches `/en/menu/cocktails?page=4`
- **THEN** the Open Graph title names "The Siren Secret" and the image shows that page

#### Scenario: No page given
- **WHEN** a messenger fetches `/en/menu/dinner`
- **THEN** the preview shows the menu's first content page

### Requirement: Stable links
A `?page=N` link SHALL keep pointing at the same page. When a page is added or removed, the manifest SHALL record the change so old links can be handled.

#### Scenario: Printed link
- **WHEN** a guest scans a table card encoded as `/en/menu/dinner?page=4`
- **THEN** page 4, "Salads", opens

### Requirement: Mobile first
Sharing SHALL favour the phone: the device share sheet is the primary path, and the Share button SHALL be at least 44 px at 390 px.

#### Scenario: Phone first
- **WHEN** a guest taps Share on a phone
- **THEN** the device share sheet opens before any fallback is considered
