# Changelog

Versions follow semver: patch for wording, minor for a new rule, skill or layer, major for a removed or changed rule that changes agent behavior.

## [0.7.0](https://github.com/aleksandar381radosavljevic/ai-instructions/compare/v0.6.0...v0.7.0) (2026-10-17)


### Features

* require Conventional Commits and release with release-please ([117ae72](https://github.com/aleksandar381radosavljevic/ai-instructions/commit/117ae7275387e792b3b28e884c65f1715bc24ad2))
* require Conventional Commits and release with release-please ([378aa8b](https://github.com/aleksandar381radosavljevic/ai-instructions/commit/378aa8b73fe63ba2bbce27b3e4f6cc90c57f2855))

## 0.6.0 (2026-10-16)

- Skills keep stack-specific steps in `references/<stack>.md`, named after a rule layer (decision 0013). `new-project` and `new-component` moved their React steps into `references/react.md`; `new-project` asks for the stack and offers only stacks that have a reference.
- `npm run check`: the 100-line budget applies to each set of layers a project can load (core, one stack, one design system) instead of all layers together, and a reference without a matching stack layer fails.

## 0.5.0 (2026-10-16)

Breaking (decision 0012). After upgrading, run `ai-instructions sync` once in each project; `sync --check` fails until you do.

- `init` writes `core` plus the layers it detects in `package.json` (`stacks/react` for React or Next.js, `design/osnova` for an Osnova package) instead of always adding React and Osnova. `--layers` still overrides.
- `.ai-instructions.json` records the `version`. `sync` moves it to the running version and refuses to downgrade; `sync --check` fails when they differ. The CLI runs without installing (`pnpm dlx`, `npx`), so projects without `package.json` can use it.
- `core`: removed the Serbian-conversation and "explain the why" rules; they are personal and now live only in `personal/preferences.md` (was `app/claude-preferences.md`). "Never invent commands" no longer assumes `package.json` scripts.
- CLI: `ai-instructions personal` prints your preferences; `--install` writes them into `~/.claude/CLAUDE.md` between markers.
- `npm run pack-skills` builds `dist/skills/<name>.zip` for upload and stamps `metadata.version`.

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
