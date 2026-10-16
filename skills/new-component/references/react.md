# React

- Files: `Name.tsx` plus `Name.module.css`, co-located, with `Name.test.tsx` next to them.
- Pass through `className`, `ref` (a plain prop since React 19), `aria-*` and event props to the native element.
- Visual options are a union-typed prop (`variant: 'primary' | 'secondary'`), not an `enum` (`erasableSyntaxOnly`, decision 0010).
- Tests use Vitest and Testing Library, finding elements by role, label or text.
