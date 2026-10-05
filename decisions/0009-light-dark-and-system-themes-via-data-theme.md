# 0009. Switch themes with data-theme and color-scheme, including a system mode

- Status: Proposed
- Date: 2026-10-05

## Context
Every Osnova component must work in light and dark. Users expect apps to follow the operating system, some apps need a manual toggle, and parts of a page (a preview, an inverted panel) may need a different theme from the rest.

## Options
1. **`prefers-color-scheme` media queries only**: no JavaScript, but no manual toggle and no scoped themes.
2. **A theme class or React context consumed by components**: flexible, but components branch on the theme and re-render on every switch.
3. **`data-theme` plus `color-scheme` on any element**: tokens are redefined under `[data-theme="dark"]`; `ThemeScope` sets both attributes on a subtree; `applyTheme('light' | 'dark' | 'system')` sets them on `<html>`, and `system` follows the OS.

## Decision
Option 3, with a `prefers-color-scheme` fallback for `:root` without `data-theme` and a small inline script in `<head>` that sets the theme before first paint.

## Why
A theme switch changes CSS variables only, so nothing re-renders. `color-scheme` makes native parts (scrollbars, form controls, `<dialog>`) match. Scoping works on any subtree, which is how GitHub Primer handles nested themes.

## Consequences
- Components never branch on the theme in code or CSS; dark values live in tokens only.
- `ThemeScope` is also the container for portaled layers (decision 0011).
- Dark elevation uses lighter surfaces and a subtle rim, because shadows barely show on dark backgrounds.
