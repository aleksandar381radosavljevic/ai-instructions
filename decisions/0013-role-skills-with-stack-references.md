# 0013. Role skills with per-stack references

- Status: Accepted
- Date: 2026-10-16
- Amends: 0003, 0004

## Context
Projects will run on more than one stack: React or Vue on the frontend, .NET Web API on the backend. Every project should share one standard for writing code, testing, checks, releases and project patterns, and the user wants skills for each role (developer, designer, tester) that fit the project's stack. Skills are uploaded to the Claude account (decision 0003), so every skill is available in every project.

## Options
1. **One skill per role, stack detail in `references/<stack>.md` inside it**: few skills, works on every surface skills reach today; each zip carries references for every stack, loaded only when needed.
2. **`sync` copies stack-specific skills into the project's `.claude/skills/`**: a project sees only its own skills, but only in Claude Code, and every project carries copies.
3. **A skill per role and stack** (`react-tester`, `dotnet-tester`): simple to write, but the count multiplies, descriptions compete when Claude picks a skill, and one procedure drifts across copies.

## Decision
Option 1, chosen by the owner on 2026-10-16.

## Why
A role is a procedure and a stack is data. A tester on React and a tester on .NET take the same steps with different tools, so the steps belong in one `SKILL.md` and the tools in a reference the skill opens once it knows the stack. That is what the Agent Skills spec's references are for, and distribution stays as decision 0003 set it.

## Consequences
- A reference is named after a rule layer: `references/react.md` pairs with `rules/stacks/react.md`. `npm run check` fails on a reference without a matching layer.
- A skill finds the stack from the `stacks/<stack>` layers in `.ai-instructions.json`; with no project yet (`new-project`), it asks, offering only stacks that have a reference.
- Libraries, styling, architecture and folder layout are decided once per stack in a stack ADR, never per project. A new stack starts with that ADR, then its rule layer and references.
- The rules budget (decision 0004) applies to what one project loads, core plus one stack and one design layer, not to all layers together. `npm run check` checks every such combination.
- Skills stay flat in `skills/<name>/`, because claude.ai expects one folder per skill. Roles are a grouping in the README.
- Order of work: this skeleton, then role skills on React, then Vue, then .NET Web API.
