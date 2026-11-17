# Spec Delta

## Purpose

Keeps one visual identity across screens: Abyss dark by default, Pearl for light blocks, and one leading accent (Glow or Lantern) per section.

## ADDED Requirements

### Requirement: Abyss by default
Pages SHALL use the Abyss theme with the Glow accent unless a section says otherwise.

#### Scenario: Default look
- **WHEN** any site page loads
- **THEN** the document uses the Abyss theme and primary actions use the Glow accent

### Requirement: Pearl blocks
A block MAY be rendered in the Pearl theme through a scoped wrapper, and the rest of the page SHALL stay Abyss. Text in a Pearl block SHALL keep a contrast ratio of at least 4.5:1.

#### Scenario: Pearl visit card
- **WHEN** a page renders a Pearl block
- **THEN** only that block uses Pearl colours and its text meets 4.5:1 contrast

### Requirement: Lantern mood for dining and brunch
Blocks about dining or brunch MAY switch the accent to Lantern. One accent SHALL lead each screen, so Glow and Lantern are never shown as equals side by side.

#### Scenario: Brunch card
- **WHEN** a brunch or dinner card is rendered
- **THEN** its accent elements use Lantern while the surrounding screen keeps one leading accent

### Requirement: Tokens only
App styles SHALL use design-system `--mz-*` tokens for colour, type size, radius and shadow, and SHALL NOT hardcode hex colours.

#### Scenario: Token check
- **WHEN** `npm run check:tokens` runs
- **THEN** it exits successfully only if no app stylesheet or component contains a hex colour, apart from the allow-listed browser and manifest colour fields

### Requirement: Reduced motion
Animations and transitions SHALL be disabled or minimal when the guest prefers reduced motion.

#### Scenario: Reduced motion preference
- **WHEN** the operating system requests reduced motion
- **THEN** pulses, slides and zoom transitions do not animate

### Requirement: Mobile first
Styles SHALL be written for 390 px first and extended for larger screens with `min-width` media queries only; layout SHALL NOT depend on `max-width` queries.

#### Scenario: Phone first
- **WHEN** the app stylesheet is searched for media queries
- **THEN** every layout media query is a `min-width` query and the page is complete at 390 px before any desktop rule applies
