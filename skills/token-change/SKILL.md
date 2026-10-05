---
name: token-change
description: Add, rename or change a design token safely, keeping tokens.json as the single source for CSS, Figma variables and documentation. Use when a component needs a value no token provides, when a color, state or elevation token changes, or when the user asks to add a token or sync tokens with Figma.
---

# Token change

## Steps
1. **Check for an existing token.** Search `tokens.json` for a token with the same meaning. Reuse it if one exists; never add a second token with the same purpose.
2. **Pick the layer.**
   - Primitive (`orange-500`, `slate-800`): a raw value with no meaning. Components never use primitives directly.
   - Semantic (`surface-raised`, `ink-muted`, `surface-hover`): a role, with a value for every theme.
   - Project accent (`accent`, `accent-hover`, `accent-pressed`, `accent-soft`, `accent-ink`, `on-accent`): the only layer projects override.
3. **Name the role, not the look.** `danger-hover`, not `red-dark`. Interaction states for neutral surfaces use the translucent overlay tokens (`surface-hover`, `surface-pressed`) so they work on any surface.
4. **Give every theme a value.** A semantic token without a dark value is a bug. Prefer aliases to primitives (`{orange-100}`) over raw hex.
5. **Edit only `tokens.json`,** then run the generators: `tokens.css` for the library and the DTCG files for Figma. Never edit generated files by hand.
6. **Verify** with the `theme-audit` skill for every component that uses the token.
7. **Document.** Update the token docs. A new token family or pattern is a decision: record it with the `adr` skill. Renaming or removing a token is a breaking change and a major version.
