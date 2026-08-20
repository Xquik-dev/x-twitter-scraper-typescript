# Xquik TypeScript SDK: Twitter Search, Followers & X Automation

[![OpenSSF Best Practices](https://www.bestpractices.dev/projects/13740/badge)](https://www.bestpractices.dev/projects/13740)

[![NPM version](<https://img.shields.io/npm/v/x-twitter-scraper.svg?label=npm%20(stable)>)](https://npmjs.org/package/x-twitter-scraper) ![npm bundle size](https://img.shields.io/bundlephobia/minzip/x-twitter-scraper)

Use the Xquik TypeScript SDK for Twitter search, timelines, profiles & followers.
Manage media, webhooks, MCP & X automation with generated types and agent Skills.
It provides a Twitter API alternative through documented Xquik REST routes.

[TypeScript SDK Guide](https://docs.xquik.com/sdks/typescript) | [API Map](api.md) | [REST API](https://docs.xquik.com/api-reference/overview) | [Webhooks](https://docs.xquik.com/api-reference/webhooks/create) | [MCP Guide](https://docs.xquik.com/mcp/overview)

[Stainless](https://www.stainless.com/) generates this SDK.

## Pi Coding Agent Package

Install the bundled Xquik Skills directly from npm:

```sh
pi install npm:x-twitter-scraper
```

Pi loads both packaged Skills. Import the typed SDK from the same npm package.

## Common Twitter & X Tasks

Map each task to its REST route.

| Task                            | REST Route                    | Usage                                     |
| ------------------------------- | ----------------------------- | ----------------------------------------- |
| Search tweets without the X API | `GET /x/tweets/search`        | Use keyword or advanced operator queries. |
| Read an X profile timeline      | `GET /x/users/{id}/tweets`    | Paginate bounded results.                 |
| Scrape Twitter followers        | `GET /x/users/{id}/followers` | Use an extraction for complete datasets.  |
| Scrape following accounts       | `GET /x/users/{id}/following` | Use an extraction for complete datasets.  |
| Read a home timeline            | `GET /x/timeline`             | Approve this private read.                |
| Export large X datasets         | `POST /extractions`           | Poll status, then download results.       |
| Download or upload media        | `/x/media/*`                  | Use typed file helpers.                   |
| Monitor an account              | `POST /monitors`              | Deliver events through HMAC webhooks.     |
| Run a giveaway draw             | `POST /draws`                 | Confirm the tweet and entry rules.        |
| Post or reply                   | `POST /x/tweets`              | Confirm the account and payload.          |

## AI Agent Workflows With MCP

Use the typed REST SDK in application code. Add `https://xquik.com/mcp` to MCP clients.
Follow the [MCP guide](https://docs.xquik.com/mcp/overview) for current authentication support.

## Package & Registry Trust

- Package: [npm `x-twitter-scraper`](https://www.npmjs.com/package/x-twitter-scraper)
- Source: [Xquik-dev/x-twitter-scraper-typescript](https://github.com/Xquik-dev/x-twitter-scraper-typescript)
- SDK license: Apache-2.0
- Bundled Skill license: MIT
- Citation metadata: [CITATION.cff](CITATION.cff)
- Security boundary and reporting: [SECURITY.md](SECURITY.md)
- OpenSSF evidence and current limitations: [OPENSSF.md](OPENSSF.md)

## Installation

```sh
npm install x-twitter-scraper
```

## Usage

See [api.md](api.md) for the complete API.

<!-- prettier-ignore -->
```js
import XTwitterScraper from 'x-twitter-scraper';

const client = new XTwitterScraper({
  apiKey: process.env['X_TWITTER_SCRAPER_API_KEY'], // This is the default and can be omitted
});

const response = await client.x.tweets.search({ q: 'from:elonmusk', limit: 10 });
```

### Request & Response Types

The package includes types for every request parameter and response field. Import them directly:

<!-- prettier-ignore -->
```ts
import XTwitterScraper from 'x-twitter-scraper';

const client = new XTwitterScraper({
  apiKey: process.env['X_TWITTER_SCRAPER_API_KEY'], // This is the default and can be omitted
});

const params: XTwitterScraper.X.TweetSearchParams = { q: 'from:elonmusk', limit: 10 };
const paginatedTweets: XTwitterScraper.PaginatedTweets = await client.x.tweets.search(params);
```

Editors show each method, parameter, and field description from its docstring.

### Guest Wallet Authentication

Guest wallet keys work through the public Bearer flow. Pass the key through the
`bearerToken` option, then poll status or create a confirmed top-up checkout.

```ts
const guestClient = new XTwitterScraper({
  bearerToken: process.env['XQUIK_GUEST_API_KEY'],
});

const wallet = await guestClient.guestWallets.retrieveStatus();
```

Keep guest keys out of source code, URLs, and logs.

## File Uploads

Pass file uploads in these forms:

- `File` (or an object with the same structure)
- a `fetch` `Response` (or an object with the same structure)
- an `fs.ReadStream`
- the return value of our `toFile` helper

```ts
import fs from 'fs';
import XTwitterScraper, { toFile } from 'x-twitter-scraper';

const client = new XTwitterScraper();

// Stream a local file with Node fs:
await client.x.media.upload({ account: '@elonmusk', file: fs.createReadStream('/path/to/file') });

// Pass a web File:
await client.x.media.upload({ account: '@elonmusk', file: new File(['my bytes'], 'file') });

// Pass a fetch Response:
await client.x.media.upload({ account: '@elonmusk', file: await fetch('https://somesite/file') });

// Convert bytes with toFile:
await client.x.media.upload({
  account: '@elonmusk',
  file: await toFile(Buffer.from('my bytes'), 'file'),
});
await client.x.media.upload({
  account: '@elonmusk',
  file: await toFile(new Uint8Array([0, 1, 2]), 'file'),
});
```

## Handling Errors

The SDK throws an `APIError` subclass for connection failures and non-2xx responses:

<!-- prettier-ignore -->
```ts
const paginatedTweets = await client.x.tweets
  .search({ q: 'from:elonmusk', limit: 10 })
  .catch(async (err) => {
    if (err instanceof XTwitterScraper.APIError) {
      console.log(err.status); // 400
      console.log(err.name); // BadRequestError
      console.log(err.headers); // {server: 'nginx', ...}
    } else {
      throw err;
    }
  });
```

The SDK uses these error classes:

| Status Code | Error Type                 |
| ----------- | -------------------------- |
| 400         | `BadRequestError`          |
| 401         | `AuthenticationError`      |
| 403         | `PermissionDeniedError`    |
| 404         | `NotFoundError`            |
| 422         | `UnprocessableEntityError` |
| 429         | `RateLimitError`           |
| >=500       | `InternalServerError`      |
| N/A         | `APIConnectionError`       |

### Retries

The SDK retries connection errors and HTTP 408, 409, 429, and 5xx responses.
It uses exponential backoff and attempts 2 retries by default.

Set `maxRetries` to change or disable retries:

<!-- prettier-ignore -->
```js
// Configure the default for all requests:
const client = new XTwitterScraper({
  maxRetries: 0, // default is 2
});

// Or, configure per-request:
await client.x.tweets.search({ q: 'from:elonmusk', limit: 10 }, {
  maxRetries: 5,
});
```

### Timeouts

Requests time out after 1 minute. Set a custom `timeout` when needed:

<!-- prettier-ignore -->
```ts
// Configure the default for all requests:
const client = new XTwitterScraper({
  timeout: 20 * 1000, // 20 seconds (default is 1 minute)
});

// Override per-request:
await client.x.tweets.search({ q: 'from:elonmusk', limit: 10 }, {
  timeout: 5 * 1000,
});
```

On timeout, an `APIConnectionTimeoutError` is thrown.

Timed-out requests follow the [default retry policy](#retries).

## Advanced Usage

### Accessing Raw Response Data

Call `.asResponse()` on any returned `APIPromise` to access the raw `fetch()` response.
It returns after receiving successful headers without consuming the body.
Then parse or stream the body.

Call `.withResponse()` to receive the raw response and parsed data together.
This method consumes and parses the body before returning.

<!-- prettier-ignore -->
```ts
const client = new XTwitterScraper();

const response = await client.x.tweets.search({ q: 'from:elonmusk', limit: 10 }).asResponse();
console.log(response.headers.get('X-My-Header'));
console.log(response.statusText); // access the underlying Response object

const { data: paginatedTweets, response: raw } = await client.x.tweets
  .search({ q: 'from:elonmusk', limit: 10 })
  .withResponse();
console.log(raw.headers.get('X-My-Header'));
console.log(paginatedTweets.has_next_page);
```

### Logging

> [!IMPORTANT]
> All log messages are intended for debugging only. The format and content of log messages
> may change between releases.

#### Log levels

The log level can be configured in two ways:

1. Via the `X_TWITTER_SCRAPER_LOG` environment variable
2. Using the `logLevel` client option (overrides the environment variable if set)

```ts
import XTwitterScraper from 'x-twitter-scraper';

const client = new XTwitterScraper({
  logLevel: 'debug', // Show all log messages
});
```

Available log levels, from most to least verbose:

- `'debug'` - Show debug messages, info, warnings, and errors
- `'info'` - Show info messages, warnings, and errors
- `'warn'` - Show warnings and errors (default)
- `'error'` - Show only errors
- `'off'` - Disable all logging

At the `'debug'` level, all HTTP requests and responses are logged, including headers and bodies.
Some authentication-related headers are redacted, but sensitive data in request and response bodies
may still be visible.

#### Custom logger

The SDK logs through `globalThis.console` by default. Pass a custom logger instead.
It supports [pino](https://www.npmjs.com/package/pino), [winston](https://www.npmjs.com/package/winston), [bunyan](https://www.npmjs.com/package/bunyan), [consola](https://www.npmjs.com/package/consola), [signale](https://www.npmjs.com/package/signale), and [@std/log](https://jsr.io/@std/log).

The `logLevel` option still controls custom logger output.

```ts
import XTwitterScraper from 'x-twitter-scraper';
import pino from 'pino';

const logger = pino();

const client = new XTwitterScraper({
  logger: logger.child({ name: 'XTwitterScraper' }),
  logLevel: 'debug', // Send all messages to pino, allowing it to filter
});
```

### Making custom/undocumented requests

The SDK types every documented endpoint, parameter, and response property.
Use its lower-level methods for undocumented API features.

#### Undocumented endpoints

Use `client.get`, `client.post`, or another HTTP method for undocumented endpoints.
Client options, including retries, apply to these requests.

```ts
await client.post('/some/path', {
  body: { some_prop: 'foo' },
  query: { some_query_arg: 'bar' },
});
```

#### Undocumented request params

Add `// @ts-expect-error` to an undocumented parameter.
The SDK sends extra values without runtime type validation.

```ts
client.x.tweets.search({
  // ...
  // @ts-expect-error baz is not yet public
  baz: 'undocumented option',
});
```

The SDK sends extra `GET` parameters in the query.
It sends all other extra parameters in the body.

Send explicit extra arguments through the `query`, `body`, and `headers` options.

#### Undocumented response properties

Add `// @ts-expect-error` to the response object or cast it to the required type.
The SDK does not validate or remove extra API response properties.

### Customizing the fetch client

The SDK uses the global `fetch` function by default.

Polyfill the global to use another `fetch` implementation:

```ts
import fetch from 'my-fetch';

globalThis.fetch = fetch;
```

Or pass it to the client:

```ts
import XTwitterScraper from 'x-twitter-scraper';
import fetch from 'my-fetch';

const client = new XTwitterScraper({ fetch });
```

### Fetch options

Set `fetchOptions` on the client or request without replacing `fetch`. Request options take precedence.

```ts
import XTwitterScraper from 'x-twitter-scraper';

const client = new XTwitterScraper({
  fetchOptions: {
    // `RequestInit` options
  },
});
```

#### Configuring proxies

Add runtime-specific proxy settings through `fetchOptions`:

<img src="https://raw.githubusercontent.com/stainless-api/sdk-assets/refs/heads/main/node.svg" align="top" width="18" height="21"> **Node** <sup>[[docs](https://github.com/nodejs/undici/blob/main/docs/docs/api/ProxyAgent.md#example---proxyagent-with-fetch)]</sup>

```ts
import XTwitterScraper from 'x-twitter-scraper';
import * as undici from 'undici';

const proxyAgent = new undici.ProxyAgent('http://localhost:8888');
const client = new XTwitterScraper({
  fetchOptions: {
    dispatcher: proxyAgent,
  },
});
```

<img src="https://raw.githubusercontent.com/stainless-api/sdk-assets/refs/heads/main/bun.svg" align="top" width="18" height="21"> **Bun** <sup>[[docs](https://bun.sh/guides/http/proxy)]</sup>

```ts
import XTwitterScraper from 'x-twitter-scraper';

const client = new XTwitterScraper({
  fetchOptions: {
    proxy: 'http://localhost:8888',
  },
});
```

<img src="https://raw.githubusercontent.com/stainless-api/sdk-assets/refs/heads/main/deno.svg" align="top" width="18" height="21"> **Deno** <sup>[[docs](https://docs.deno.com/api/deno/~/Deno.createHttpClient)]</sup>

```ts
import XTwitterScraper from 'npm:x-twitter-scraper';

const httpClient = Deno.createHttpClient({ proxy: { url: 'http://localhost:8888' } });
const client = new XTwitterScraper({
  fetchOptions: {
    client: httpClient,
  },
});
```

## Semantic Versioning

This package follows [SemVer](https://semver.org/spec/v2.0.0.html) with these exceptions:

1. Static type changes that preserve runtime behavior.
2. Changes to undocumented internals that remain technically public.
3. Changes unlikely to affect normal use.

Open an [issue](https://www.github.com/Xquik-dev/x-twitter-scraper-typescript/issues) with questions, bugs, or suggestions.

## Requirements

Requires TypeScript 4.9 or later.

Supports these runtimes:

- Web browsers (Up-to-date Chrome, Firefox, Safari, Edge, and more)
- Node.js 20 LTS or later ([non-EOL](https://endoflife.date/nodejs)) versions.
- Deno v1.28.0 or higher.
- Bun 1.0 or later.
- Cloudflare Workers.
- Vercel Edge Runtime.
- Jest 28 or greater with the `"node"` environment (`"jsdom"` is not supported at this time).
- Nitro v2.6 or greater.

React Native is not supported.

Request another runtime in a GitHub issue.

## Contributing

See [the contributing documentation](./CONTRIBUTING.md).

Xquik is an independent third-party service. Not affiliated with X Corp. "Twitter" and "X" are trademarks of X Corp.
