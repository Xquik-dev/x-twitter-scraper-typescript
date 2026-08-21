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

Submit non-trivial changes through pull requests.

A person other than the author must approve each non-trivial change.

Sign every commit using the Developer Certificate of Origin:

```sh
git commit -s
```

Start with issues labeled `good first issue` when seeking a small task.

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

Run the reproducibility check before requesting review:

```sh
pnpm run check:reproducible
```

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

The automated release pipeline publishes changes to npm.

### Use the GitHub workflow

The [Publish npm workflow](https://github.com/Xquik-dev/x-twitter-scraper-typescript/actions/workflows/publish-npm.yml)
validates release tags, builds the package, signs its provenance, uploads release assets, and publishes through
npm trusted publishing. The release path uses short-lived identity tokens. It stores no npm token.

Xquik is an independent third-party service. Not affiliated with X Corp. "Twitter" and "X" are trademarks of X Corp.
