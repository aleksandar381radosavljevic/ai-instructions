### React
- TypeScript only, with `strict: true`: `.ts` and `.tsx` source, exported `Props` interfaces with English JSDoc, no `any` in public APIs.
- Styling is CSS Modules only: `Name.module.css`, co-located with the component. No Tailwind, CSS-in-JS or global class names without an ADR.
- No hard-coded colors, spacing, radii, shadows or font stacks: use design tokens (CSS custom properties). Pass dynamic values through custom properties (`style={{ '--progress': value }}`) and keep the styling itself in CSS.
- Semantic elements first (`button`, `a`, `label`, lists, landmarks); ARIA only where native semantics fall short. Everything interactive works by keyboard and has a visible `:focus-visible` state.
- No effects for derived state or event handling: compute during render or in the handler. `useEffect` is for syncing with external systems.
- Components that render UI don't fetch data; data access lives in hooks or services.
- Tests find elements the way users do (role, label, text), not by class names.
