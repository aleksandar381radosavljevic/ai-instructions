# 0005. English in repository artifacts, Serbian in conversation

- Status: Accepted
- Date: 2026-10-05

## Context
The user thinks and writes in Serbian; code, libraries and documentation are in English.

## Options
1. **Everything in Serbian**: natural to read, but rules and skill names don't match the code around them.
2. **Everything in English**: consistent with the code, but the user has to switch languages to talk to the agent.
3. **English artifacts, Serbian conversation.**

## Decision
Option 3. Rules, skills, ADRs, code, comments and commit messages are in English; agents talk to the user in Serbian (Latin script). Accepted by the owner on 2026-10-30.

## Why
Artifacts stay consistent with the code they describe and remain shareable, while conversation stays in the language the user thinks in.

## Consequences
- Since decision 0012 the Serbian-conversation rule lives in `personal/preferences.md`, not in project rules, because it belongs to the user rather than the project.
- Reversible: moving rules and skills to Serbian is a rewrite of text, not a redesign.
