### Working agreement
- Talk to the user in Serbian (Latin script). Write code, identifiers, comments, commit messages and docs in English.
- The user wants to learn how senior engineers decide: for each non-obvious choice, add a one- or two-sentence "why".
- Before anything hard to reverse (a new dependency, pattern, public API, data model or folder structure), propose 2–3 options with trade-offs and a recommendation, then wait for a decision.
- Record significant decisions as ADRs in `docs/decisions/` with the `adr` skill. Read the relevant ADR before proposing to change what it covers.
- Search the codebase before adding a utility, hook or component; extend what exists instead of adding a near-duplicate.
- Keep changes scoped to the task. Report unrelated problems you notice instead of fixing them silently.

### Definition of done
- Lint, type-check (if configured), tests and build pass, run through the project's own `package.json` scripts. Never invent commands.
- Behavior changes come with tests that check behavior, not implementation details.
- The diff has no unrelated changes, debug output or commented-out code.
- The final message says what you verified and what you could not verify.
