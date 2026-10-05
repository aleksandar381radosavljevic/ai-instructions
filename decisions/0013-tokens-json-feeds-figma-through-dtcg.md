# 0013. Generate Figma variables from tokens.json in the DTCG format

- Status: Proposed
- Date: 2026-10-05

## Context
Designs in Figma and the code must use the same tokens. When either side is edited by hand, they drift within weeks.

## Options
1. **Figma as the source**, exported to code with a plugin: designers own tokens, but code depends on a plugin and on someone remembering to export.
2. **Maintain both by hand**: no tooling, guaranteed drift.
3. **`tokens.json` as the source**: a script generates `tokens.css` and W3C Design Tokens (DTCG 2025.10) files that Figma Variables and Tokens Studio import.

## Decision
Option 3. The script writes one file per collection and mode: primitives, semantic light and dark (as aliases to primitives), typography, and effects light and dark. Each token carries its CSS variable name in `$extensions`.

## Why
Code is where tokens are tested (contrast, states, themes), so it should be the source. DTCG is the open standard that Figma and token tools are converging on, so the export isn't tied to one plugin.

## Consequences
- Token changes go through `tokens.json` and the generators (`token-change` skill); Figma is re-imported after each release.
- Typography and shadows become styles, not variables, because Figma Variables don't accept composite values.
