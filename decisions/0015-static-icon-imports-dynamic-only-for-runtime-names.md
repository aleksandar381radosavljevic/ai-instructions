# 0015. Import fixed icons statically; load by name only at runtime

- Status: Proposed
- Date: 2026-10-05

## Context
Osnova uses Lucide icons. Apps use the `Icon` component with an icon name, which loads the icon through `DynamicIcon`. Inside the library, components also need icons (chevrons, close, check).

## Options
1. **`DynamicIcon` everywhere**: one code path, but every icon becomes a separate network request and a flash of empty space.
2. **Static imports everywhere**: tree-shaken and instant, but names from data (menu items, configs) can't be rendered.
3. **Static imports for icons fixed in code; `DynamicIcon` only for names that arrive from outside** (`<Icon name>`, `items[].icon`).

## Decision
Option 3. `lucide-react` is a dependency marked external in the library build, so the app's bundler shares and splits it.

## Why
Fixed icons ship with the component that uses them and render on the first frame, while dynamic names still work where the name is truly data.

## Consequences
- Apps that render many dynamic icons above the fold should import those icons statically instead.
- The `IconName` type comes from Lucide, so a misspelled name is a type error.
