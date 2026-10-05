---
name: retro
description: End-of-session retrospective that turns what was learned or decided into concrete, approved updates to the shared ai-instructions repo or to the current project's rules. Use only when the user asks to wrap up a session, run a retro, capture learnings, or update the instructions.
---

# Retro

## 1. Collect
From this session, list:
- decisions made, with the options that were rejected;
- corrections the user had to give, especially repeated ones;
- procedures done more than once;
- mistakes, with their root causes.

## 2. Route each item

| Destination | When |
|---|---|
| Project `AGENTS.md`, "This project" section | true only for this project |
| Project `docs/decisions/` | a project decision (use the `adr` skill) |
| ai-instructions `rules/core.md` | true for every project |
| ai-instructions `rules/stacks/<stack>.md` | true for every project on that stack |
| ai-instructions `rules/design/osnova.md` | true wherever Osnova is used |
| ai-instructions `skills/<name>/` | a repeatable multi-step procedure |
| ai-instructions `decisions/` | a decision that holds across projects |
| Tooling: a lint rule, test or permission | it can be enforced mechanically (prefer this) |
| Nowhere | a one-off, or something agents already do by default |

## 3. Apply the bar
A shared rule earns its place only if all three hold:
1. an agent got it wrong, or plausibly would;
2. it can't be inferred from the code;
3. tooling can't enforce it.

Prefer sharpening an existing rule to adding a new one. The shared layers have a size budget; when a change goes over it, remove or merge something.

## 4. Propose, then apply
- Show a table of item, destination and the exact text or diff. Change nothing before the user approves.
- After approval, apply the changes. In ai-instructions, also add a `CHANGELOG.md` entry and suggest the version bump: patch for wording, minor for a new rule, skill or layer, major for a removed or changed rule that changes agent behavior.
- If you can't write to the ai-instructions repo from here, output the exact patch for the user to apply.
- If a skill changed, remind the user to re-upload it to their Claude account.
