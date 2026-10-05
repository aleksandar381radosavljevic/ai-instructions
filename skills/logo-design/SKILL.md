---
name: logo-design
description: Design or refine a logo mark, wordmark and lockups that stay pixel-perfect at every size, and export a complete brand pack with SVG, PNG and favicons. Use when the user asks for a new logo, a logo redesign, an SVG version of a raster logo, or fixes to letterforms, weight or small-size rendering.
---

# Logo design

## 1. Brief
1. Ask what the brand should convey (for example trust, collaboration, premium) and which existing elements must survive (colors, shapes, letters).
2. Propose two or three directions, each with a one-line idea and where it could go wrong. Never copy an existing mark; check the result against well-known logos in the same field.

## 2. Master drawing
3. Draw on an integer grid (for example 48 × 48) with whole-number coordinates and a single stroke weight. Write the geometry as code (a script that emits SVG) so every size and variant is regenerated from one source.
4. Apply optical corrections: round shapes overshoot the baseline and cap height slightly; horizontal strokes are about 88–92% of vertical ones; joins are thinned so they don't look heavy.

## 3. Small sizes
5. Below the master size, draw separate pixel-aligned versions (for example 32, 24 and 16 px) instead of scaling: edges on whole pixels, fine details removed. Render each one at 1× and inspect it.

## 4. Wordmark and lockups
6. Draw the letters to match the mark's geometry. Balance the weight against the mark in the lockup (the wordmark stroke at roughly half the mark's stroke is a good start), kern by pairs, and fix outlier letters such as `s` (slightly thinner, narrower top bowl, no cusps in the counter).
7. Build horizontal and vertical lockups with a documented alignment and gap, plus a clear-space rule.

## 5. Export and document
8. Export: SVG for every variant (main, inverse, one-color, pixel sizes, wordmark, lockups), PNG at common sizes, and a favicon set (`.ico`, SVG, apple-touch, 192 and 512 px including maskable, web manifest, the `<head>` snippet).
9. Bake colors into the files; a logo isn't retinted with a project's accent color.
10. Write a short README: which file to use where, minimum sizes, clear space and what not to do.
