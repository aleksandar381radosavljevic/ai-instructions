---
name: adr
description: Record an architecture or design decision as a short ADR with context, options, decision and consequences. Use when a significant technical or design decision is made, reversed or superseded, or when the user asks to document a decision.
---

# Architecture Decision Record

## Where it goes
- Affects one project: `docs/decisions/` in that project.
- Affects every project (a rule, a convention, an Osnova-wide choice): `decisions/` in the ai-instructions repo, usually together with a rule change. Propose it with the `retro` skill.

## Steps
1. Name the file with the next free number in that folder: `NNNN-short-kebab-title.md`, starting at `0001`.
2. Fill in the template below. Aim for something a newcomer understands in two minutes, under about 40 lines.
3. Never skip the rejected options and why they lost. That is what future readers need most.
4. Start with `Status: Proposed`, and switch to `Accepted` once the user confirms.
5. Never rewrite an accepted decision. Write a new ADR that supersedes it, and mark the old one `Superseded by NNNN`.

## Template

```markdown
# NNNN. Decision title, phrased as an action

- Status: Proposed
- Date: YYYY-MM-DD

## Context
The problem, the constraints, and what we know.

## Options
1. **Option A**: pros and cons.
2. **Option B**: pros and cons.

## Decision
What we chose, in one or two sentences.

## Why
Why it beats the alternatives here and now.

## Consequences
What gets easier, what gets harder, and what we now have to do or watch.
```
