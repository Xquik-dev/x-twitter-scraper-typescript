## Set up the environment

This repository uses [`pnpm`](https://pnpm.io/).
Other package managers may work but are not officially supported for development.
The `packageManager` field in `package.json` pins the pnpm version, and pnpm 11.28.4 or newer switches to it on its own.
Older pnpm releases fail to start pnpm 12 on macOS and Windows, so upgrade pnpm first.

Install dependencies and build `dist/`.

```sh
pnpm install
pnpm build
```

The build and the type checks use TypeScript 7.
`pnpm build` compiles once for CommonJS and once for ES modules with `scripts/utils/compile-formats.cjs`.
TypeScript 7 has no compiler API yet.
ESLint and ts-node load the TypeScript 6.0 API from the `typescript` alias, as the TypeScript 7 release notes recommend.

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

Install directly from Git.

```sh
npm install git+ssh://git@github.com:Xquik-dev/x-twitter-scraper-typescript.git
```

Or link a local clone.

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

Run every repository check before requesting review.

```sh
bin/check-local
```

It first checks that the SDK covers the API, as [API coverage](#api-coverage) describes.
Then it installs dependencies from the lockfile and checks license notices with REUSE.
REUSE runs at a pinned version through `uv`. Install `uv` with `brew install uv`.
It audits dependencies, lints, builds, checks types, checks the reproducible build, and runs tests.
Last, it runs the CodeQL `security-extended` queries for JavaScript and TypeScript.
Any result fails the run, and so does any file that CodeQL cannot parse.
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

## API coverage

`bin/check-local` starts with `node scripts/utils/check-api-coverage.cjs`.
It compares every operation in the API spec with every request in `src/resources`.

- An operation is its method and its full path, such as `GET /api/v1/x/trends/history`.
  The spec side joins the path of the operation's server with the path key.
  Path parameter names do not matter, so `{id}` matches `${tweetID}`.
- The SDK side joins the path of `DEFAULT_BASE_URL` in `src/client.ts` with each request path.
  Write each request as `this._client.get('/path')` or ``this._client.get(path`/path/${id}`)``.
  The check fails on a request it cannot read and names its file and line.
- The check reads `https://xquik.com/openapi.json` by default.
  Set `XQUIK_OPENAPI_SPEC` to a local file or another URL of a JSON spec to check against it.

```sh
XQUIK_OPENAPI_SPEC=../openapi.json node scripts/utils/check-api-coverage.cjs
```

The check fails when the API has an operation that the SDK neither implements nor excludes.
Add each operation it names to the SDK.
An operation the SDK leaves out on purpose goes in `excluded-operations.json` with a reason.
The file holds a list of groups. Each group has a `reason` and at least 1 operation.
An operation appears at most once in the file.

```json
[
  {
    "reason": "Searches the Xquik docs at https://xquik.com/ask, outside the SDK base URL https://xquik.com/api/v1.",
    "operations": ["GET /ask", "POST /ask"]
  }
]
```

The check also fails when the file lists an operation that the API no longer has or the SDK already implements.
Remove that entry.
An SDK request that the spec lacks passes, such as `GET /api/v1/credits/topup/redirect`, which the public spec hides.

## Lint & format

Use [Prettier](https://www.npmjs.com/package/prettier) and
[ESLint](https://www.npmjs.com/package/eslint) for formatting and linting.

Lint with this command.

```sh
pnpm lint
```

Format and fix every lint issue with this command.

```sh
pnpm fix
```

## Publish releases

A maintainer publishes each release from a local machine.

```sh
bin/release-local
```

This command shows what a release would publish, without publishing, tagging or releasing.

```sh
bin/release-local --dry-run
```

It releases only from a clean `main` that matches `origin/main`.
It refuses a version whose `v<version>` tag already exists.
It runs `bin/check-local`, repeats the audit, and builds the package with `bin/prepare-npm-release`.
It publishes the packed archive to npm unless that version is already there.
It reads the npm token from the macOS Keychain and never writes it to a lasting file.
Set `NPM_KEYCHAIN_SERVICE` and `NPM_KEYCHAIN_ACCOUNT` to the Keychain item that holds the token.
The script stops with 1 line when either is unset. A dry run needs neither.
When npm asks for 2FA approval, it prints npm's approval URL and waits, with or without a terminal.
Then it pushes the annotated tag and creates the GitHub release from the `CHANGELOG.md` section.

Xquik is an independent third-party service. Not affiliated with X Corp. "Twitter" and "X" are trademarks of X Corp.
