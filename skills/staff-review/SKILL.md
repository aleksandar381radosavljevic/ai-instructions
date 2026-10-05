---
name: staff-review
description: Staff-level review of a change against the project's AGENTS.md rules and recorded decisions, with findings ranked by severity and explained so the author learns. Use before declaring non-trivial work done, or when the user asks to review a diff, branch, pull request or file.
---

# Staff review

## Fresh eyes
If you can start a subagent, hand it these instructions and the scope, then relay its findings. A reviewer that didn't write the change sees what the author's context hides. Otherwise, review as if you were seeing the code for the first time.

## Scope
The diff against the base branch plus untracked files, unless the user names something else. Read the `AGENTS.md` files that apply and the ADRs in `docs/decisions/`, and review against them.

## Check, in this order
1. **Correctness**: edge cases, error and empty states, race conditions, broken invariants.
2. **Fit**: existing patterns, Osnova components and tokens, recorded decisions.
3. **Accessibility**: semantics, keyboard, focus, contrast, accessible names.
4. **Tests**: do they verify behavior a user would notice? What is untested?
5. **Performance**: needless effects and re-renders, bundle weight, unbounded work.
6. **Security**: secrets, unsafe HTML, injection, overly broad permissions.

## Output
- Group findings as **Blocker**, **Should fix** and **Nit**. Each one gives `file:line`, what is wrong, why it matters, and a concrete fix.
- End with one line on what a staff engineer would teach from this change.
- If nothing blocks, say so plainly. Don't invent issues.
- Don't modify files during the review.
