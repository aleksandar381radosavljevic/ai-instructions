# Vue

Decisions 0015 and 0016. Rule layer: `stacks/vue`.

| Level | Tool | Where |
|---|---|---|
| Unit | Vitest | `name.test.ts` next to the module; composables and stores too |
| Component | Vitest + `@testing-library/vue` and `user-event`, jsdom | `Name.test.ts` next to the component |
| Network at the boundary | MSW request handlers, shared in `src/test/` | started in the Vitest setup file |
| End-to-end | Playwright Test | `e2e/`, run against the built app |
| Accessibility | `@axe-core/playwright` in e2e; keyboard checks in component tests | |

- Query by role, label or text; `getByTestId` only when nothing user-visible identifies the element.
- Render with `render(Component, { props, global: { plugins: [createTestingPinia(), router] } })`; give each test a fresh Pinia so state doesn't leak.
- Drive interactions with `userEvent` and `await` them; Vue updates the DOM asynchronously, so wait with `findBy*` instead of reading the DOM right after an event.
- Fake HTTP with MSW handlers instead of mocking `fetch` or the API module. Override a handler per test with `server.use(...)` for errors and empty responses.
- Test a Pinia store's actions directly with a fresh `setActivePinia(createPinia())`; test a composable inside a small host component when it needs a lifecycle.
- `@testing-library/vue` is a thin layer over Vue Test Utils; if it stops supporting a new Vue release, decision 0016 names the fallback.
