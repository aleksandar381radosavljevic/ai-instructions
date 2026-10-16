# 0011. pnpm and Vitest for Osnova and the apps

- Status: Accepted
- Date: 2026-10-16

## Context
The shared rules named no package manager or test runner, so each new project would pick its own. As of October 2026, Vitest 5 shares Vite's config, is documented by Next.js, and needs Node 22.12+. pnpm 11 turns supply-chain protection on by default (new versions are held back for a day, exotic transitive dependencies are blocked, build scripts need `allowBuilds`) and keeps `node_modules` strict. npm ships with Node. Corepack is no longer bundled with Node since v25, so pnpm is installed separately.

The test runner was not really contested: Jest has no advantage in a Vite or Next.js project, and `bun test` would bring a second runtime. The choice was the package manager.

## Options
1. **npm + Vitest**: no extra tool and no command changes, but no default protection against freshly published (compromised) versions, and phantom dependencies are allowed.
2. **pnpm + Vitest**: supply-chain protection and a strict `node_modules` by default, faster installs; one more tool to install and different commands.
3. **Bun for both**: one fast tool, but a second runtime next to Node and weaker compatibility with Vite, Vitest's browser mode and Next.js.

## Decision
Option 2, chosen by the owner on 2026-10-16.

## Why
Protection against compromised packages is on by default instead of depending on someone remembering a flag. A strict `node_modules` stops a common agent mistake: importing a transitive package that isn't in `package.json`.

## Consequences
- `stacks/react` names pnpm, Vitest and Testing Library; agents never create `package-lock.json` or `yarn.lock`.
- `new-project` scaffolds with pnpm and adds Vitest and Testing Library; projects install this package with `pnpm add -D`.
- GitHub Packages auth for Osnova stays in `.npmrc`, which pnpm 11 still reads for registry and auth settings.
- This repo keeps npm for its own scripts: it has no dependencies, so there is nothing to protect or deduplicate.
