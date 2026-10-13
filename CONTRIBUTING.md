## Set up the environment

This repository uses [`pnpm`](https://pnpm.io/).
Other package managers may work but are not officially supported for development.

Install dependencies and build `dist/`:

```sh
pnpm install
pnpm build
```

## Contribution requirements

Follow the shared [Xquik contribution policy](https://github.com/Xquik-dev/.github/blob/main/CONTRIBUTING.md).

## Contribute code

Most SDK code is generated. Manual patches persist but may conflict with later generations.
The generator leaves `examples/` unchanged.

## Add examples

The generator leaves `examples/` unchanged. Edit or add files there.

```ts
// add an example to examples/<your-example>.ts

#!/usr/bin/env -S npm run tsn -T
…
```

```sh
chmod +x examples/<your-example>.ts
# Run the example against your API.
pnpm tsn -T examples/<your-example>.ts
```

## Use the repository from source

Install directly from Git:

```sh
npm install git+ssh://git@github.com:Xquik-dev/x-twitter-scraper-typescript.git
```

Or link a local clone:

```sh
# Clone.
git clone https://www.github.com/Xquik-dev/x-twitter-scraper-typescript
cd x-twitter-scraper-typescript

# Use Yarn.
yarn link
cd ../my-package
yarn link x-twitter-scraper

# Use pnpm.
pnpm link --global
cd ../my-package
pnpm link --global x-twitter-scraper
```

## Run tests

```sh
pnpm run test
```

Tests enforce 90% statement coverage and 80% branch coverage.

Add regression tests for every corrected defect.

Run every repository check before requesting review:

```sh
bin/check-local
```

It installs dependencies from the lockfile, then checks license notices when `reuse` is installed.
It audits dependencies, lints, builds, checks types, checks the reproducible build, and runs tests.
Last, it runs the CodeQL `security-extended` queries for JavaScript and TypeScript.
CodeQL is required. Install it with `brew install --cask codeql`.
It stops at the first failure and says what to fix.
When the tree is clean and `HEAD` is pushed, it posts the `xquik-local-checks` commit status.
Pass `--no-status` to skip the status.

The audit fails on any finding in a shipped dependency.
It also fails on any development finding that has an installable fix.
Severity never excuses a finding.
An unfixable development finding passes only when `audit-exceptions.json` lists it.
Each entry names the advisory, the package path, the reason, and a recheck date within 30 days.
An entry stops counting on its recheck date or once a fix is installable.

## Lint & format

Use [Prettier](https://www.npmjs.com/package/prettier) and
[ESLint](https://www.npmjs.com/package/eslint) for formatting and linting.

To lint:

```sh
pnpm lint
```

To format and fix all lint issues automatically:

```sh
pnpm fix
```

## Publish releases

A maintainer publishes each release from a local machine:

```sh
bin/release-local
```

To see what a release would publish, without publishing, tagging or releasing:

```sh
bin/release-local --dry-run
```

It releases only from a clean `main` that matches `origin/main`.
It refuses a version whose `v<version>` tag already exists.
It runs `bin/check-local`, repeats the audit, and builds the package with `bin/prepare-npm-release`.
It publishes the packed archive to npm unless that version is already there.
It reads the npm token from the macOS Keychain and never writes it to a lasting file.
When npm asks for 2FA approval, it prints npm's approval URL and waits, with or without a terminal.
Then it pushes the annotated tag and creates the GitHub release from the `CHANGELOG.md` section.

Xquik is an independent third-party service. Not affiliated with X Corp. "Twitter" and "X" are trademarks of X Corp.
