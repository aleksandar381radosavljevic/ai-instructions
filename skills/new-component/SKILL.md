---
name: new-component
description: Design and build a UI component the Osnova way, API first, styled with CSS Modules and design tokens only, with every state and theme covered and accessible by default. Use when the user asks for a new component or variant, or when the same UI pattern shows up a second time and should become reusable.
---

# New component

## 1. Look before you build
- Search Osnova and the app for something that already covers this. Prefer a new variant or prop on an existing component over a new component.
- Read the token definitions and one or two existing components, and copy their conventions: file layout, naming, exports, tests, docs.

## 2. Propose the API first
Before writing code, show the user:
- **Props** with defaults. Model visual options as one enum-like prop (`variant="primary"`, `size="sm"`), not boolean flags (`primary`, `small`) that can contradict each other.
- **States**: default, hover, active, `:focus-visible`, disabled, plus loading, error and empty where they apply.
- **Accessibility**: the native element it renders, keyboard behavior, and what a screen reader announces.
- **One rejected alternative** and why it lost.

For components in Osnova itself (a shared API), wait for approval. For app-local components, go ahead unless the choice is contested.

## 3. Build
- `Name.jsx` or `Name.tsx` plus `Name.module.css`, co-located, following the existing structure.
- Style only with tokens. If a needed token doesn't exist, propose a new one instead of hard-coding a value.
- Render the native element and pass through `className`, `ref`, `aria-*` and event props.
- Icons only through Osnova's `Icon` component.
- Respect `prefers-reduced-motion` for any animation.

## 4. Verify
- Tests, finding elements by role or label: it renders, keyboard interaction works, the disabled state holds, and the accessible name is right.
- Check the component under at least two different project themes: nothing breaks and contrast still passes.
- Lint, tests and build pass.

## 5. Document
- Add a usage example, and a demo or story entry if the project has them.
- A new token or pattern is a decision: record it with the `adr` skill.
