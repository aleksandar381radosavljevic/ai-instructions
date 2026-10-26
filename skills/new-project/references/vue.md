# Vue

Decision 0016 in ai-instructions. Rule layer: `stacks/vue`.

1. Pick the scaffold:
   - **Frontend only**: `create-vue` with TypeScript, Vue Router, Pinia, Vitest, Playwright and ESLint selected.
   - **Needs its own server** (its own API, server-only secrets, server rendering for search engines): Nuxt. Record why in the project setup ADR.

   Scaffold with pnpm. If pnpm isn't installed, stop and ask; Node no longer bundles Corepack. Check the current create command in the docs.
2. In `tsconfig.json`, turn on `strict` and `erasableSyntaxOnly`, and add a `typecheck` script that runs `vue-tsc --noEmit`.
3. Make sure Vitest runs with jsdom, add `@vue/test-utils`, MSW in the Vitest setup file, and one passing test for the start screen. Keep the Playwright smoke test that opens the start screen.
4. Add Reka UI and `@lucide/vue`. Add Osnova's tokens package the way the Osnova README describes; Osnova has no Vue components. If it isn't clear how projects consume the tokens, stop and ask.
5. Shared rules can be a devDependency here:
   ```sh
   pnpm add -D github:aleksandar381radosavljevic/ai-instructions#<latest tag>
   pnpm exec ai-instructions init
   ```
   Expect `core`, `stacks/vue` and `design/osnova`.
