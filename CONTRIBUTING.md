## Setting up the environment

This repository uses [`pnpm`](https://pnpm.io/).
Other package managers may work but are not officially supported for development.

To set up the repository, run:

```sh
$ pnpm install
$ pnpm build
```

This will install all the required dependencies and build output files to `dist/`.

## Contribution Requirements

Follow the shared [Xquik contribution policy](https://github.com/Xquik-dev/.github/blob/main/CONTRIBUTING.md).

Submit non-trivial changes through pull requests.

A person other than the author must approve each non-trivial change.

Sign every commit using the Developer Certificate of Origin:

```sh
git commit -s
```

Start with issues labeled `good first issue` when seeking a small task.

## Modify or Add Code

Most SDK code is generated. Manual patches persist but may conflict with later generations.
The generator never changes `src/lib/` or `examples/`.

## Add and Run Examples

The generator leaves `examples/` unchanged. Edit or add files there.

```ts
// add an example to examples/<your-example>.ts

#!/usr/bin/env -S npm run tsn -T
…
```

```sh
$ chmod +x examples/<your-example>.ts
# run the example against your api
$ pnpm tsn -T examples/<your-example>.ts
```

## Using the repository from source

If you’d like to use the repository from source, you can either install from git or link to a cloned repository:

To install via git:

```sh
$ npm install git+ssh://git@github.com:Xquik-dev/x-twitter-scraper-typescript.git
```

Alternatively, to link a local copy of the repo:

```sh
# Clone
$ git clone https://www.github.com/Xquik-dev/x-twitter-scraper-typescript
$ cd x-twitter-scraper-typescript

# With yarn
$ yarn link
$ cd ../my-package
$ yarn link x-twitter-scraper

# With pnpm
$ pnpm link --global
$ cd ../my-package
$ pnpm link --global x-twitter-scraper
```

## Running tests

```sh
$ pnpm run test
```

Tests enforce 90% statement coverage and 80% branch coverage.

Add regression tests for every corrected defect.

Run the reproducibility check before requesting review:

```sh
$ pnpm run check:reproducible
```

## Linting and formatting

Use [Prettier](https://www.npmjs.com/package/prettier) and
[ESLint](https://www.npmjs.com/package/eslint) for formatting and linting.

To lint:

```sh
$ pnpm lint
```

To format and fix all lint issues automatically:

```sh
$ pnpm fix
```

## Publishing and releases

The automated release pipeline publishes changes to npm.

### Publish with a GitHub workflow

The [Publish npm workflow](https://github.com/Xquik-dev/x-twitter-scraper-typescript/actions/workflows/publish-npm.yml)
validates release tags, builds the package, signs its provenance, uploads release assets, and publishes through
npm trusted publishing. The release path uses short-lived identity tokens. It stores no npm token.

Xquik is an independent third-party service. Not affiliated with X Corp. "Twitter" and "X" are trademarks of X Corp.
