# 0018. Write every project in TypeScript

- Status: Accepted
- Date: 2026-10-05
- Supersedes: 0017

## Context
Decision 0017 proposed TypeScript for Osnova only and left apps open. The user decided that every project, library or app, uses TypeScript.

## Options
1. **TypeScript in Osnova, free choice in apps** (0017): flexible, but rules, skills and examples must cover both languages, and an app loses checked props at the Osnova boundary.
2. **TypeScript everywhere, `strict: true`.**

## Decision
Option 2. Source files are `.ts` and `.tsx`; JavaScript only where a tool requires it (config files, small Node scripts). Comments and JSDoc are in English (decision 0005).

## Why
One language means one set of rules, templates and examples. Osnova's exported props interfaces are checked in every app that uses them, so a renamed prop or icon name fails in the editor, not in production.

## Consequences
- `new-project` scaffolds the Vite `react-ts` template; `new-component` creates `.tsx` files.
- `tsc --noEmit` is part of every project's definition of done.
- The open question about TypeScript in the README is closed.
