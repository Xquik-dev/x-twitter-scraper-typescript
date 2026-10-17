# Changelog

## Unreleased

### BREAKING CHANGES

* Callers now pass request options as the 2nd argument to `bulkRetry`, for example `bulkRetry({}, { timeout })`.

### Features

* Bulk retry can target specific accounts with `accountIds`.
* Embedded parent, quoted and retweeted posts carry every tweet field and the author.
* User identity verification adds optional `overrideVerifiedYear`, the year X shows as the start of verification in place of `verifiedSinceMsec`.

## 0.16.0 (2026-10-15)

[Full changelog from v0.15.0 to v0.16.0](https://github.com/Xquik-dev/x-twitter-scraper-typescript/compare/v0.15.0...v0.16.0)

### Features

* Monitors, webhooks and events take the follow event types `follower.added`, `follower.removed`, `profile.followers.changed` and `profile.following.changed`.
* Event data adds the shared `MonitorFollow` type with `followedAt`, `followedAtExact` and `reason`. Profile changes add `change`, and their values can be counts.
* User profiles add `profilePictureOriginal` and `redirectsToUsername`. Community member previews, job accounts, broadcasters, Space participants, search suggestions and Article authors add `profilePictureOriginal`.
* Mentions in tombstone and interstitial text add `screenName` and `text`.
* Paused account monitors can report `insufficient_credits`. Keyword monitors add `pausedAt` and `pausedReason`.
* `account.updateLocale()`, `drafts.create()` and `webhooks.create()` return `ignoredFields`. `drafts.create()` returns `DraftCreateResponse`, which is `DraftDetail` with that field.
* `x.media.upload()`, `x.profile.updateAvatar()` and `x.profile.updateBanner()` take a `file` upload. `x.media.upload()` also takes `is_long_video`, and `url` is optional on all 3.
* `support.tickets.create()` and `reply()` take up to 4 `attachments`.
* Relationship pages add the shared `UserListPage` type with `scanLimit`. `x.tweets.getReplies()` adds `partialBefore`.

### Bug fixes

* A multipart array repeats its field name, as the API reads it, instead of adding `[]` to it.
* Coverage pages mark `has_next_page` and `next_cursor` required, and reply pages mark `tweets` required, because the API always sends them.
* The compose multiplier type takes the text the API sends now and keeps the old text.

### Documentation

* The 8 deprecated filters on replies, likes, media and mentions say the API ignores them on those routes.

### Chores

* `bin/check-local` runs an API fields check after API coverage. It fails when a request or response field of an implemented operation differs from the API spec, unless `accepted-field-differences.json` lists it with a reason.

## 0.15.0 (2026-10-15)

[Full changelog from v0.14.0 to v0.15.0](https://github.com/Xquik-dev/x-twitter-scraper-typescript/compare/v0.14.0...v0.15.0)

### Features

* `x.getTrends()` takes `at` to read the stored trend list nearest a past time. Its response type adds `capturedAt` and `requestedAt`.
* `x.spaces.search()` takes `Live` and `Upcoming` as `queryType`. They read X's own Spaces search for Spaces on air now or scheduled.

## 0.14.0 (2026-10-15)

[Full changelog from v0.13.3 to v0.14.0](https://github.com/Xquik-dev/x-twitter-scraper-typescript/compare/v0.13.3...v0.14.0)

### Features

The SDK now covers 180 operations of the current API spec. These methods are new.

* `x.getTrendsHistory()` reads the trend lists X showed in a place over a range of time, stored every 5 minutes since 2026-10-13.
* `x.getNewsStoryVersions()` lists every version X wrote of a news story, oldest first.
* `x.communityNotes.retrieveContributor()` reads a contributor's note & rating counts. `listContributorNotes()` lists their notes with the posts they are on. `listContributorDeletedNotes()` lists the notes they deleted.

## 0.13.3 (2026-10-14)

[Full changelog from v0.13.2 to v0.13.3](https://github.com/Xquik-dev/x-twitter-scraper-typescript/compare/v0.13.2...v0.13.3)

### Documentation

* The README uses sentence case headings, active voice and whole sentences. Its facts, links and legal lines stay the same.

## 0.13.2 (2026-10-14)

[Full changelog from v0.13.1 to v0.13.2](https://github.com/Xquik-dev/x-twitter-scraper-typescript/compare/v0.13.1...v0.13.2)

### Documentation

* The 3 bundled Skills and their references have no colon or semicolon in any sentence.
* `api.md`, the contributing guide and the security policy follow the same rule.

### Chores

* The package builds and checks its types with TypeScript 7.

## 0.13.1 (2026-10-13)

[Full changelog from v0.13.0 to v0.13.1](https://github.com/Xquik-dev/x-twitter-scraper-typescript/compare/v0.13.0...v0.13.1)

### Documentation

* The README title is now "X API & Twitter API TypeScript SDK by Xquik".
* The README says near the top what Xquik is, how it bills and that it is not affiliated with X Corp.
* README sentences that introduce code now end with a full stop.

### Chores

* Source files no longer carry the code generator's comment.
* The prefix of the idempotency key that the client can generate is now `xquik-node-retry-`. The client never sends that key by default, so no request changes.

## 0.13.0 (2026-10-13)

Full Changelog: [v0.12.4...v0.13.0](https://github.com/Xquik-dev/x-twitter-scraper-typescript/compare/v0.12.4...v0.13.0)

### Features

The SDK now covers 175 operations of the current API spec. These methods are new:

* Events: `events.stream()` streams monitor events as server-sent events.
* Extractions: `extractions.cancel()` cancels an extraction.
* Webhooks: `webhooks.createTelegramLink()` returns a link that connects a Telegram chat.
* X: `x.autocompleteSearch()`, `x.getHashflags()`, `x.getTrendLocations()` and `x.searchPlaces()` read search suggestions, hashflags, trend locations and places.
* Analysis: `x.analysis.brand()`, `classify()`, `marketSignals()`, `news()`, `sentiment()` and `viralScore()` analyze posts with AI.
* Tweets: `x.tweets.checkRepost()`, `embed()`, `getHiddenReplies()`, `getInsights()`, `getRetweeterIds()`, `getSubtitles()`, `listTop()`, `resolveLinks()` and `translate()` read more about tweets.
* Users: `x.users.retrieveAffiliates()`, `retrieveArticles()`, `retrieveBatchTweets()`, `retrieveFollowerIds()`, `retrieveFollowingIds()`, `retrieveHighlights()`, `retrieveInsights()`, `retrieveListMemberships()`, `retrieveLists()`, `retrieveLive()`, `retrieveSimilar()`, `retrieveSubscriptions()` and `translateBio()` read more about users.
* Jobs: `x.jobs.retrieve()`, `listLocations()` and `search()` read public X job listings.
* Direct messages: `x.dm.deleteMessage()` deletes a DM from the account's side.
* Communities: `x.communities.find()`, `listPopular()`, `listSuggested()`, `listTopics()` and `searchMembers()` find communities and members. `x.communities.media.list()` lists a community's media tweets.
* Lists: `x.lists.retrieve()` and `retrieveSearch()` read and search X Lists.
* Broadcasts: `x.broadcasts.retrieve()` reads an X broadcast.
* Spaces: `x.spaces.retrieve()`, `retrieveReplay()` and `search()` read and search X Spaces.

### Changes

* Existing methods take the current parameters, response fields, prices and descriptions. Read methods accept `fields` and `omit`.
* 12 methods now take an optional params object before the request options. See [Upgrading from 0.12](#upgrading-from-012).
* `x.users.retrieveBatch()` params are now optional. Existing calls keep working.
* `x.accountConnectionChallenges.submit()` returns a renewed challenge or the account. `extractions.run()` returns a dry-run estimate or the accepted job.
* `minFaves` stays as a deprecated alias of `minLikes`. Filters the spec dropped from replies, likes, media and mentions reads stay as deprecated fields.
* `XAccount` and `XAccountDetail` drop a field the API no longer returns.

### Upgrading from 0.12

Calls that pass no request options need no change. If you pass request options to one of these 12 methods, pass `{}` or your params first:

```ts
// 0.12.x
const monitors = await client.monitors.list({ timeout: 5_000 });
const tweet = await client.x.tweets.retrieve('1234567890', { maxRetries: 0 });

// 0.13.0
const monitors = await client.monitors.list({}, { timeout: 5_000 });
const tweet = await client.x.tweets.retrieve('1234567890', {}, { maxRetries: 0 });

// 0.13.0, with the new params
const page = await client.monitors.list({ limit: 50 }, { timeout: 5_000 });
```

TypeScript reports the old call as an error, so the compiler finds every call to change.

| Method | 0.12.x | 0.13.0 |
| --- | --- | --- |
| `monitors.list()` | `list(options?)` | `list(query?, options?)` |
| `monitors.keywords.list()` | `list(options?)` | `list(query?, options?)` |
| `styles.list()` | `list(options?)` | `list(query?, options?)` |
| `webhooks.list()` | `list(options?)` | `list(query?, options?)` |
| `webhooks.listDeliveries()` | `listDeliveries(id, options?)` | `listDeliveries(id, query?, options?)` |
| `support.tickets.list()` | `list(options?)` | `list(query?, options?)` |
| `x.accounts.list()` | `list(options?)` | `list(query?, options?)` |
| `x.bookmarks.retrieveFolders()` | `retrieveFolders(options?)` | `retrieveFolders(query?, options?)` |
| `x.communities.retrieveInfo()` | `retrieveInfo(id, options?)` | `retrieveInfo(id, query?, options?)` |
| `x.getArticle()` | `getArticle(tweetID, options?)` | `getArticle(tweetID, query?, options?)` |
| `x.tweets.retrieve()` | `retrieve(id, options?)` | `retrieve(id, query?, options?)` |
| `x.users.retrieve()` | `retrieve(id, options?)` | `retrieve(id, query?, options?)` |

## 0.12.4 (2026-08-21)

Full Changelog: [v0.12.3...v0.12.4](https://github.com/Xquik-dev/x-twitter-scraper-typescript/compare/v0.12.3...v0.12.4)

### Documentation

* Tighten SDK and packaged Skill copy.

## 0.12.3 (2026-08-21)

Full Changelog: [v0.12.2...v0.12.3](https://github.com/Xquik-dev/x-twitter-scraper-typescript/compare/v0.12.2...v0.12.3)

### Documentation

* remove obsolete operation-named MCP type pages
* align bundled MCP guidance with the 2-tool hosted server
* simplify SDK and contribution copy

## 0.12.2 (2026-08-20)

Full Changelog: [v0.12.1...v0.12.2](https://github.com/Xquik-dev/x-twitter-scraper-typescript/compare/v0.12.1...v0.12.2)

### Documentation

* refine public TypeScript SDK text ([#59](https://github.com/Xquik-dev/x-twitter-scraper-typescript/issues/59)) ([ef08541](https://github.com/Xquik-dev/x-twitter-scraper-typescript/commit/ef085416c97354686f981f2c1257702689f4e79f))

## 0.12.1 (2026-08-18)

Full Changelog: [v0.12.0...v0.12.1](https://github.com/Xquik-dev/x-twitter-scraper-typescript/compare/v0.12.0...v0.12.1)

### Chores

* refresh compatible TypeScript tooling ([#56](https://github.com/Xquik-dev/x-twitter-scraper-typescript/issues/56)) ([d21067f](https://github.com/Xquik-dev/x-twitter-scraper-typescript/commit/d21067f13335c3294041fc21c841cf032ebec99e))

## 0.12.0 (2026-08-12)

Full Changelog: [v0.11.0...v0.12.0](https://github.com/Xquik-dev/x-twitter-scraper-typescript/compare/v0.11.0...v0.12.0)

### Features

* **api:** sync public contracts ([6ee4ea5](https://github.com/Xquik-dev/x-twitter-scraper-typescript/commit/6ee4ea56d3691d6d28622c45bb0e771e0ca0af67))

## 0.11.0 (2026-08-11)

Full Changelog: [v0.10.0...v0.11.0](https://github.com/Xquik-dev/x-twitter-scraper-typescript/compare/v0.10.0...v0.11.0)

### Features

* **api:** api update ([97691ba](https://github.com/Xquik-dev/x-twitter-scraper-typescript/commit/97691ba89f505ea4ed1815e0ec0d367f952e03a7))

## 0.10.0 (2026-08-11)

Full Changelog: [v0.9.0...v0.10.0](https://github.com/Xquik-dev/x-twitter-scraper-typescript/compare/v0.9.0...v0.10.0)

### Features

* **api:** api update ([f947f38](https://github.com/Xquik-dev/x-twitter-scraper-typescript/commit/f947f38644ae806c6e144adf522c0f1e22014cd3))

## 0.9.0 (2026-08-11)

Full Changelog: [v0.8.4...v0.9.0](https://github.com/Xquik-dev/x-twitter-scraper-typescript/compare/v0.8.4...v0.9.0)

### Features

* **api:** api update ([e991b5d](https://github.com/Xquik-dev/x-twitter-scraper-typescript/commit/e991b5dccb5947344e040da0f9cfcebbeb9e124a))

## 0.8.4 (2026-08-11)

Full Changelog: [v0.8.3...v0.8.4](https://github.com/Xquik-dev/x-twitter-scraper-typescript/compare/v0.8.3...v0.8.4)

### Bug Fixes

* target repository for release asset uploads ([#50](https://github.com/Xquik-dev/x-twitter-scraper-typescript/issues/50)) ([afc1b32](https://github.com/Xquik-dev/x-twitter-scraper-typescript/commit/afc1b326f738e4013f16cc9477a8ebe8316000cb))

## 0.8.3 (2026-08-11)

Full Changelog: [v0.8.2...v0.8.3](https://github.com/Xquik-dev/x-twitter-scraper-typescript/compare/v0.8.2...v0.8.3)

### Chores

* **deps:** bump pnpm/action-setup from 6.0.9 to 6.0.10 ([#48](https://github.com/Xquik-dev/x-twitter-scraper-typescript/issues/48)) ([923c673](https://github.com/Xquik-dev/x-twitter-scraper-typescript/commit/923c6739dbcdfc47ce2ad9c561363792146f173f))

## 0.8.2 (2026-08-11)

Full Changelog: [v0.8.1...v0.8.2](https://github.com/Xquik-dev/x-twitter-scraper-typescript/compare/v0.8.1...v0.8.2)

### Chores

* **deps:** bump ossf/scorecard-action from 2.4.3 to 2.4.4 ([#33](https://github.com/Xquik-dev/x-twitter-scraper-typescript/issues/33)) ([3eda594](https://github.com/Xquik-dev/x-twitter-scraper-typescript/commit/3eda594f4649f5046aaf8f9f6bfd7bd30ae9a066))

## 0.8.1 (2026-08-03)

Full Changelog: [v0.8.0...v0.8.1](https://github.com/Xquik-dev/x-twitter-scraper-typescript/compare/v0.8.0...v0.8.1)

## 0.8.0 (2026-07-31)

Full Changelog: [v0.7.1...v0.8.0](https://github.com/Xquik-dev/x-twitter-scraper-typescript/compare/v0.7.1...v0.8.0)

### Features

* **api:** align reply extraction contracts ([#29](https://github.com/Xquik-dev/x-twitter-scraper-typescript/issues/29)) ([986132c](https://github.com/Xquik-dev/x-twitter-scraper-typescript/commit/986132c28a0059bde23d727c323b99fec6ef4a60))

## 0.7.1 (2026-07-30)

Full Changelog: [v0.7.0...v0.7.1](https://github.com/Xquik-dev/x-twitter-scraper-typescript/compare/v0.7.0...v0.7.1)

### Documentation

* refresh bundled Skill audit evidence ([821b5c2](https://github.com/Xquik-dev/x-twitter-scraper-typescript/commit/821b5c29f987822970505e4ede777fc81fabaf4f))
* sync MCP 2026 Skill ([db5ba8d](https://github.com/Xquik-dev/x-twitter-scraper-typescript/commit/db5ba8de038019e8d020510c2f7398d90a8ec767))

## 0.7.0 (2026-07-29)

Full Changelog: [v0.6.2...v0.7.0](https://github.com/Xquik-dev/x-twitter-scraper-typescript/compare/v0.6.2...v0.7.0)

### Features

* **api:** api update ([88d6bd0](https://github.com/Xquik-dev/x-twitter-scraper-typescript/commit/88d6bd0144e12dbe9137181104795e0cd26cb44e))
* **api:** api update ([8dd7565](https://github.com/Xquik-dev/x-twitter-scraper-typescript/commit/8dd7565b670085b6ad7c09fc6dbcae0352aba9b7))

## 0.6.2 (2026-07-24)

Full Changelog: [v0.6.1...v0.6.2](https://github.com/Xquik-dev/x-twitter-scraper-typescript/compare/v0.6.1...v0.6.2)

## 0.6.1 (2026-07-24)

Full Changelog: [v0.6.0...v0.6.1](https://github.com/Xquik-dev/x-twitter-scraper-typescript/compare/v0.6.0...v0.6.1)

### Chores

* add per-file license evidence ([f212f91](https://github.com/Xquik-dev/x-twitter-scraper-typescript/commit/f212f915fc75595d1f404bd65abb8a189ea1ba4e))
* enforce OpenSSF Gold quality gates ([a89c2b2](https://github.com/Xquik-dev/x-twitter-scraper-typescript/commit/a89c2b2d1ad3ffc0286d14506986525559bba7d7))


### Documentation

* clarify repository discovery ([4d847a9](https://github.com/Xquik-dev/x-twitter-scraper-typescript/commit/4d847a9dfdc07433cca2ee584e0d118091c4ac3c))

## 0.6.0 (2026-07-23)

Full Changelog: [v0.5.2...v0.6.0](https://github.com/Xquik-dev/x-twitter-scraper-typescript/compare/v0.5.2...v0.6.0)

### Features

* bundle Xquik Skills for Pi ([ab5118d](https://github.com/Xquik-dev/x-twitter-scraper-typescript/commit/ab5118db657bffb27f1041e68969ae70fd2e2b16))

## 0.5.2 (2026-07-23)

Full Changelog: [v0.5.1...v0.5.2](https://github.com/Xquik-dev/x-twitter-scraper-typescript/compare/v0.5.1...v0.5.2)

### Documentation

* map common X data tasks ([#11](https://github.com/Xquik-dev/x-twitter-scraper-typescript/issues/11)) ([f4fa511](https://github.com/Xquik-dev/x-twitter-scraper-typescript/commit/f4fa5119c650a2ce80681af2a5a8555f1879e897))

## 0.5.1 (2026-07-22)

Full Changelog: [v0.5.0...v0.5.1](https://github.com/Xquik-dev/x-twitter-scraper-typescript/compare/v0.5.0...v0.5.1)

### Chores

* sync generated SDK contracts ([ff8612e](https://github.com/Xquik-dev/x-twitter-scraper-typescript/commit/ff8612e3b474a71aabae2f709ae93a487d5ad69d))
* verify final public contract ([bcd7c6a](https://github.com/Xquik-dev/x-twitter-scraper-typescript/commit/bcd7c6adecf0e4f1dd42025a3c9615c3abcd4223))

## 0.5.0 (2026-07-22)

Full Changelog: [v0.4.1...v0.5.0](https://github.com/Xquik-dev/x-twitter-scraper-typescript/compare/v0.4.1...v0.5.0)

### Features

* **api:** propagate durable write actions ([0835f87](https://github.com/Xquik-dev/x-twitter-scraper-typescript/commit/0835f87e0edba954fb8750309b513c0816d501bc))
* **api:** propagate production write-action contract ([ad78ad8](https://github.com/Xquik-dev/x-twitter-scraper-typescript/commit/ad78ad8e0451978401b84f08ce4642b63f40f6e8))
* **api:** propagate production write-action contract ([ec2b71f](https://github.com/Xquik-dev/x-twitter-scraper-typescript/commit/ec2b71f72d487ab00c8c834d2127925872eb5641))
* **stlc:** configurable CI runner and private-production-repo support in workflow templates ([d42ba4e](https://github.com/Xquik-dev/x-twitter-scraper-typescript/commit/d42ba4e6e0447d9e8874675e11295c0bf67d2ca5))
* **stlc:** configurable CI runner and private-production-repo support in workflow templates ([6b97180](https://github.com/Xquik-dev/x-twitter-scraper-typescript/commit/6b97180dc5ede2286094d7dc4dd99e75a6b4235f))

## 0.4.0 (2026-07-14)

Full Changelog: [v0.3.3...v0.4.0](https://github.com/Xquik-dev/x-twitter-scraper-typescript/compare/v0.3.3...v0.4.0)

### Features

* expand the generated SDK to the finalized 122-operation API contract
* add guest wallet creation, Bearer-authenticated status, and top-up methods
* add keyword monitor management, balance checkout status, webhook resume, write action status, account connection challenge, follower removal, and user replies methods

### Security

* remove browser session cookie authentication from the SDK
* keep authentication headers redacted from debug logs
* remove sensitive implementation and exact internal usage details from public comments

### Bug Fixes

* accept guest wallet credentials through the documented `bearerToken` client option
* activate generated resource request tests with a local deterministic mock transport

### BREAKING CHANGES

* remove `client.apiKeys.create`, `client.apiKeys.list`, and `client.apiKeys.revoke`
* remove the session-only `client.credits.quickTopupBalance` method
* remove the stale empty `Bot` resource

## 0.3.3 (2026-05-10)

Full Changelog: [v0.3.2...v0.3.3](https://github.com/Xquik-dev/x-twitter-scraper-typescript/compare/v0.3.2...v0.3.3)

### Bug Fixes

* include bug tracker metadata in the npm package

## 0.3.2 (2026-05-05)

Full Changelog: [v0.3.1...v0.3.2](https://github.com/Xquik-dev/x-twitter-scraper-typescript/compare/v0.3.1...v0.3.2)

### Bug Fixes

* remove stale integrations resource from the TypeScript SDK package

## 0.3.1 (2026-05-05)

Full Changelog: [v0.3.0...v0.3.1](https://github.com/Xquik-dev/x-twitter-scraper-typescript/compare/v0.3.0...v0.3.1)

### Chores

* improve npm package discoverability metadata

## 0.3.0 (2026-04-25)

Full Changelog: [v0.2.1...v0.3.0](https://github.com/Xquik-dev/x-twitter-scraper-typescript/compare/v0.2.1...v0.3.0)

### Features

* **api:** add SearchTweet & UserProfile shared models
* **api:** getTrends now accepts query params
* **api:** api updates (parity with Python/Go/Ruby/PHP/C# 0.4.0)


### Bug Fixes

* escape ampersand in OpenAPI summaries for C# XML docs


### Chores

* **internal:** more robust bootstrap script
* wire production_repo for all targets
* sync repo with latest OpenAPI spec


### BREAKING CHANGES

* Removed `Integrations` resource (7 endpoints) - migrate to `Webhooks`
* Removed `Bot` resource - feature retired

## 0.2.1 (2026-04-08)

Full Changelog: [v0.2.0...v0.2.1](https://github.com/Xquik-dev/x-twitter-scraper-typescript/compare/v0.2.0...v0.2.1)

### Chores

* update SDK settings ([3f979af](https://github.com/Xquik-dev/x-twitter-scraper-typescript/commit/3f979af582573782a430731b2d763170763cc523))
* update SDK settings ([4b1bec4](https://github.com/Xquik-dev/x-twitter-scraper-typescript/commit/4b1bec4cf92cbd37f536614efaf6d4700933976b))

## 0.2.0 (2026-04-08)

Full Changelog: [v0.1.0...v0.2.0](https://github.com/Xquik-dev/x-twitter-scraper-typescript/compare/v0.1.0...v0.2.0)

### Features

* **api:** api update ([fae8804](https://github.com/Xquik-dev/x-twitter-scraper-typescript/commit/fae880426c77da6f2a32ccacd10db702c4c9b7f2))
* **api:** api update ([2c6e492](https://github.com/Xquik-dev/x-twitter-scraper-typescript/commit/2c6e49289f73254286420f9e7920e99e0cedf1c3))
* **api:** api update ([fc066b7](https://github.com/Xquik-dev/x-twitter-scraper-typescript/commit/fc066b7fd9135cd4d50ec6495ede330a35442a67))
* **api:** api update ([c0e9c8f](https://github.com/Xquik-dev/x-twitter-scraper-typescript/commit/c0e9c8fc051bc86850207edfce410ef96ae2ae7e))
* **api:** api update ([2412960](https://github.com/Xquik-dev/x-twitter-scraper-typescript/commit/24129601f912008c3651fdbd0a34e5ae507f2eeb))
* **api:** api update ([bfb0ba8](https://github.com/Xquik-dev/x-twitter-scraper-typescript/commit/bfb0ba8dbc1d7dbbf57b481ad7d767bec1ef5e58))
* **api:** api update ([f352b9b](https://github.com/Xquik-dev/x-twitter-scraper-typescript/commit/f352b9b61d6685347ce8fb4603f1ee1bddedbb00))
* **api:** api update ([e37efbb](https://github.com/Xquik-dev/x-twitter-scraper-typescript/commit/e37efbb9bb2c86ba898f6bbcdb97c769d3ae5272))
* **api:** api update ([659d54c](https://github.com/Xquik-dev/x-twitter-scraper-typescript/commit/659d54c17641ac59f4fd5e456a1cb38618344076))


### Chores

* update SDK settings ([850ee50](https://github.com/Xquik-dev/x-twitter-scraper-typescript/commit/850ee5040c1e838e56a4dad2150f281d7d8b967b))
* update SDK settings ([b9324fd](https://github.com/Xquik-dev/x-twitter-scraper-typescript/commit/b9324fd6b20e25d1cc7df53abda2f076ba99718b))

## 0.1.0 (2026-03-30)

### Features

* **api:** api update ([9d928b9](https://github.com/Xquik-dev/x-twitter-scraper-typescript/commit/9d928b92168e9e8711bd2b1d6922c6d22fc96616))
* **api:** api update ([1ba6110](https://github.com/Xquik-dev/x-twitter-scraper-typescript/commit/1ba61100f91a5e080b41bc85cd2bdcfd3dd1d25f))
* **api:** api update ([942874e](https://github.com/Xquik-dev/x-twitter-scraper-typescript/commit/942874ee1a2882fc7777c33b2ada87502cb16c5e))


### Chores

* update SDK settings ([690d665](https://github.com/Xquik-dev/x-twitter-scraper-typescript/commit/690d665d19fe7afd5cc7111dc3f0ba4568d15754))
* update SDK settings ([23f8e61](https://github.com/Xquik-dev/x-twitter-scraper-typescript/commit/23f8e61a83107471bdefe08050d320182103ac94))
