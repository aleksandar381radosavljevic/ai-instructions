### Osnova design system
- React: build UI from Osnova components first; when something is missing, propose adding it to Osnova (`new-component` skill) instead of a one-off. Vue: Osnova provides tokens only (decision 0016).
- A project changes appearance only by overriding Osnova's tokens in its theme. Never restyle Osnova components by targeting their internal class names.
- Components must hold up under any project theme: when tokens change, check WCAG AA contrast (4.5:1 for text, 3:1 for UI boundaries and focus indicators).
- Icons are Lucide: in React only through Osnova's `Icon` component, in Vue as the stack layer says.
- System font stack only; never add web fonts.
