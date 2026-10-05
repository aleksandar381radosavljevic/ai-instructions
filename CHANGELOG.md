# Changelog

Versions follow semver: patch for wording, minor for a new rule, skill or layer, major for a removed or changed rule that changes agent behavior.

## 0.2.0 (2026-10-05)

- Skills: `theme-audit` (contrast, state deltas and a state matrix in light and dark), `token-change` (tokens.json as the single source for CSS and Figma), `logo-design` (pixel-perfect mark, wordmark, lockups and export pack).
- `new-component`: verify in light and dark with `theme-audit`; floating parts go through Osnova's portal and cloned triggers must accept a `ref`.
- `design/osnova` rules: only the six accent tokens are overridden per project; no theme branching in components; overlay tokens for hover and pressed; tokens edited only in `tokens.json`; floating UI through the portal; links through `LinkProvider`; logo size and color rules.
- Decisions 0008–0017 (proposed): token layers, themes, state overlay tokens, floating layers, router-agnostic links, Figma tokens, native elements first, icon imports, logo rules, TypeScript for Osnova.

## 0.1.0 (2026-10-05)

- Rule layers: `core`, `stacks/react`, `design/osnova`.
- Skills: `new-project`, `new-component`, `adr`, `staff-review`, `retro`.
- CLI: `init`, `sync`, `sync --check`, `layers`.
- Decisions 0001–0005 (proposed).
