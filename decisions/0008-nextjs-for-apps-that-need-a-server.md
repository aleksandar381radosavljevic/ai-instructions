# 0008. Next.js for apps that need their own server

- Status: Accepted
- Date: 2026-10-06

## Context
`new-project` scaffolded every app with Vite and React. The first real project (administrativni-asistent) needs its own REST API, server-only secrets and server-rendered public pages, which a Vite SPA cannot provide without a second, separate backend. The owner clarified the intent on 2026-10-06: Vite + React is the standard for frontend apps; the general rules (core, React, design) apply to every project.

## Options
1. **Vite always, plus a separate backend when needed**: one frontend stack, but a second service, deploy and auth setup for every full-stack app.
2. **Vite for frontend-only apps, Next.js App Router when the app needs its own server.**
3. **Next.js always**: one stack, but server machinery for apps that don't need it.

## Decision
Option 2, chosen by the owner on 2026-10-06.

## Why
Each app gets the smallest stack that covers its needs. The rule layers don't change: `stacks/react` holds for both, and Next-specific conventions live in the project's own docs.

## Consequences
- `new-project` asks which case applies only when the description doesn't make it obvious.
- A Next.js project records the choice in its setup ADR.
- Osnova's React package must work in Next.js server component trees (it ships a `'use client'` banner).
