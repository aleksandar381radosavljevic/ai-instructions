---
name: qa-check
description: Exploratory QA of a running app, the way a tester checks a change before release, covering the main paths, edge cases, states, keyboard and accessibility, and screen sizes, then reporting bugs with exact reproduction steps. Use when the user asks to test, QA or check a feature in the app, before declaring a UI or API change done, or before a release.
---

# QA check

Code review reads the change; this skill uses the product. Never report something as checked unless you actually ran it.

## 1. Scope
- What changed, and which screens or endpoints it touches. Read the diff, the test plan if one exists (`test-plan` skill), and the project's `AGENTS.md`.
- Write a short charter: "Check <area> for <risks>". Keep the session to that charter.

## 2. Run the app
Start it with the project's own scripts. Open `references/<stack>.md` for the project's stack (today: [React](references/react.md) and [Vue](references/vue.md)) for how to drive it. If no browser or HTTP tool is available, say so and stop; don't simulate a QA session from reading code.

## 3. Explore
For each risk in the charter:
- **Main path** end to end, as a first-time user would.
- **Edges**: empty and maximum input, invalid input, double submit, back button, refresh mid-flow, slow or failed network.
- **States**: loading, empty, error, success; what happens after an error is fixed.
- **Keyboard and accessibility**: everything reachable and usable by keyboard, visible focus, sensible focus after dialogs and navigation, accessible names, an automated scan where the reference has one.
- **Sizes**: a narrow mobile width and a desktop width.

Write down what you did as you go; it becomes the reproduction steps.

## 4. Report
- One entry per bug: title (what is wrong, where), severity (Blocker, Major, Minor), exact steps, expected, actual, and a screenshot or response when you have one.
- Separate bugs from suggestions.
- End with what you covered, what you didn't, and whether you'd ship.
- Offer to turn each confirmed bug into a failing test with the `test-plan` skill before fixing it.
