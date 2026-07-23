# Changelog

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

Full Changelog: [v0.0.1...v0.1.0](https://github.com/Xquik-dev/x-twitter-scraper-typescript/compare/v0.0.1...v0.1.0)

### Features

* **api:** api update ([9d928b9](https://github.com/Xquik-dev/x-twitter-scraper-typescript/commit/9d928b92168e9e8711bd2b1d6922c6d22fc96616))
* **api:** api update ([1ba6110](https://github.com/Xquik-dev/x-twitter-scraper-typescript/commit/1ba61100f91a5e080b41bc85cd2bdcfd3dd1d25f))
* **api:** api update ([942874e](https://github.com/Xquik-dev/x-twitter-scraper-typescript/commit/942874ee1a2882fc7777c33b2ada87502cb16c5e))


### Chores

* update SDK settings ([690d665](https://github.com/Xquik-dev/x-twitter-scraper-typescript/commit/690d665d19fe7afd5cc7111dc3f0ba4568d15754))
* update SDK settings ([23f8e61](https://github.com/Xquik-dev/x-twitter-scraper-typescript/commit/23f8e61a83107471bdefe08050d320182103ac94))
