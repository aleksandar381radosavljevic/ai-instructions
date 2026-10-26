# Vue

Decisions 0015 and 0016. Rule layer: `stacks/vue`.

| Level | Tool | Where |
|---|---|---|
| Unit | Vitest | `name.test.ts` next to the module; composables and stores too |
| Component | Vitest + Vue Test Utils (`mount`), jsdom | `Name.test.ts` next to the component |
| Network at the boundary | MSW request handlers, shared in `src/test/` | started in the Vitest setup file |
| End-to-end | Playwright Test | `e2e/`, run against the built app |
| Accessibility | `@axe-core/playwright` in e2e; keyboard checks in component tests | |

- Vue Test Utils has no role queries, so select the way a user would recognize the element: tag plus accessible name (`wrapper.get('button[aria-label="Save"]')`), a label's `for`, or visible text (`findAll('button').find(b => b.text() === 'Save')`). Add a `data-test` attribute when nothing user-visible identifies it. Never select by styling classes or `findComponent` on internals.
- Mount with `mount(Component, { props, global: { plugins: [createTestingPinia(), router] } })`; give each test a fresh Pinia so state doesn't leak.
- Drive interactions with `await trigger('click')` and `await setValue(...)`; Vue updates the DOM asynchronously, so always `await` them, and use `flushPromises()` after async work such as a fetch.
- Assert on what renders (`text()`, `exists()`, `attributes()`) and on `emitted()` events, not on `wrapper.vm` state.
- Fake HTTP with MSW handlers instead of mocking `fetch` or the API module. Override a handler per test with `server.use(...)` for errors and empty responses.
- Test a Pinia store's actions directly with a fresh `setActivePinia(createPinia())`; test a composable inside a small host component when it needs a lifecycle.
