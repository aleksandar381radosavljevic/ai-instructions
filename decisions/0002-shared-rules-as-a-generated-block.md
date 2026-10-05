# 0002. Ship shared rules as a generated block inside each project's AGENTS.md

- Status: Proposed
- Date: 2026-10-05

## Context
The same rules must reach every project and stay identical as they evolve. The earlier draft proposed copying templates with a custom CLI and writing per-version migrations (2.4.0 → 2.5.0).

## Options
1. **Copy templates once**: simple, and every copy drifts the day after.
2. **Custom CLI with migrations**: handles drift, but you end up maintaining a package manager for Markdown.
3. **Import from `node_modules`** (`@node_modules/...`): no copies, but only Claude follows imports, and nothing works before `npm install` (fresh clones, cloud sessions).
4. **Generated block between markers**: the CLI owns only the text between `<!-- ai-instructions:begin -->` and `<!-- ai-instructions:end -->`; the rest of the file belongs to the project.

## Decision
Option 4. Rules live in layers (`rules/core.md`, `rules/stacks/<stack>.md`, `rules/design/<system>.md`), and each project picks its layers in `.ai-instructions.json`. `npx ai-instructions sync` regenerates the block, and the result is committed. The package is a devDependency installed from a git tag, so `package.json` and the lockfile pin the version.

## Why
Regenerating a block needs no migrations, because there is nothing to merge. Committed output means every agent and reviewer sees the exact rules in force, even before `npm install`, and rule changes show up in pull-request diffs.

## Consequences
- CI runs `npx ai-instructions sync --check`, which fails when the block is stale or was edited by hand (the same pattern as `prettier --check`).
- Upgrading a project means bumping the tag, running `sync` and reviewing the diff.
- Project-specific rules (state library, folder conventions) stay in the project section, never in shared layers.
- No `.claude/rules/` symlinks: they are Claude-only, and links outside the repo need an extra approval.
