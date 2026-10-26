# 0016. The Vue stack

- Status: Accepted
- Date: 2026-10-25

## Context
Vue is the second supported frontend stack (decision 0013). Its libraries, styling, architecture and testing are decided once here, never per project. Osnova gives Vue projects its tokens only, not components (owner's choice on 2026-10-16). Versions on npm as of 25 October 2026: `vue` 3.5.44, `vite` 8.3.5, `nuxt` 4.6.2, `pinia` 4.1.0, `vue-router` 5.4.0, `vue-tsc` 3.3.13, `@vue/test-utils` 2.5.1, `@testing-library/vue` 8.1.0 (last released May 2024), `vitest-browser-vue` 3.1.0, `reka-ui` 2.11.0, `primevue` 5.0.4, `@lucide/vue` 1.61.0 (`lucide-vue-next` is deprecated).

Defaults that weren't contested, mirroring the React stack: TypeScript per decision 0010 with `script setup` and the Composition API only; Vite (`create-vue`) for frontend apps and Nuxt when an app needs its own server, as decision 0008 does with Next.js; Pinia for shared state and Vue Router; pnpm, Vitest, MSW and Playwright per decisions 0011 and 0015.

## Options
**Styling**
1. **`<style scoped>`**: the Vue default that docs, tooling and agents follow.
2. **`<style module>`**: the same mechanism as React's CSS Modules, but less common in Vue.

**Component tests**
1. **`@testing-library/vue`** over Vue Test Utils: role queries as in React; the wrapper itself hasn't been released since May 2024.
2. **Vue Test Utils alone**: official and active, but no role queries, so tests drift to class selectors.
3. **Vitest browser mode with `vitest-browser-vue`**: active, role locators in a real browser; slower, and the option decision 0015 rejected for React.

**Accessible widgets without Osnova components**
1. **Reka UI headless primitives** styled with tokens.
2. **Everything by hand.**
3. **PrimeVue**: styled components whose look has to be overridden.

## Decision
Styling 1, component tests 2, widgets 1, chosen by the owner on 2026-10-26.

## Why
What has to be shared across stacks is the tokens, not the styling mechanism, so Vue keeps its own idiom. Vue Test Utils is the official, actively maintained library, while the Testing Library wrapper hasn't been released since May 2024; the lost role queries are covered by a rule to select by what users perceive or by `data-test`, never by styling classes. Keyboard and ARIA behavior of complex widgets is where hand-written components go wrong most, and headless primitives solve it without bringing a look of their own.

## Consequences
- `rules/stacks/vue.md` holds these rules; `init` adds the layer when `vue` or `nuxt` is a dependency.
- `design/osnova` says which of its rules apply to React only.
- `new-project`, `new-component`, `test-plan` and `qa-check` gain `references/vue.md`.
- `stacks/vue` and the `test-plan` reference spell out selectors without role queries; `staff-review` should flag class-based selectors in Vue tests.
- Components the first Vue project builds on Reka UI and tokens are the seed of a future `osnova-vue`; extract them when a second Vue project starts (Osnova decision to follow).
- Revisit `vitest-browser-vue` (option 3) if Vue tests drift to implementation details.
