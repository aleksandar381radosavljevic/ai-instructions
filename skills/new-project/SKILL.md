---
name: new-project
description: Bootstrap a new web app the standard way, with React and TypeScript (Vite for frontend-only apps, Next.js when the app needs its own server), pnpm, Vitest, the Osnova design system with a project-specific theme, and the shared rules from ai-instructions. Use when the user starts a new project or asks to set one up "the usual way". Don't use it for changes to an existing project.
---

# New project

Goal: a running app that already follows the shared rules, so every later session starts from them instead of step-by-step prompting.

## 1. Ask once, all together
- Project name, and one sentence on what it does and for whom.
- Brand colors: at least a primary, accent optional. Ask for the logo if there is one.
- Anything that should differ from the standard stack.

Don't ask about anything the standard already decides.

## 2. Scaffold
1. Pick the scaffold:
   - **Frontend only** (talks to existing APIs, no secrets of its own): Vite's React TypeScript template.
   - **Needs its own server** (its own API, server-only secrets, server rendering for search engines): Next.js App Router. Record why in the project setup ADR (step 4).

   Scaffold with pnpm and TypeScript (decisions 0010 and 0011). Check the current create command in the framework's docs instead of relying on memory. If pnpm isn't installed, stop and ask; Node no longer bundles Corepack.
2. In `tsconfig.json`, turn on `strict` and `erasableSyntaxOnly`. Check the current TypeScript release notes for whether lint tooling still needs the 6.x API.
3. Add Vitest and Testing Library, with a `test` script and one passing test for the start screen.
4. Add Osnova the way its README describes. If it isn't clear how projects consume Osnova, stop and ask. Never copy Osnova's source into the app.
5. Add the shared rules:
   ```sh
   pnpm add -D github:aleksandar381radosavljevic/ai-instructions#<latest tag>
   pnpm exec ai-instructions init
   ```
   Run it after Osnova is installed: `init` adds `stacks/react` and `design/osnova` only when it finds them in `package.json`, so check the layers it reports. It writes `.ai-instructions.json`, `AGENTS.md` (with the shared-rules block), `CLAUDE.md` and `.claude/settings.json`. Commit all four.

## 3. Theme
- Create the project theme by overriding Osnova's tokens. Derive hover, active and subtle shades from the brand colors instead of inventing new hues.
- Check WCAG AA contrast for text on every surface and for focus indicators. If a brand color fails, propose the closest passing shade and explain why.
- Show the user one screen with a few Osnova components in the new theme before going further.

## 4. Project rules
- Fill in the "This project" section of `AGENTS.md`: purpose, where the theme lives, and nothing an agent can read from the code.
- Write `docs/decisions/0001-project-setup.md` with the `adr` skill: stack, theme choices, and anything that deviates from the standard.

## 5. Done when
- The `dev`, `lint`, `test` and `build` scripts run clean.
- `pnpm exec ai-instructions sync --check` passes.
- The user has seen and approved the themed screen.
