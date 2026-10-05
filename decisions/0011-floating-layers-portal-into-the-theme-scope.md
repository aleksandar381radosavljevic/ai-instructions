# 0011. Render floating layers through a portal into the theme scope

- Status: Proposed
- Date: 2026-10-05

## Context
Menus, tooltips, color pickers and toasts must escape `overflow: hidden` and stacking contexts, yet still inherit the theme and project accent of the subtree they belong to. Portaling to `document.body` loses a scoped dark theme.

## Options
1. **Render in place with `position: absolute`**: inherits the theme, but gets clipped by any scrolling or overflow container.
2. **Portal to `document.body`**: never clipped, but loses scoped themes and accent overrides.
3. **Portal to the nearest `ThemeScope`** (via a portal-container context), falling back to `body`, with positioning in a headless hook (`useFloatingPosition`) and z-index tokens (`z-tooltip`, and so on).

## Decision
Option 3. Triggers are the consumer's own elements: Tooltip and DropdownMenu clone them to add `ref`, handlers and ARIA (`aria-describedby`, `aria-haspopup`, `aria-expanded`). ContextMenu and DropdownMenu share one internal `MenuList`.

## Why
Same approach as Radix and React Aria: never clipped, always themed, and the trigger stays a real, accessible element instead of a wrapper.

## Consequences
- A trigger must accept a `ref`; function components need `forwardRef`.
- The portal mounts after the first render, so positioning retries on the next animation frame.
- `useDismiss` and `useFloatingPosition` are exported for app-level popovers.
