# 0016. Draw small logo sizes separately and keep logo colors fixed

- Status: Proposed
- Date: 2026-10-05

## Context
The Osnova mark is an arch that forms an A, with an orange crossbar, drawn on a 48-unit grid. Scaled below 48 px, its stems blur across pixels and the side dots turn into noise. Projects also have their own accent colors and could be tempted to recolor the mark.

## Options
1. **One SVG, scaled everywhere**: simplest, and blurry at favicon sizes.
2. **Separate pixel-aligned drawings at 32, 24 and 16 px**, without the dots, plus the master from 48 px up.

## Decision
Option 2. Colors are baked into each file: slate and orange, an inverse version for dark backgrounds, and a one-color version for print. The mark is never retinted with a project's accent. The wordmark is drawn to match the mark (stroke 6.2 on an x-height of 24, horizontals at 88%), with horizontal and vertical lockups.

## Why
This is how Apple and Google ship app icons: small sizes are drawn, not scaled. A fixed color keeps the brand recognizable across projects with different accents.

## Consequences
- The `logo-design` skill regenerates every variant from one script.
- Use the pixel versions below 48 px; keep clear space of one stem width on all sides.
