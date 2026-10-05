# 0017. Write Osnova in TypeScript

- Status: Superseded by 0018
- Date: 2026-10-05

## Context
The README lists "TypeScript or JavaScript" as an open question. The first Osnova components were written in TypeScript (`.tsx`) with exported props interfaces and JSDoc, so this decision makes that explicit or reverses it.

## Options
1. **JavaScript with JSDoc types**: no build step for types, but weaker editor help and no checked public API.
2. **TypeScript with `strict: true`**: exported `Props` interfaces, generated `.d.ts`, and type errors in CI.

## Decision
Option 2 for Osnova. Apps may still choose JavaScript; they get types from the published `.d.ts` either way.

## Why
A shared library's API is used in every project, so it benefits most from checked types: renamed props, icon names and token-driven variants fail at compile time instead of in production.

## Consequences
- `tsc --noEmit` runs in CI with real `@types/react` and `lucide-react` types.
- Public props interfaces are exported and documented with JSDoc. The first components have Serbian JSDoc; it moves to English per decision 0005.
- The README's open question is answered for Osnova; for apps it stays open.
