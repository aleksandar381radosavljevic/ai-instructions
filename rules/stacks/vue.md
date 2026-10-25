### Vue
- TypeScript with `strict` and `erasableSyntaxOnly`, as in decision 0010. Components use `<script setup lang="ts">` and the Composition API only; no Options API. Type-check with `vue-tsc`.
- pnpm is the package manager: never create `package-lock.json` or `yarn.lock`.
- Styles live in the component's `<style scoped>` block. No Tailwind, CSS-in-JS, global class names or `:deep()` into another component without an ADR.
- No hard-coded colors, spacing, radii, shadows or font stacks: use Osnova tokens (CSS custom properties). Bind dynamic values with `v-bind()` in CSS or custom properties, not inline style objects.
- Semantic elements first; ARIA only where native semantics fall short. Dialogs, menus, comboboxes, tabs and similar widgets build on Reka UI primitives, styled with tokens. Everything interactive works by keyboard and has a visible `:focus-visible` state.
- `computed` for derived state, never a `watch` that copies one ref into another. Shared state lives in Pinia stores; components that render UI don't fetch data, composables or services do.
- Icons from `@lucide/vue`, by icon name.
- Tests use Vitest and Testing Library (`@testing-library/vue`) and find elements by role, label or text. Fake HTTP with MSW, never by mocking `fetch` or the API module; end-to-end tests use Playwright.
