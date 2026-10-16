# Changelog

Versions follow semver: patch for wording, minor for a new rule, skill or layer, major for a removed or changed rule that changes agent behavior.

## 0.4.0 (2026-10-16)

- `stacks/react`: TypeScript with `strict` and `erasableSyntaxOnly` (decision 0010); pnpm as the package manager and Vitest with Testing Library for tests (decision 0011).
- `new-project`: no longer asks TypeScript or JavaScript; scaffolds with pnpm and TypeScript and adds Vitest.
- README: projects install and run the CLI with pnpm.

## 0.3.0 (2026-10-16)

- Skill: `principal-designer`, an on-demand art director and product designer mode for redesigns (decision 0009).

## 0.2.0 (2026-10-06)

- `new-project`: Next.js App Router when the app needs its own server; Vite stays the default for frontend-only apps (decision 0008).

## 0.1.0 (2026-10-05)

- Rule layers: `core`, `stacks/react`, `design/osnova`.
- Skills: `new-project`, `new-component`, `adr`, `staff-review`, `retro`.
- CLI: `init`, `sync`, `sync --check`, `layers`.
- Decisions 0001–0005 (proposed).
