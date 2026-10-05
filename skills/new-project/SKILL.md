---
name: new-project
description: Bootstrap a new web app the standard way, with Vite and React, the Osnova design system with a project-specific theme, and the shared rules from ai-instructions. Use when the user starts a new project or asks to set one up "the usual way". Don't use it for changes to an existing project.
---

# New project

Goal: a running app that already follows the shared rules, so every later session starts from them instead of step-by-step prompting.

## 1. Ask once, all together
- Project name, and one sentence on what it does and for whom.
- Brand colors: at least a primary, accent optional. Ask for the logo if there is one.
- Anything that should differ from the standard stack.

Don't ask about anything the standard already decides.

## 2. Scaffold
1. Create the app from Vite's React TypeScript template (`react-ts`), with `strict: true`. Check the current command in the Vite docs instead of relying on memory.
2. Add Osnova the way its README describes. If it isn't clear how projects consume Osnova, stop and ask. Never copy Osnova's source into the app.
3. Add the shared rules:
   ```sh
   npm i -D github:aleksandar381radosavljevic/ai-instructions#<latest tag>
   npx ai-instructions init
   ```
   `init` writes `.ai-instructions.json`, `AGENTS.md` (with the shared-rules block), `CLAUDE.md` and `.claude/settings.json`. Commit all four.

## 3. Theme
- Create the project theme by overriding Osnova's tokens. Derive hover, active and subtle shades from the brand colors instead of inventing new hues.
- Check WCAG AA contrast for text on every surface and for focus indicators. If a brand color fails, propose the closest passing shade and explain why.
- Show the user one screen with a few Osnova components in the new theme before going further.

## 4. Project rules
- Fill in the "This project" section of `AGENTS.md`: purpose, where the theme lives, and nothing an agent can read from the code.
- Write `docs/decisions/0001-project-setup.md` with the `adr` skill: stack, theme choices, and anything that deviates from the standard.

## 5. Done when
- The `dev`, `lint`, `test` and `build` scripts run clean.
- `npx ai-instructions sync --check` passes.
- The user has seen and approved the themed screen.
