# 0008. Use three token layers, with a six-token accent layer per project

- Status: Proposed
- Date: 2026-10-05

## Context
Osnova is reused by every project, and each project needs its own brand color without forking components. Components therefore can't reference raw colors, and projects need a small, safe surface to override.

## Options
1. **One flat token set**, overridden freely per project: simple, but a project can break contrast or states anywhere, and nobody knows which tokens are safe to change.
2. **Per-project component variants or CSS overrides**: full control, and every Osnova upgrade breaks them.
3. **Three layers**: primitives (`orange-500`, `slate-800`) → semantic roles with a value per theme (`surface-raised`, `ink-muted`) → a project accent layer of six tokens (`accent`, `accent-hover`, `accent-pressed`, `accent-soft`, `accent-ink`, `on-accent`).

## Decision
Option 3. Components use only semantic and accent tokens. A project overrides the six accent tokens in its theme file, for each theme it supports; anything more needs a project ADR.

## Why
The same structure as Material 3 and Polaris: a brand change touches six values, and the neutral system (text, surfaces, borders, states) keeps its tested contrast. `tokens.json` stays the single source for CSS and Figma (decision 0013).

## Consequences
- A project theme is checked with the `theme-audit` skill; an accent that fails contrast is replaced by the nearest passing shade.
- Neutral colors are shared by all projects. If a project needs different neutrals, that is a new decision, not an override.
