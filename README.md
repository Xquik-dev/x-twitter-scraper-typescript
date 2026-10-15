# X API & Twitter API TypeScript SDK by Xquik

[![OpenSSF Best Practices](https://www.bestpractices.dev/projects/13740/badge)](https://www.bestpractices.dev/projects/13740)

[![NPM version](<https://img.shields.io/npm/v/x-twitter-scraper.svg?label=npm%20(stable)>)](https://npmjs.org/package/x-twitter-scraper) ![npm bundle size](https://img.shields.io/bundlephobia/minzip/x-twitter-scraper)

Use this X API & Twitter API SDK to work with X from TypeScript.
It works as a Twitter scraper & tweet scraper for search, profiles & followers.
Scrape Twitter timelines, lists, communities, Spaces & trends into typed results.
Manage media, webhooks, monitors & X automation with bundled agent Skills.
It provides a Twitter API alternative through documented Xquik REST routes.

Xquik is the world's fastest and cheapest X Twitter scraper service with the most complete X data.
Xquik charges only for delivered, unique, filter-matching results and never pads rows.

> Xquik is an independent third-party service. Not affiliated with X Corp.
> "Twitter" and "X" are trademarks of X Corp.

[TypeScript SDK guide](https://docs.xquik.com/sdks/typescript) | [API map](api.md) | [REST API](https://docs.xquik.com/api-reference/overview) | [Webhooks](https://docs.xquik.com/api-reference/webhooks/create) | [MCP guide](https://docs.xquik.com/mcp/overview)

<!-- trust:start -->

## Trust & usage

[![Twitter API package downloads](https://img.shields.io/endpoint?url=https%3A%2F%2Fxquik.com%2Fbadges%2Fdownloads.json)](https://xquik.com/trust#downloads)
[![Twitter scraper users on Apify](https://img.shields.io/endpoint?url=https%3A%2F%2Fxquik.com%2Fbadges%2Fapify-users.json)](https://apify.com/xquik)
[![Twitter scraper runs on Apify](https://img.shields.io/endpoint?url=https%3A%2F%2Fxquik.com%2Fbadges%2Fapify-runs.json)](https://apify.com/xquik)
[![Tweet scraper rating on Apify](https://img.shields.io/endpoint?url=https%3A%2F%2Fxquik.com%2Fbadges%2Fapify-rating.json)](https://apify.com/xquik/x-tweet-scraper/reviews)
[![Xquik Twitter API accounts](https://img.shields.io/endpoint?url=https%3A%2F%2Fxquik.com%2Fbadges%2Faccounts.json)](https://xquik.com/trust#accounts)
[![Twitter Skill installs](https://img.shields.io/endpoint?url=https%3A%2F%2Fxquik.com%2Fbadges%2Fskill-installs.json)](https://xquik.com/trust#skill-installs)
[![Xquik verified revenue on TrustMRR](https://img.shields.io/endpoint?url=https%3A%2F%2Fxquik.com%2Fbadges%2Frevenue.json)](https://trustmrr.com/startup/xquik)
[![Twitter API median response time](https://img.shields.io/endpoint?url=https%3A%2F%2Fxquik.com%2Fbadges%2Frest-p50.json)](https://xquik.com/trust#speed)
[![Xquik GitHub stars](https://img.shields.io/endpoint?url=https%3A%2F%2Fxquik.com%2Fbadges%2Fgithub-stars.json)](https://github.com/Xquik-dev)
[![x-twitter-scraper downloads on npm](https://img.shields.io/endpoint?url=https%3A%2F%2Fxquik.com%2Fbadges%2Fnpm-x-twitter-scraper.json)](https://www.npmjs.com/package/x-twitter-scraper)
[![OpenSSF Best Practices](https://www.bestpractices.dev/projects/13740/badge)](https://www.bestpractices.dev/projects/13740)

- 51,000+ downloads of Xquik's Twitter API packages on npm, PyPI, RubyGems, NuGet, Packagist & Terraform ([source](https://xquik.com/trust#downloads)) <!-- trust:downloads 51020 -->
- 7,800+ users of Xquik's Twitter scraper Actors on Apify ([source](https://apify.com/xquik)) <!-- trust:apify-users 7800 -->
- 5,700,000+ runs of Xquik's Twitter scraper Actors on Apify ([source](https://apify.com/xquik)) <!-- trust:apify-runs 5704701 -->
- 4.66 of 5 for the X Tweet Scraper from 16 Apify reviews ([source](https://apify.com/xquik/x-tweet-scraper/reviews)) <!-- trust:apify-rating 4.66 16 -->
- 3,900+ accounts on xquik.com ([source](https://xquik.com/trust#accounts)) <!-- trust:accounts 3924 -->
- 1,600+ installs of Xquik's Twitter Skills on skills.sh ([source](https://xquik.com/trust#skill-installs)) <!-- trust:skill-installs 1612 -->
- $38,000+ in revenue verified by TrustMRR ([source](https://trustmrr.com/startup/xquik)) <!-- trust:revenue 38115 -->
- 501 ms median REST API read time over the last 7 days ([source](https://xquik.com/trust#speed)) <!-- trust:rest-p50 501 -->
- 370+ GitHub stars across Xquik's repos ([source](https://github.com/Xquik-dev)) <!-- trust:github-stars 374 -->
- 5,900+ downloads of x-twitter-scraper on npm ([source](https://www.npmjs.com/package/x-twitter-scraper)) <!-- trust:npm-x-twitter-scraper 5975 -->
- This repo meets the OpenSSF Best Practices passing criteria ([source](https://www.bestpractices.dev/projects/13740)) <!-- trust:openssf-x-twitter-scraper-typescript 1 -->

Checked on 2026-10-15. See each number with its date & source on [xquik.com/trust](https://xquik.com/trust) or as [JSON](https://xquik.com/trust.json).

<!-- trust:end -->

## Pi coding agent package

Install the bundled Xquik Skills from npm.

```sh
pi install npm:x-twitter-scraper
```

Pi loads 3 packaged Skills.

- `x-twitter-scraper` for API and MCP integration.
- `xquik-social-research` for public X research.
- `xquik-account-automation` for approved connected-account actions.

Import the typed SDK from the same npm package.

## Common Twitter & X tasks

| Task                               | REST route                                    | Usage                                     |
| ---------------------------------- | --------------------------------------------- | ----------------------------------------- |
| Search tweets without the X API    | `GET /x/tweets/search`                        | Use keyword or advanced operator queries. |
| Read an X profile timeline         | `GET /x/users/{id}/tweets`                    | Paginate bounded results.                 |
| Scrape Twitter followers           | `GET /x/users/{id}/followers`                 | Use an extraction for complete datasets.  |
| Scrape following accounts          | `GET /x/users/{id}/following`                 | Use an extraction for complete datasets.  |
| Read a home timeline               | `GET /x/timeline`                             | Approve this private read.                |
| Read past trends of a place        | `GET /x/trends/history`                       | Pick a range & a step between lists.      |
| Read a Community Notes contributor | `GET /x/community-notes/contributors/{alias}` | List their notes & deleted notes.         |
| Export large X datasets            | `POST /extractions`                           | Poll status, then download results.       |
| Download or upload media           | `/x/media/*`                                  | Use typed file helpers.                   |
| Monitor an account                 | `POST /monitors`                              | Deliver events through HMAC webhooks.     |
| Run a giveaway draw                | `POST /draws`                                 | Confirm the tweet and entry rules.        |
| Post or reply                      | `POST /x/tweets`                              | Confirm the account and payload.          |

## AI agent workflows with MCP

Use the typed REST SDK in application code. Add `https://xquik.com/mcp` to MCP clients.
Follow the [MCP guide](https://docs.xquik.com/mcp/overview) for current authentication support.

## Package & registry trust

- [npm package `x-twitter-scraper`](https://www.npmjs.com/package/x-twitter-scraper)
- [Source in Xquik-dev/x-twitter-scraper-typescript](https://github.com/Xquik-dev/x-twitter-scraper-typescript)
- Apache-2.0 license for the SDK
- MIT license for the bundled Skills
- [Citation metadata in CITATION.cff](CITATION.cff)
- [Security boundary and reporting in SECURITY.md](SECURITY.md)
- [OpenSSF evidence and current limitations in OPENSSF.md](OPENSSF.md)

## Installation

The SDK requires TypeScript 4.9 or later.

```sh
npm install x-twitter-scraper
```

## Usage

See [api.md](api.md) for the complete API.

<!-- prettier-ignore -->
```js
import XTwitterScraper from 'x-twitter-scraper';

const client = new XTwitterScraper({
  apiKey: process.env['X_TWITTER_SCRAPER_API_KEY'], // Optional. The client reads this variable.
});

const response = await client.x.tweets.search({ q: 'from:elonmusk', limit: 10 });
```

### Request & response types

The package includes types for every request parameter and response field. Import them directly.

<!-- prettier-ignore -->
```ts
import XTwitterScraper from 'x-twitter-scraper';

const client = new XTwitterScraper({
  apiKey: process.env['X_TWITTER_SCRAPER_API_KEY'], // Optional. The client reads this variable.
});

const params: XTwitterScraper.X.TweetSearchParams = { q: 'from:elonmusk', limit: 10 };
const paginatedTweets: XTwitterScraper.PaginatedTweets = await client.x.tweets.search(params);
```

Editors show each method, parameter, and field description from its docstring.

### Guest wallet authentication

Guest wallet keys work through the public Bearer flow. Pass the key through the
`bearerToken` option, then poll status or create a confirmed top-up checkout.

```ts
const guestClient = new XTwitterScraper({
  bearerToken: process.env['XQUIK_GUEST_API_KEY'],
});

const wallet = await guestClient.guestWallets.retrieveStatus();
```

Keep guest keys out of source code, URLs, and logs.

## Streaming events

`client.events.stream()` yields each monitor event as it happens.

```ts
const stream = await client.events.stream();

for await (const event of stream) {
  console.log(event.type, event.id);
}
```

Pass `{ 'Last-Event-ID': '42' }` to resume after event 42.
Break out of the loop or call `stream.controller.abort()` to close the stream.

## File uploads

Pass file uploads in these forms.

- `File` (or an object with the same structure)
- a `fetch` `Response` (or an object with the same structure)
- an `fs.ReadStream`
- the return value of our `toFile` helper

```ts
import fs from 'fs';
import XTwitterScraper, { toFile } from 'x-twitter-scraper';

const client = new XTwitterScraper();

// Stream a local file with Node fs.
await client.x.media.upload({ account: '@elonmusk', file: fs.createReadStream('/path/to/file') });

// Pass a web File.
await client.x.media.upload({ account: '@elonmusk', file: new File(['my bytes'], 'file') });

// Pass a fetch Response.
await client.x.media.upload({ account: '@elonmusk', file: await fetch('https://somesite/file') });

// Convert bytes with toFile.
await client.x.media.upload({
  account: '@elonmusk',
  file: await toFile(Buffer.from('my bytes'), 'file'),
});
await client.x.media.upload({
  account: '@elonmusk',
  file: await toFile(new Uint8Array([0, 1, 2]), 'file'),
});
```

## Handling errors

The SDK throws an `APIError` subclass for connection failures and non-2xx responses.

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

| Status code | Error type                 |
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

Set `maxRetries` to change or disable retries.

<!-- prettier-ignore -->
```js
// Change the default for all requests.
const client = new XTwitterScraper({
  maxRetries: 0,
});

// Override one request.
await client.x.tweets.search({ q: 'from:elonmusk', limit: 10 }, {
  maxRetries: 5,
});
```

### Timeouts

Requests time out after 1 minute. Set a custom `timeout` when needed.

<!-- prettier-ignore -->
```ts
// Change the default for all requests.
const client = new XTwitterScraper({
  timeout: 20 * 1000,
});

// Override one request.
await client.x.tweets.search({ q: 'from:elonmusk', limit: 10 }, {
  timeout: 5 * 1000,
});
```

On timeout, the SDK throws an `APIConnectionTimeoutError`.

Timed-out requests follow the [default retry policy](#retries).

## Raw response data

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

## Logging

> [!IMPORTANT]
> Log messages are for debugging only. The format and content of log messages may change
> between releases.

### Log levels

Configure the log level in 2 ways.

1. Set the `X_TWITTER_SCRAPER_LOG` environment variable.
2. Set the `logLevel` client option. It overrides the environment variable.

```ts
import XTwitterScraper from 'x-twitter-scraper';

const client = new XTwitterScraper({
  logLevel: 'debug', // Show all log messages
});
```

These are the log levels, from most to least verbose.

- `'debug'` shows debug messages, info, warnings, and errors.
- `'info'` shows info messages, warnings, and errors.
- `'warn'` shows warnings and errors. It is the default.
- `'error'` shows only errors.
- `'off'` disables all logging.

At the `'debug'` level, the SDK logs every HTTP request and response, including headers and bodies.
It redacts some authentication headers, but request and response bodies may still show sensitive data.

### Custom logger

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

## Custom requests

The SDK types every documented endpoint, parameter, and response property.
Use its lower-level methods for undocumented API features.

### Undocumented endpoints

Use `client.get`, `client.post`, or another HTTP method for undocumented endpoints.
Client options, including retries, apply to these requests.

```ts
await client.post('/some/path', {
  body: { some_prop: 'foo' },
  query: { some_query_arg: 'bar' },
});
```

### Undocumented request params

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

### Undocumented response properties

Add `// @ts-expect-error` to the response object or cast it to the required type.
The SDK does not validate or remove extra API response properties.

## Custom fetch client

The SDK uses the global `fetch` function by default.

Polyfill the global to use another `fetch` implementation.

```ts
import fetch from 'my-fetch';

globalThis.fetch = fetch;
```

Or pass it to the client.

```ts
import XTwitterScraper from 'x-twitter-scraper';
import fetch from 'my-fetch';

const client = new XTwitterScraper({ fetch });
```

## Fetch options

Set `fetchOptions` on the client or request without replacing `fetch`. Request options take precedence.

```ts
import XTwitterScraper from 'x-twitter-scraper';

const client = new XTwitterScraper({
  fetchOptions: {
    // `RequestInit` options
  },
});
```

### Proxies

Add runtime-specific proxy settings through `fetchOptions`.

**Node** <sup>[[docs](https://github.com/nodejs/undici/blob/main/docs/docs/api/ProxyAgent.md#example---proxyagent-with-fetch)]</sup>

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

**Bun** <sup>[[docs](https://bun.sh/guides/http/proxy)]</sup>

```ts
import XTwitterScraper from 'x-twitter-scraper';

const client = new XTwitterScraper({
  fetchOptions: {
    proxy: 'http://localhost:8888',
  },
});
```

**Deno** <sup>[[docs](https://docs.deno.com/api/deno/~/Deno.createHttpClient)]</sup>

```ts
import XTwitterScraper from 'npm:x-twitter-scraper';

const httpClient = Deno.createHttpClient({ proxy: { url: 'http://localhost:8888' } });
const client = new XTwitterScraper({
  fetchOptions: {
    client: httpClient,
  },
});
```

## Semantic versioning

This package follows [SemVer](https://semver.org/spec/v2.0.0.html) with these exceptions.

1. Static type changes that preserve runtime behavior.
2. Changes to undocumented internals that remain technically public.
3. Changes unlikely to affect normal use.

Open an [issue](https://www.github.com/Xquik-dev/x-twitter-scraper-typescript/issues) with questions, bugs, or suggestions.

## Runtime support

The SDK supports these runtimes.

- Current Chrome, Firefox, Safari, Edge, and other web browsers.
- [Maintained Node.js](https://endoflife.date/nodejs) 20 LTS or later.
- Deno v1.28.0 or later.
- Bun 1.0 or later.
- Cloudflare Workers.
- Vercel Edge Runtime.
- Jest 28 or later with the `"node"` environment, not `"jsdom"`.
- Nitro v2.6 or later.

The SDK does not support React Native.

Request another runtime in a GitHub issue.

## More Xquik tools

- [X (Twitter) scraper API & Twitter MCP server](https://github.com/Xquik-dev/x-twitter-scraper) with REST, MCP & Skill setup.
- Twitter API SDKs for [Python](https://github.com/Xquik-dev/x-twitter-scraper-python), [Go](https://github.com/Xquik-dev/x-twitter-scraper-go), [Ruby](https://github.com/Xquik-dev/x-twitter-scraper-ruby), [Java](https://github.com/Xquik-dev/x-twitter-scraper-java), [Kotlin](https://github.com/Xquik-dev/x-twitter-scraper-kotlin), [C#](https://github.com/Xquik-dev/x-twitter-scraper-csharp) & [PHP](https://github.com/Xquik-dev/x-twitter-scraper-php).
- [Twitter CLI & X CLI](https://github.com/Xquik-dev/x-twitter-scraper-cli) for terminal workflows.
- [Twitter advanced search operators](https://github.com/Xquik-dev/x-twitter-advanced-search) with tested examples.
- [Xquik X API & Twitter scraper](https://xquik.com) and the [Twitter API documentation](https://docs.xquik.com/api-reference/overview).

## Contributing

See [the contributing documentation](./CONTRIBUTING.md).

Xquik is an independent third-party service. Not affiliated with X Corp. "Twitter" and "X" are trademarks of X Corp.
