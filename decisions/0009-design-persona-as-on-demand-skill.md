# 0009. Design persona lives in an on-demand skill

- Status: Proposed
- Date: 2026-10-16

## Context
The owner wants a "Principal Product Designer & Senior Art Director" mode to switch on during design work. The instructions are about 70 lines and only matter for redesign and visual polish. Always-on rules share a 100-line budget (decision 0004) and are already in use.

## Options
1. **A rule layer** (`rules/design/`): loaded in every session of every project; would consume most of the budget for something needed occasionally.
2. **A claude.ai Project or personal preferences**: no version history, doesn't reach Claude Code, always on within its scope.
3. **A skill** (`skills/principal-designer/`): loaded only when asked for, versioned here, reaches every surface through the account upload (decision 0003).

## Decision
Option 3.

## Why
It costs nothing from the rules budget, is invoked explicitly ("be the principal designer", `/principal-designer`), and follows the same path as every other skill.

## Consequences
- The skill defers to `AGENTS.md`, project ADRs and the Osnova layer: system fonts only, appearance through theme tokens, missing pieces go to `new-component`.
- Direction-setting calls (concept, type scale, palette) come with 2-3 options; smaller calls the skill makes on its own.
- After changing the skill, re-upload it to the Claude account.
