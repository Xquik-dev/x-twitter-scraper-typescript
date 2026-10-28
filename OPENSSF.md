# OpenSSF Best Practices evidence

This register records public evidence for the TypeScript SDK project.

The live badge entry is [OpenSSF project 13740](https://www.bestpractices.dev/projects/13740).

## Project scope

The project releases the `x-twitter-scraper` npm package.

The package includes the TypeScript SDK and bundled agent Skills.

The shared Xquik documentation site supports this released project.

## Technical evidence

- `bin/check-local` runs linting, type checks, builds, tests, and dependency audits.
- Vitest enforces 90% statement and 80% branch coverage.
- The current suite passes both enforced coverage thresholds.
- REUSE maps every tracked file to Apache-2.0 or MIT.
- `bin/check-local` runs CodeQL `security-extended` queries and fails on any result or any file CodeQL cannot parse.
- `bin/check-local` and `bin/release-local` refuse blocking npm audit findings.
- `audit-exceptions.json` lists reviewed, unfixable development findings with 30-day rechecks.
- Package archives build reproducibly through `pnpm run check:reproducible`.
- `bin/release-local` releases only a clean `main` that matches `origin/main`.
- `bin/release-local` refuses a version whose release tag already exists.
- [SECURITY.md](SECURITY.md) documents the security boundary and threat model.
- [CONTRIBUTING.md](CONTRIBUTING.md) documents tests, review, and DCO requirements.

## Gold limitations

Public evidence does not yet prove these human Gold requirements.

- A bus factor of 2 or more.
- Two unassociated significant contributors.
- Independent review for at least 50% of released modifications.
- A human security review completed within the last 5 years.

Do not mark these criteria as met without public evidence.

Xquik is an independent third-party service. Not affiliated with X Corp. "Twitter" and "X" are trademarks of X Corp.
