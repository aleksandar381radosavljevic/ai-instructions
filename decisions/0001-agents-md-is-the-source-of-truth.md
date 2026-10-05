# 0001. Make AGENTS.md the single source of project rules

- Status: Proposed
- Date: 2026-10-05

## Context
Rules have to reach more than one agent: Claude Code today, possibly Codex, Cursor or Copilot later. The earlier drafts put rules in several places at once (root `CLAUDE.md`, `.claude/CLAUDE.md`, `AGENTS.md`, `.github/copilot-instructions.md`), which guarantees drift.

Claude Code (v2.1.277+) reads `AGENTS.md` natively, but only when the project has no `CLAUDE.md`. When both exist it reads `CLAUDE.md` only, unless `CLAUDE.md` imports `AGENTS.md`.

## Options
1. **CLAUDE.md as the source**: best Claude support, invisible to other agents.
2. **One file per tool**: every tool fully served, rules duplicated and drifting.
3. **AGENTS.md as the source, CLAUDE.md as a one-line import**: every agent reads the same rules, and Claude-only notes still have a home.

## Decision
Option 3. Each project has an `AGENTS.md` (project rules plus the generated shared block) and a `CLAUDE.md` that starts with `@AGENTS.md`. Nested `AGENTS.md` files exist only where a folder has rules an agent can't infer, never as empty placeholders.

## Why
One file to review, one place to change. The import costs nothing: Claude Code never loads `AGENTS.md` twice, and the import keeps working on versions and session types that can't read `AGENTS.md` directly.

## Consequences
- A `CLAUDE.md` without the import silently hides `AGENTS.md` from Claude, so `sync --check` fails on it.
- No `copilot-instructions.md` or `.cursor/rules` until those tools are actually in use.
