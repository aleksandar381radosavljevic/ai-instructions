# 0014. Build on native elements before custom ARIA widgets

- Status: Proposed
- Date: 2026-10-05

## Context
Modals, selects, radios and switches can be built from `div`s with ARIA roles or from native HTML elements. Custom widgets need focus traps, keyboard handling and screen-reader testing that native elements provide for free.

## Options
1. **Custom widgets everywhere**: full visual control, and a long tail of accessibility bugs.
2. **Native elements first**, styled with CSS; custom ARIA widgets only where no native element fits (combobox with search, menus).

## Decision
Option 2. Modal is `<dialog>` with `showModal()`, Select is `<select>`, Radio is `<input type="radio">` in a `fieldset`, Switch is `<input type="checkbox" role="switch">`.

## Why
Browsers handle focus, the Escape key, the top layer, form submission and announcements correctly and consistently. Less code means fewer bugs, and the result works before JavaScript loads.

## Consequences
- Some visuals are limited (the open `<select>` list follows the OS). When a design needs more, use Combobox rather than restyling `<select>`.
- Custom widgets follow the ARIA Authoring Practices patterns and are tested by keyboard.
