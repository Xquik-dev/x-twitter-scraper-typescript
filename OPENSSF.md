# OpenSSF Best Practices Evidence

This register records public evidence for the TypeScript SDK project.

The live badge entry is [OpenSSF project 13740](https://www.bestpractices.dev/projects/13740).

## Project Scope

The project releases the `x-twitter-scraper` npm package.

The package includes the generated TypeScript SDK and bundled agent Skills.

The shared Xquik documentation site supports this released project.

## Technical Evidence

- CI runs linting, type checks, builds, tests, and dependency audits.
- Jest enforces 90% statement and 80% branch coverage.
- The current suite passes both enforced coverage thresholds.
- REUSE maps every tracked file to Apache-2.0 or MIT.
- CodeQL and OpenSSF Scorecard run on pinned workflow revisions.
- Dependabot monitors GitHub Actions and npm dependencies.
- Package archives build reproducibly through `pnpm run check:reproducible`.
- Release tags must match the package version and default-branch commit.
- npm trusted publishing creates public package provenance.
- [SECURITY.md](SECURITY.md) documents the security boundary and threat model.
- [CONTRIBUTING.md](CONTRIBUTING.md) documents tests, review, and DCO requirements.

## Gold Limitations

The organization currently has one member.

This project cannot yet prove these human Gold requirements:

- A bus factor of 2 or more.
- Two unassociated significant contributors.
- Independent review for at least 50% of released modifications.
- A human security review completed within the last 5 years.

Do not mark these criteria as met without public evidence.

Do not count this file as default-branch evidence before merging.

Xquik is an independent third-party service. Not affiliated with X Corp. "Twitter" and "X" are trademarks of X Corp.
