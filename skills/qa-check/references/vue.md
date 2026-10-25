# Vue

Decisions 0015 and 0016. Rule layer: `stacks/vue`.

- Run the dev server or, before a release, the production build (`build` then `preview` for Vite, `build` then `preview` for Nuxt), through the project's scripts.
- Everything else is the same as for React: drive the app with Playwright and `getByRole` locators, check narrow and wide viewports, slow or fail API calls with `page.route()`, scan each screen with `@axe-core/playwright`, and walk the page with `Tab`.
- Reka UI widgets (dialogs, menus, comboboxes): check that focus moves in on open, `Escape` closes, and focus returns to the trigger.
- A scenario worth keeping becomes a Playwright test in `e2e/` (`test-plan` skill).
