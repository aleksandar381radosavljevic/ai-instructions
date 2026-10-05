# 0004. Every rule earns its place; enforce with tooling where possible

- Status: Proposed
- Date: 2026-10-05

## Context
Rules load into every session and cost context on every request. Claude Code's guidance is to keep an instruction file under about 200 lines, because longer files reduce adherence. Many rules in the earlier draft were defaults that agents already follow ("use functional components", "read this file", "don't expose secrets"), and they dilute the rules that matter.

## Options
1. **Write down every good practice**: feels thorough, costs context everywhere, and the important rules drown.
2. **Only rules backed by evidence, enforced by tooling where possible.**

## Decision
Option 2. A rule goes into a shared layer only if all three hold:
1. an agent got it wrong, or plausibly would;
2. it can't be inferred from the code;
3. tooling can't enforce it.

When tooling can enforce it (lint, types, tests, permissions), enforce it there instead of asking in prose. All layers together stay under 100 lines (`npm run check` fails above that), which leaves room for project rules within a 200-line `AGENTS.md`.

## Why
Short, sharp instructions are followed more consistently, and a linter or permission rule is followed every time.

## Consequences
- "Don't expose secrets" becomes `permissions.deny` rules for `.env` files in the generated `.claude/settings.json`, which Claude Code enforces for its file tools and common shell reads.
- Adding a rule over budget means removing or merging another; the `retro` skill applies this bar.
- Rules state the decision, not the tutorial. The "why" lives in ADRs.
