# 0007. Libraries ship their own agent rules

- Status: Proposed
- Date: 2026-10-05
- Amends: 0002

## Context
`rules/design/osnova.md` describes Osnova's API, such as the `Icon` component and how themes override tokens. Kept here, it lets a project run Osnova v2 with rules written for v1, and every Osnova API change needs a coordinated release in two repositories.

Next.js 16.2 solved the same problem: the `next` package ships version-matched docs as Markdown, and a marker-delimited section of the project's `AGENTS.md` points agents to them.

## Options
1. **Keep library rules here**: one place for all rules, but library and rule versions drift apart.
2. **The library ships its rules; projects point agents to them** (the Next.js pattern): always version-matched, but agents have to follow the pointer.
3. **The library ships its rules; `sync` inlines them**: version-matched and always in context.

## Decision
Option 3 for short rules, plus option 2 for long reference docs once they exist.
- A library declares its consumer rules in `package.json` (`"aiInstructions": "./ai/rules.md"`) and publishes the file with the package.
- A project lists the library in `.ai-instructions.json` (`"packages": ["@SCOPE/osnova-react"]`). `sync` inlines the rules from the installed version and names that version in the heading.
- Long docs, such as a component API reference, ship as Markdown in the package and are linked from the rules, not inlined.

## Why
Rules describe a specific version of an API, so they should be released with it. Inlined rules are always in context, which is more reliable than on-demand lookup (Vercel's Next.js evals found the same), and the committed block works before `npm install`.

## Consequences
- After a library upgrade, `sync --check` fails until `sync` runs, so CI catches stale rules.
- The file is `ai/rules.md`, not `AGENTS.md`, so agents working on Osnova itself don't load rules meant for its consumers.
- `rules/design/osnova.md` moves into Osnova once Osnova is published; until then it stays here.
- The CLI needs a `packages` option, covered by smoke tests.
