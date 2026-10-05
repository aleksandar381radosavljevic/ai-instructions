# 0006. Keep ai-instructions in its own repository

- Status: Proposed
- Date: 2026-10-05

## Context
Osnova (tokens, components and docs) becomes a monorepo (Osnova decision 0001). Should ai-instructions live there as one more package?

## Options
1. **A package in the Osnova monorepo**: one place for everything, and an Osnova change lands in the same pull request as its rules.
2. **Its own repository**, as today.

## Decision
Option 2.

## Why
- **Different consumers.** Every project uses ai-instructions, including ones without UI or Osnova. Only UI projects use Osnova.
- **Installation.** Projects install ai-instructions from a git tag. npm can't install a package from a subdirectory of a git repository, so inside a monorepo it would have to be published to a registry.
- **Different rhythm.** A rule edit shouldn't trigger component builds and visual tests, and a component release shouldn't touch the rules.
- **Ownership.** In a company, a design-system team owns Osnova and a platform team owns how agents work. Separate repositories keep that boundary visible even when one person plays both roles.

The one real coupling, rules that describe Osnova's API, moves into Osnova (decision 0007).

## Consequences
- Osnova consumes ai-instructions like any other project.
- Skills are unaffected: they are uploaded to the Claude account (decision 0003).
