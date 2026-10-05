# ai-instructions

Shared rules, skills and decisions for the AI agents in all my projects.

> **Rules travel with the project. Skills travel with you. Decisions are written down.**

| What | Source | How it reaches the agent |
|---|---|---|
| Rules | `rules/` (layers) | a generated block in each project's `AGENTS.md`, read by Claude Code and other agents |
| Skills | `skills/` | uploaded to your Claude account: Claude app, Cowork, cloud sessions, Claude Code |
| App defaults | `app/claude-preferences.md` | pasted into your personal preferences in Claude |
| Secret guard | generated `.claude/settings.json` | Claude Code permission rules |
| Decisions | `decisions/` here, `docs/decisions/` in projects | read by people and agents |

The reasoning behind this split is in [`decisions/`](decisions/).

## Layout

```text
ai-instructions/
├── rules/                     always-on rules, one file per layer
│   ├── core.md
│   ├── stacks/react.md
│   └── design/osnova.md
├── skills/                    Agent Skills (spec frontmatter only)
│   ├── new-project/   new-component/   adr/
│   ├── staff-review/  retro/
│   └── theme-audit/   token-change/   logo-design/
├── decisions/                 ADRs for this repo
├── templates/                 AGENTS.md and CLAUDE.md for new projects
├── app/claude-preferences.md  defaults for every Claude chat
├── bin/ai-instructions.mjs    CLI: init, sync, sync --check, layers
└── scripts/                   self-check and smoke test (CI)
```

## One-time setup

1. Replace `OWNER` with your GitHub username. `npm run check` lists every place it appears.
2. Push to GitHub and tag the release: `git tag v0.1.0 && git push --tags`.
3. Paste `app/claude-preferences.md` into your personal preferences in Claude's settings.
4. Upload the skills: zip each folder under `skills/` and add it in the skills settings on claude.ai.
5. Read `decisions/` and flip each ADR to `Accepted`, or push back.

## Use in a project

```sh
npm i -D github:aleksandar381radosavljevic/ai-instructions#v0.2.0
npx ai-instructions init
```

`init` creates `.ai-instructions.json`, `AGENTS.md`, `CLAUDE.md` (which imports `AGENTS.md`) and `.claude/settings.json`. Commit all four, then fill in the "This project" section of `AGENTS.md`.

The default layers are `core`, `stacks/react` and `design/osnova`. To pick others, run `npx ai-instructions layers` and pass `--layers core,stacks/react`.

Keep projects honest in CI:

```yaml
- run: npx ai-instructions sync --check
```

To upgrade, bump the tag in `package.json`, run `npm install` and `npx ai-instructions sync`, and review the diff.

The CLI writes only three things: the block between the `ai-instructions` markers in `AGENTS.md`, a `CLAUDE.md` when none exists, and the `.env` deny rules in `.claude/settings.json`. Everything else in those files is yours.

## How it grows

At the end of a session that taught you something, run the `retro` skill. It sorts each lesson into project rules, shared rules, skills, decisions or tooling, and proposes the exact text. Nothing changes without your approval. The bar a shared rule has to clear is in [decision 0004](decisions/0004-every-rule-earns-its-place.md).

Versions follow semver: patch for wording, minor for a new rule, skill or layer, major for a removed or changed rule that changes agent behavior. Every release gets a `CHANGELOG.md` entry.

## Develop

`npm test` checks skills against the Agent Skills spec, the rules budget, ADR format and the changelog, then smoke-tests the CLI in throwaway projects. CI runs it on every push.

## Open questions

These change the rules or the skills, so they are yours to decide:

- **TypeScript or JavaScript** for the apps? For Osnova, decision 0017 proposes TypeScript.
- **How do projects consume Osnova**: npm package, git dependency or workspace? Until this is written down, `new-project` stops and asks.
- **Test runner and package manager**, for example Vitest and npm?
