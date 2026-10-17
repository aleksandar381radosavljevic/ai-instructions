# 0015. Playwright for end-to-end tests and MSW for network fakes in React projects

- Status: Accepted
- Date: 2026-10-17

## Context
The tester skills (`test-plan`, `qa-check`) need a standard for the levels above component tests. Decision 0011 settled Vitest and Testing Library, but not end-to-end tests or how to fake HTTP, so agents would mock `fetch` or the API module per test and skip the real data layer. As of 17 October 2026: `@playwright/test` 1.64.1, `msw` 3.0.3, `vitest` 5.0.5 with a Playwright-based browser mode, and `@axe-core/playwright` 4.14.0.

## Options
1. **Playwright for a few end-to-end journeys, MSW for HTTP in component tests**: the fast jsdom layer stays fast, the real data layer runs in tests, and the same Playwright drives manual QA.
2. **Vitest browser mode for component tests, Playwright for end-to-end**: component tests in a real browser are closer to production, but slower, and two browser layers to set up and maintain.
3. **No end-to-end layer, Vitest and MSW only**: fewest tools, but nothing checks the running app in a browser.

## Decision
Option 1, chosen by the owner on 2026-10-17.

## Why
Most risks are caught cheapest in component tests with the network faked at its boundary, and MSW does that without coupling tests to how the app calls its API. The few journeys whose failure would be an incident need a real browser, and Playwright is the same tool an agent uses in `qa-check`, so one tool covers automated and exploratory checks.

## Consequences
- `stacks/react`: end-to-end tests use Playwright; HTTP is faked with MSW, never by mocking `fetch` or the API module.
- `new-project` adds MSW to the Vitest setup and a Playwright smoke test for the start screen.
- `test-plan` and `qa-check` describe the React tools in their `references/react.md`.
- Revisit option 2 if jsdom gaps start causing false passes.
