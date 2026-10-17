---
name: test-plan
description: Plan the tests for a feature, bug fix or change from its risks, choose the cheapest test level that catches each risk, and write the automated tests. Use when starting or finishing a feature or fix, when the user asks what to test or asks for tests, or when a change has no tests yet.
---

# Test plan

A tester's question is "what could go wrong for the user, and what is the cheapest test that would catch it?", not "what is the coverage?".

## 1. Find the risks
Read the change (or the ticket and the code it will touch) and list what could break, from the user's side:
- the main path, and what the user sees when it works;
- inputs at the edges: empty, maximum, invalid, duplicate, wrong type, slow or failed network;
- states: loading, empty, error, partial, permission denied, already done;
- what this change could break elsewhere (shared code, data contracts, routing);
- accessibility: keyboard, focus, accessible names, announcements.

Rank them by likelihood times impact. Drop the ones nobody would notice.

## 2. Pick the level for each risk
Use the lowest level that can still catch the failure:
- **Unit**: pure logic and edge cases of one function.
- **Component or integration**: what a user does on one screen or endpoint, with the network or database faked at its boundary.
- **End-to-end**: a few critical journeys through the real app. Each one is slow and brittle, so keep them for paths whose failure would be a production incident.

Open `references/<stack>.md` for the project's stack (each `stacks/<stack>` layer in `.ai-instructions.json`; today: [React](references/react.md)) for the tools and conventions at each level. If there is none, use the project's existing test setup and say the skill has no reference for it yet.

## 3. Show the plan
Before writing tests for a non-trivial change, show a short table: risk, level, case. Say what you deliberately won't test and why. Proceed unless the user objects.

## 4. Write the tests
- One behavior per test, named after what the user observes ("shows an error when the save fails"), not after the function.
- Arrange data explicitly in the test; no shared mutable fixtures between tests.
- Assert on what the user sees or what the API returns, never on internals, private state or call counts that a refactor would change.
- No sleeps or arbitrary timeouts: wait for the condition.
- A bug fix starts with a test that fails for the bug's reason, then passes with the fix.

## 5. Done when
- Every risk in the plan has a test or a stated reason it doesn't.
- The new tests fail when the behavior they cover is broken (break it once on purpose, or say why you couldn't).
- The project's test command passes, run through its own scripts.
