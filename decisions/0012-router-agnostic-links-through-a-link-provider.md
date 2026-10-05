# 0012. Keep Osnova router-agnostic with a LinkProvider

- Status: Proposed
- Date: 2026-10-05

## Context
Navbar, Sidebar, Breadcrumbs and Pagination render links. Projects may use React Router, Next.js or plain anchors, and Osnova must not depend on any of them.

## Options
1. **Plain `<a>` only**: no dependency, but every click reloads the page in a single-page app.
2. **Depend on one router**: works for that router and forces it on every project.
3. **A `LinkProvider`**: the app registers its link component once; Osnova renders links through an internal `UiLink` that falls back to `<a>`.

## Decision
Option 3. Components that page or navigate take hrefs (`getHref` on Pagination) and render them through `UiLink`.

## Why
This is the `linkComponent` pattern used by Polaris and MUI: one line of setup per app, zero router imports in the library, and server-rendered or plain pages still get real anchors.

## Consequences
- Osnova never imports a router.
- The registered component must forward `ref` and accept `href` and `className`.
