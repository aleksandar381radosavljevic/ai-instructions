# 0003. Skills travel with the user; rules travel with the project

- Status: Proposed
- Date: 2026-10-05

## Context
Procedures (start a project, build a component, record a decision) are needed on every Claude surface the user works in: the Claude app, Cowork, and Claude Code locally and in the cloud. The earlier draft used `.claude/commands/` plus two subagents (`frontend`, `reviewer`) copied into each project.

## Options
1. **`.claude/commands/` and `.claude/agents/` copied per project**: Claude Code only, and commands are the legacy format (now merged into skills).
2. **A Claude Code plugin built from this repo**: central updates, but a plugin installed on one machine doesn't reach cloud sessions or the Claude app, and a plugin can't carry always-on rules (its `CLAUDE.md` isn't loaded).
3. **Agent Skills uploaded to the user's Claude account**: an open standard. Account skills load in the Claude app, Cowork, cloud sessions, and Claude Code when it is signed in with that account.

## Decision
Option 3. `skills/` is the source; each skill folder is zipped and uploaded to the Claude account. Frontmatter uses only the six fields of the Agent Skills spec, because claude.ai rejects any other key; `npm run check` enforces this.

No `frontend` subagent: the main agent already is the frontend engineer, and a subagent would only add a handoff. The one job that benefits from isolation, review, lives in the `staff-review` skill, which delegates to a fresh subagent when the environment can start one.

## Why
One upload reaches every surface the user actually uses, and the skills keep working with any agent that adopts the standard.

## Consequences
- Re-upload a skill after changing it; the `retro` skill reminds you.
- No Claude Code-only frontmatter (`disable-model-invocation`, `context: fork`). Descriptions say precisely when a skill applies instead.
- If a teammate or another agent joins a project, add a `sync` option that copies selected skills into the repo's `.claude/skills/`. Not before.
- The review skill is named `staff-review`, not `review`, because `/review` is an alias of Claude Code's bundled `/code-review`.
