# React

Decisions 0008, 0010 and 0011 in ai-instructions. Rule layer: `stacks/react`.

1. Pick the scaffold:
   - **Frontend only** (talks to existing APIs, no secrets of its own): Vite's React TypeScript template.
   - **Needs its own server** (its own API, server-only secrets, server rendering for search engines): Next.js App Router. Record why in the project setup ADR.

   Scaffold with pnpm and TypeScript. If pnpm isn't installed, stop and ask; Node no longer bundles Corepack.
2. In `tsconfig.json`, turn on `strict` and `erasableSyntaxOnly`. Check the current TypeScript release notes for whether lint tooling still needs the 6.x API.
3. Add Vitest and Testing Library, with a `test` script and one passing test for the start screen. Add MSW to the Vitest setup file and Playwright Test with one smoke test that opens the start screen (decision 0015); check both setup guides for the current major.
4. Add Osnova (`@aleksandar381radosavljevic/osnova-react`) the way its README describes. If it isn't clear how projects consume Osnova, stop and ask. Never copy Osnova's source into the app.
5. Shared rules can be a devDependency here, so the lockfile pins the version:
   ```sh
   pnpm add -D github:aleksandar381radosavljevic/ai-instructions#<latest tag>
   pnpm exec ai-instructions init
   ```
   Expect `core`, `stacks/react` and `design/osnova`.
