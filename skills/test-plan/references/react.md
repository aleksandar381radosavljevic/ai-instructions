# React

Decision 0011 (Vitest, Testing Library) and decision 0015 (Playwright, MSW). Rule layer: `stacks/react`.

| Level | Tool | Where |
|---|---|---|
| Unit | Vitest | `name.test.ts` next to the module |
| Component | Vitest + Testing Library (`@testing-library/react`, `user-event`), jsdom | `Name.test.tsx` next to the component |
| Network at the boundary | MSW request handlers, shared in `src/test/` | started in the Vitest setup file |
| End-to-end | Playwright Test | `e2e/`, run against the built app |
| Accessibility | `@axe-core/playwright` in e2e; keyboard checks in component tests | |

- Query by role, label or text (`getByRole('button', { name: 'Save' })`); `getByTestId` only when nothing user-visible identifies the element.
- Drive interactions with `userEvent`, not `fireEvent`, and `await` them.
- Wait with `findBy*` or `waitFor`, never with timers.
- Fake HTTP with MSW handlers instead of mocking `fetch` or the API module, so the component's real data layer runs. Override a handler per test with `server.use(...)` for errors and empty responses.
- Mock a module with `vi.mock` only for things outside the app's control (time, randomness, browser APIs jsdom lacks).
- Playwright: locate with `getByRole` and `getByLabel`, rely on web-first assertions (`await expect(locator).toBeVisible()`), and give each test its own data.
- Check current setup steps for MSW and Playwright in their docs; both changed APIs between majors.
