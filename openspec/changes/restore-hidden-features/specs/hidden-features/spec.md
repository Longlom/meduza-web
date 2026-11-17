# Spec Delta

## Purpose

Keeps features that were hidden on purpose from being forgotten, and says when each may be shown again.

## ADDED Requirements

### Requirement: Hidden items are recorded
Every feature, text or placeholder hidden from guests because it needs a backend or owner content SHALL be listed in the register in `openspec/changes/restore-hidden-features/design.md` with the commit that hid it, its original wording where it had any, and the condition for showing it again.

#### Scenario: A new item is hidden
- **WHEN** a feature or text is hidden for lack of a backend or owner content
- **THEN** it is added to the register with its commit, original wording and restore condition

### Requirement: Hidden items stay restorable
A hidden button on an existing screen SHALL be switched by a named constant that defaults to `false` and keeps its code compiled. Removed code SHALL remain recoverable from a named git commit.

#### Scenario: Restore a flagged button
- **WHEN** a developer sets `SHOW_CHANGE`, `SHOW_CANCEL` or `SHOW_ANOTHER` to `true` in `components/booking/Ticket.tsx`
- **THEN** the matching ticket button appears and works as before

### Requirement: No promise of hostess confirmation without a backend
While bookings have no backend that records a hostess's answer, no screen, string or page description SHALL say or imply that a hostess will confirm a booking, and the ticket SHALL NOT show a Confirmed or Declined state.

#### Scenario: Ticket after booking
- **WHEN** a guest views a ticket for a request that was sent
- **THEN** it shows "Request sent" and no sentence about a hostess confirming

### Requirement: Owner placeholders are not shown raw
A placeholder marker in square brackets that stands for a policy or fact the owner has not supplied SHALL NOT be displayed to guests, except where `npm run placeholders` and the register explicitly list it as still visible.

#### Scenario: Hold policy not supplied
- **WHEN** the hold policy text is still `[HOLD POLICY]`
- **THEN** the ticket does not show it

### Requirement: Restoring uses its own change
Bringing back a hidden item SHALL be done in a separate OpenSpec change that modifies the spec of the capability the item belongs to, and SHALL tick the matching task group in this change.

#### Scenario: Owner supplies the dress code
- **WHEN** the owner confirms the dress code, payment and hookah rule
- **THEN** a change restores the "Good to know" tiles and group C3 is ticked here
