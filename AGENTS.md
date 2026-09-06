# Agent instructions

Every commit reduces handwritten test LOC and non-test LOC separately against its parent.
Report both totals and negative deltas. No exceptions.
Count all languages, locations, scripts, and tooling. Count each line once.
Test-only helpers and scripts count as tests; other code counts as non-test code.
Formatting, minification, generated files, moves, renames, reclassification, and deleted valuable tests or docs never count.
Preserve coverage, assertions, guards, diagnostics, and behavior.
Run `bun run check:all` before committing or pushing.
