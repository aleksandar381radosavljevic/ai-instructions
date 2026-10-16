# 0014. Conventional Commits everywhere, release-please for what gets published

- Status: Accepted
- Date: 2026-10-16
- Amends: 0012

## Context
Every release of this repo so far meant a hand-written `CHANGELOG.md` entry, a version bump and a tag the owner created by hand after the merge; v0.3.0 to v0.6.0 each waited on that last step, and skill zips were never attached anywhere. Projects had no commit or release standard at all. Agents write most commit messages, so a format costs them nothing. As of October 2026, `googleapis/release-please-action` is at v5 (Node 24), with a `node` release type for `package.json` projects and a generic XML updater for other files, such as a `.csproj` version.

## Options
1. **Keep it manual, plus an Action that tags when the version changes**: no new rules, but the changelog and the bump still depend on someone remembering.
2. **Conventional Commits everywhere, release-please for published packages**: commit types decide the bump, release-please keeps an open release PR with the version, changelog and tag; merging it releases.
3. **Conventional Commits as a format only**, checked in CI: consistent history, releases stay manual.

## Decision
Option 2, chosen by the owner on 2026-10-16.

## Why
The format is free when agents write commits, and once commits carry intent, the version, changelog and tag no longer depend on memory. Apps that are never published only need the format.

## Consequences
- `core` requires Conventional Commits in every project; `fix:` is a patch, `feat:` a minor, `!` or `BREAKING CHANGE:` a major.
- This repo: `fix:` for rule wording, `feat:` for a new rule, skill or layer, `feat!:` for a removed or changed rule that changes agent behavior; `docs:`, `chore:`, `ci:` and `test:` don't release. Until 1.0.0 a breaking change bumps the minor (decision 0012).
- This repo runs release-please on every push to `main`; when a release PR merges, the workflow attaches the skill zips from `npm run pack-skills` to the GitHub release. Release PRs opened with `GITHUB_TOKEN` don't trigger the `check` workflow; `check` runs again on `main` after the merge.
- `npm test` checks commit messages on pull requests (`scripts/check-commits.mjs`, no dependencies).
- Published packages in other repos (Osnova next) add release-please with their own release type; a .NET package uses the `simple` type with the generic XML updater for its `.csproj`.
- Commits before PR #6's merge aren't conventional; release-please starts from that commit (`bootstrap-sha`).
