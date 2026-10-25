---
name: new-project
description: Bootstrap a new app the standard way, on one of the supported stacks (see references/), with the shared rules from ai-instructions and, for UI apps, the Osnova design system with a project-specific theme. Use when the user starts a new project or asks to set one up "the usual way". Don't use it for changes to an existing project.
---

# New project

Goal: a running app that already follows the shared rules, so every later session starts from them instead of step-by-step prompting.

## 1. Ask once, all together
- Project name, and one sentence on what it does and for whom.
- The stack: frontend or backend, then one of the stacks that has a file in `references/` (today: [React](references/react.md) and [Vue](references/vue.md)). If the user wants a stack without a reference, say it isn't supported yet and stop; supporting it starts with a stack ADR in ai-instructions.
- For a UI app: brand colors (at least a primary, accent optional) and the logo if there is one.
- Anything that should differ from the standard stack.

Don't ask about anything the stack already decides: libraries, styling, architecture and folder layout come from its reference and its rule layer.

## 2. Scaffold
Follow the stack's reference file step by step. Check current create commands and versions in the official docs instead of relying on memory.

## 3. Add the shared rules
Run `init` after the stack's dependencies are installed, so it detects the right layers, and check the layers it reports:

```sh
pnpm dlx github:aleksandar381radosavljevic/ai-instructions#<latest tag> init
```

Node projects may install it as a devDependency instead, as the reference says. `init` writes `.ai-instructions.json`, `AGENTS.md` (with the shared-rules block), `CLAUDE.md` and `.claude/settings.json`. Commit all four.

## 4. Theme (UI apps on Osnova)
- Create the project theme by overriding Osnova's tokens. Derive hover, active and subtle shades from the brand colors instead of inventing new hues.
- Check WCAG AA contrast for text on every surface and for focus indicators. If a brand color fails, propose the closest passing shade and explain why.
- Show the user one screen with a few components in the new theme before going further.

## 5. Project rules
- Fill in the "This project" section of `AGENTS.md`: purpose, where the theme lives, and nothing an agent can read from the code.
- Write `docs/decisions/0001-project-setup.md` with the `adr` skill: stack, theme choices, and anything that deviates from the standard.

## 6. Done when
- The project's own dev, lint, test and build commands run clean.
- `ai-instructions sync --check` passes.
- For a UI app, the user has seen and approved the themed screen.
