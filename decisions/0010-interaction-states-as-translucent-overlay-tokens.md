# 0010. Express neutral interaction states as translucent overlay tokens

- Status: Proposed
- Date: 2026-10-05

## Context
Hover and pressed states have to work on every surface (page, raised card, sunken well, overlay) in both themes. The first dark theme reused light-theme darkening, and hover became nearly invisible.

## Options
1. **A solid hover color per surface and theme**: exact, but the token count multiplies and a new surface needs new state tokens.
2. **`color-mix()` or filters in each component**: no new tokens, but every component invents its own amount and dark mode drifts.
3. **Translucent state tokens** (`surface-hover`, `surface-pressed`, plus `danger-hover` and `danger-pressed`), with ink at low alpha in light and light ink at low alpha in dark, layered over whatever surface is below.

## Decision
Option 3. Neutral states are painted as an overlay (a background image or pseudo-element) with these tokens. Accent and danger states use their own solid tokens.

## Why
One pair of tokens covers every surface, as Material's state layers do. The alpha is tuned once per theme and measured, instead of guessed per component.

## Consequences
- A state must be perceivable: when the tint alone changes the surface by less than about 1.15:1, add a border or outline change (text fields darken the border and add a 60% overlay).
- Text and placeholders are rechecked on the hover surface; placeholders must stay at 4.5:1 or above.
- The `theme-audit` skill measures these deltas.
