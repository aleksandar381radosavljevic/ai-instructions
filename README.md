# ai-instructions

Shared rules, skills and decisions for the AI agents in all my projects.

> **Rules travel with the project. Skills travel with you. Decisions are written down.**

| What | Source | How it reaches the agent |
|---|---|---|
| Rules | `rules/` (layers) | a generated block in each project's `AGENTS.md`, read by Claude Code and other agents |
| Skills | `skills/` | zipped by `npm run pack-skills` and uploaded to your Claude account: Claude app, Cowork, cloud sessions, Claude Code |
| Personal preferences | `personal/preferences.md` | pasted into your preferences in Claude, and installed into `~/.claude/CLAUDE.md` for local Claude Code |
| Secret guard | generated `.claude/settings.json` | Claude Code permission rules |
| Decisions | `decisions/` here, `docs/decisions/` in projects | read by people and agents |

Rules describe the project, whoever works on it. Preferences describe you, in any project or chat. The reasoning behind this split is in [`decisions/`](decisions/), most recently [0012](decisions/0012-stack-agnostic-consumption.md).

## Layout

```text
ai-instructions/
├── rules/                     always-on project rules, one file per layer
│   ├── core.md                every project, any language
│   ├── stacks/react.md        React, Vite or Next.js
│   └── design/osnova.md       projects that use Osnova
├── personal/preferences.md    how you like to work; the only copy
├── skills/                    Agent Skills (spec frontmatter only)
│   └── <name>/references/     stack-specific steps, one file per stack layer
├── decisions/                 ADRs for this repo
├── templates/                 AGENTS.md and CLAUDE.md for new projects
├── bin/ai-instructions.mjs    CLI: init, sync, sync --check, layers, personal
└── scripts/                   self-check, smoke test (CI) and pack-skills
```

## Use in a project

Any repository works, with or without `package.json`. The CLI needs Node 18+ on the machine.

```sh
# Any repository: run it without installing
pnpm dlx github:aleksandar381radosavljevic/ai-instructions#v0.6.0 init

# Node projects can pin it as a devDependency instead
pnpm add -D github:aleksandar381radosavljevic/ai-instructions#v0.6.0
pnpm exec ai-instructions init
```

`init` creates `.ai-instructions.json`, `AGENTS.md`, `CLAUDE.md` (which imports `AGENTS.md`) and `.claude/settings.json`. Commit all four, then fill in the "This project" section of `AGENTS.md`.

Layers start from `core`. `init` adds `stacks/react` when `react`, `react-dom` or `next` is in `package.json`, and `design/osnova` when an Osnova package is. To choose yourself, run `ai-instructions layers` and pass `--layers core,stacks/react`.

`.ai-instructions.json` records the version the rules came from. Keep projects honest in CI:

```yaml
# devDependency
- run: pnpm exec ai-instructions sync --check
# without installing: run the pinned version
- run: pnpm dlx "github:aleksandar381radosavljevic/ai-instructions#v$(node -p "require('./.ai-instructions.json').version")" sync --check
```

To upgrade, run `sync` with the newer version (bump the tag in `package.json` first if it is a devDependency) and review the diff. `sync` refuses to go back to an older version.

In a project, the CLI writes only: the block between the `ai-instructions` markers in `AGENTS.md`, the version in `.ai-instructions.json`, a `CLAUDE.md` when none exists, and the `.env` deny rules in `.claude/settings.json`. Everything else in those files is yours.

## Stacks and roles

Supported stacks are the layers under `rules/stacks/`: today React. Vue and .NET Web API come next, each starting with a stack ADR that decides libraries, styling, architecture and folder layout once for every project on it.

Skills are grouped by role. A skill holds the procedure; where a step differs by stack, it reads `references/<stack>.md` for the project's stack (decision 0013).

| Role | Skills |
|---|---|
| Developer | `new-project`, `staff-review` |
| Designer | `principal-designer`, `new-component` |
| Tester | coming next |
| Everyone | `adr`, `retro` |

## Personal preferences and skills

After changing `personal/preferences.md`:
- paste it into your personal preferences in Claude's settings (`ai-instructions personal` prints it);
- run `ai-instructions personal --install` to update the block in `~/.claude/CLAUDE.md`.

After changing a skill, run `npm run pack-skills` (or `npm run pack-skills -- retro adr`) and upload the zips from `dist/skills/` in the skills settings on claude.ai. Each uploaded `SKILL.md` carries `metadata.version`, so you can tell which release is on your account.

## How it grows

At the end of a session that taught you something, run the `retro` skill. It sorts each lesson into project rules, shared rules, skills, decisions or tooling, and proposes the exact text. Nothing changes without your approval. The bar a shared rule has to clear is in [decision 0004](decisions/0004-every-rule-earns-its-place.md).

Commits follow Conventional Commits, and the type sets the version (decision 0014): `fix:` for rule wording, `feat:` for a new rule, skill or layer, `feat!:` for a removed or changed rule that changes agent behavior. `docs:`, `chore:`, `ci:` and `test:` don't release. Until 1.0.0, a breaking change bumps the minor version (decision 0012).

release-please keeps a release PR open on `main` with the next version and its `CHANGELOG.md` entry. Merging it tags `vX.Y.Z`, creates the GitHub release and attaches the skill zips, so upload them from the release page. Release PRs don't run the `check` workflow on their own; it runs on `main` after the merge.

## Develop

`npm test` checks skills against the Agent Skills spec, the rules budget, ADR format and the changelog, then smoke-tests the CLI in throwaway projects. CI runs it on every push, and on pull requests also checks commit messages with `scripts/check-commits.mjs`.

## Open questions

These change the rules or the skills, so they are yours to decide:

- ~~**TypeScript or JavaScript**~~: decided 2026-10-16, TypeScript with `strict` and `erasableSyntaxOnly`; see [decision 0010](decisions/0010-typescript-for-osnova-and-apps.md).
- ~~**How do projects consume Osnova**~~: decided 2026-10-06, a package on GitHub Packages (`@aleksandar381radosavljevic/osnova-react`); see the [design-system README](https://github.com/aleksandar381radosavljevic/design-system).
- ~~**Test runner and package manager**~~: decided 2026-10-16, Vitest and pnpm; see [decision 0011](decisions/0011-pnpm-and-vitest.md).
- **Accept or challenge decisions 0001–0007 and 0009**: they are still `Proposed`, while the CLI is built on them. Accepting them is the step to 1.0.0.
