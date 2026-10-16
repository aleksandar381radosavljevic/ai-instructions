# 0012. Make ai-instructions usable in any repository

- Status: Accepted
- Date: 2026-10-16
- Amends: 0002, 0003

## Context
The goal is one set of rules for every new project, but v0.4.0 assumed a Node project with React and Osnova. `init` defaulted to `core`, `stacks/react` and `design/osnova`, so a backend, CLI or Python repository silently got rules about CSS Modules and Osnova icons. Installation required `package.json`, although the CLI itself never reads it beyond the project name. Personal preferences (talk in Serbian, explain the why) were part of `core` and got committed into every project, while two more copies of them (`app/claude-preferences.md` and the text pasted into Claude) had already drifted apart. Skills were zipped by hand, with no way to tell which version was uploaded.

## Options
1. **Keep the Node-and-React contract**, fix only the wording: no work, but "any project" stays untrue and the wrong default keeps leaking into non-React projects.
2. **A stack-agnostic contract**: `init` defaults to `core` and adds layers it detects; the CLI also runs without installing, with the version pinned in `.ai-instructions.json`; personal rules get one source; skills are packed by a script that stamps the version.
3. **No CLI**: projects import rules from a URL, or a GitHub Action writes the block. Nothing to maintain, but imports only work in Claude and need the network, and the committed block (decision 0002) is lost.

## Decision
Option 2, chosen by the owner on 2026-10-16.

## Why
It keeps what works (the committed block, `sync --check`, the rules budget) and removes the two assumptions that make the repo unusable outside JavaScript UI work. A wrong default is worse than none, because nobody notices it.

## Consequences
- `init` writes `core` plus detected layers: `stacks/react` when `react`, `react-dom` or `next` is a dependency, `design/osnova` when an Osnova package is. `--layers` still overrides.
- `.ai-instructions.json` records `version`. `sync` moves it to the running version (the upgrade step) and refuses to downgrade; `sync --check` fails when they differ. Node projects may keep the devDependency; others run `pnpm dlx` or `npx` with the pinned tag.
- Personal rules live only in `personal/preferences.md`. It is pasted into Claude's preferences and installed into `~/.claude/CLAUDE.md` with `ai-instructions personal --install`. `core` keeps only what holds for a project whoever works on it.
- `npm run pack-skills` builds `dist/skills/<name>.zip` and stamps `metadata.version` with the package version, so the uploaded copy says which release it came from.
- Removing personal rules from `core` changes agent behavior in projects. This is a breaking change, released as 0.5.0 under semver's 0.x convention; 1.0.0 waits until decisions 0001–0007 and 0009 are accepted.
