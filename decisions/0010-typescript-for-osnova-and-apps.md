# 0010. TypeScript for Osnova and the apps

- Status: Accepted
- Date: 2026-10-16

## Context
`new-project` asked "TypeScript or JavaScript" on every new app because the shared rules didn't decide it, and Osnova had no stated language. Osnova is a library other apps consume, so its API (tokens, props, `Icon`) is exactly what types protect. As of October 2026, TypeScript 7 (the native compiler) type-checks roughly 8-12x faster than 6.x but ships without a stable programmatic API until 7.1, and Node.js runs `.ts` files with erasable syntax natively (type stripping is stable since v24.12 / v25.2).

## Options
1. **TypeScript everywhere, `strict` and `erasableSyntaxOnly`**: consumers get Osnova's types for free and agents get the compiler as fast feedback; costs a build step for Osnova.
2. **JavaScript with JSDoc, checked by `tsc --checkJs`**: no build step, but JSDoc is verbose and weaker for generics and React props, and Osnova still has to emit `.d.ts`.
3. **Plain JavaScript**: fewest tools, no types for Osnova's consumers or for agents.

## Decision
Option 1, chosen by the owner on 2026-10-16.

## Why
Types keep Osnova's public API honest across apps, and `tsc` is the cheapest signal an agent gets that a change is wrong. `erasableSyntaxOnly` keeps code runnable by Node's type stripping and rules out `enum` and other syntax that needs code generation.

## Consequences
- `new-project` no longer asks; apps start from the TypeScript template of Vite or Next.js.
- `stacks/react` requires `strict` and `erasableSyntaxOnly`: `as const` objects or union types instead of `enum`, `import type` for type-only imports.
- Lint tooling may need the 6.x API (`@typescript/typescript6`) until TypeScript 7.1; `new-project` checks the current recommendation instead of pinning a version.
- This repo stays plain `.mjs`: a small, dependency-free CLI gains nothing from a build step.
