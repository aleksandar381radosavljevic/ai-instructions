# React

Decision 0015 (Playwright). Rule layer: `stacks/react`.

- Run the dev server or, before a release, the production build (`build` then `preview` for Vite, `build` then `start` for Next.js), through the project's scripts.
- Drive the app with Playwright: a quick script or the Playwright MCP or browser tools if the environment has them. Use `getByRole` and `getByLabel` locators, the same way the e2e tests do.
- Narrow and wide checks: `page.setViewportSize({ width: 375, height: 800 })` and `{ width: 1280, height: 800 }`.
- Slow or failed network: `page.route()` to delay or fail an API call.
- Accessibility scan: `new AxeBuilder({ page }).analyze()` from `@axe-core/playwright` on each screen you visit; report violations with their rule id and element.
- Keyboard: walk the page with `Tab` and `Shift+Tab`, and check that focus is visible and follows the visual order.
- A scenario worth keeping becomes a Playwright test in `e2e/` (`test-plan` skill).
