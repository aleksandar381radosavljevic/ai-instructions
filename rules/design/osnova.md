### Osnova design system
- Build UI from Osnova components first. When something is missing, propose adding it to Osnova (`new-component` skill) instead of building a one-off in the app.
- A project changes appearance only by overriding Osnova's tokens in its theme. Never restyle Osnova components by targeting their internal class names.
- Components must hold up under any project theme: when tokens change, check WCAG AA contrast (4.5:1 for text, 3:1 for UI boundaries and focus indicators).
- Icons only through Osnova's `Icon` component, by Lucide icon name.
- System font stack only; never add web fonts.
