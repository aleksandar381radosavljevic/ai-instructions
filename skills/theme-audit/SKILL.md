---
name: theme-audit
description: Audit UI components or design tokens in light, dark and system themes by measuring contrast and state deltas and rendering a state matrix with forced pseudo-states. Use after changing tokens, interaction states or a component's styles, when the user asks whether components are ready for dark mode, or before releasing a design-system change.
---

# Theme audit

Numbers first, screenshots second: a screen that looks fine on one monitor can fail on another, while a contrast ratio is the same everywhere.

## Steps
1. **Scope.** List the components and tokens touched by the change, plus every component that shares their CSS (for example one control style used by text field, select and combobox).
2. **Resolve tokens per theme.** For each theme, resolve aliases to final colors. Composite translucent tokens over the surface they sit on before measuring.
3. **Measure contrast** (WCAG 2.x) in every theme:
   - text and placeholders on each surface they appear on: at least 4.5:1;
   - borders of controls, focus rings and meaningful icons: at least 3:1;
   - the accent and on-accent pair under at least two project themes.
4. **Measure state deltas.** Compare default with hover, pressed and selected for each surface. A state must be perceivable: if the surface tint alone changes less than about 1.15:1, the state also needs a border or outline change. Recheck text contrast on the hover and pressed surfaces.
5. **Render a state matrix** for each component: rows are variants and sizes, columns are default, hover, active, focus-visible, disabled, invalid and loading. Force pseudo-states by copying rules (`:hover` becomes `.ps-hover`) instead of simulating the mouse. Screenshot it in light and dark.
6. **Check theme plumbing.** The theme scope sets both `data-theme` and `color-scheme`; portaled layers (menus, tooltips, toasts, dialogs) render inside the scope; elevation in dark comes from lighter surfaces and a subtle rim, not darker shadows alone.
7. **Report.** A table of item, theme, measured value, threshold and pass or fail, then concrete fixes for each failure. Fix tokens before touching components.
