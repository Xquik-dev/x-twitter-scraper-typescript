// SPDX-FileCopyrightText: 2026 Xquik contributors
//
// SPDX-License-Identifier: Apache-2.0

import XTwitterScraper from 'x-twitter-scraper';
import { fixtureClient } from './fixture-client';

type WriteHeaders = { 'Idempotency-Key': string; Prefer?: string };

const writes: ReadonlyArray<
  readonly [string, (client: XTwitterScraper, headers: WriteHeaders) => Promise<unknown>]
> = [
  ['POST /x/tweets', (client, headers) => client.x.tweets.create({ account: '@a', text: 'hi', ...headers })],
  ['DELETE /x/tweets/1', (client, headers) => client.x.tweets.delete('1', { account: '@a', ...headers })],
  [
    'POST /x/tweets/1/like',
    (client, headers) => client.x.tweets.like.create('1', { account: '@a', ...headers }),
  ],
  [
    'DELETE /x/tweets/1/like',
    (client, headers) => client.x.tweets.like.delete('1', { account: '@a', ...headers }),
  ],
  [
    'POST /x/tweets/1/retweet',
    (client, headers) => client.x.tweets.retweet.create('1', { account: '@a', ...headers }),
  ],
  [
    'DELETE /x/tweets/1/retweet',
    (client, headers) => client.x.tweets.retweet.delete('1', { account: '@a', ...headers }),
  ],
  [
    'POST /x/users/1/follow',
    (client, headers) => client.x.users.follow.create('1', { account: '@a', ...headers }),
  ],
  [
    'DELETE /x/users/1/follow',
    (client, headers) => client.x.users.follow.deleteAll('1', { account: '@a', ...headers }),
  ],
  [
    'POST /x/users/1/remove-follower',
    (client, headers) => client.x.users.removeFollower('1', { account: '@a', ...headers }),
  ],
  ['POST /x/dm/1', (client, headers) => client.x.dm.send('1', { account: '@a', text: 'hi', ...headers })],
  [
    'DELETE /x/dm/1/messages/2',
    (client, headers) => client.x.dm.deleteMessage('2', { userId: '1', account: '@a', ...headers }),
  ],
  [
    'POST /x/media',
    (client, headers) =>
      client.x.media.upload({ account: '@a', url: 'https://example.com/a.png', ...headers }),
  ],
  [
    'PATCH /x/profile',
    (client, headers) => client.x.profile.update({ account: '@a', name: 'A', ...headers }),
  ],
  [
    'PATCH /x/profile/avatar',
    (client, headers) =>
      client.x.profile.updateAvatar({ account: '@a', url: 'https://example.com/a.png', ...headers }),
  ],
  [
    'PATCH /x/profile/banner',
    (client, headers) =>
      client.x.profile.updateBanner({ account: '@a', url: 'https://example.com/b.png', ...headers }),
  ],
  [
    'POST /x/communities',
    (client, headers) => client.x.communities.create({ account: '@a', name: 'A', ...headers }),
  ],
  [
    'DELETE /x/communities/1',
    (client, headers) => client.x.communities.delete('1', { account: '@a', ...headers }),
  ],
  [
    'POST /x/communities/1/join',
    (client, headers) => client.x.communities.join.create('1', { account: '@a', ...headers }),
  ],
  [
    'DELETE /x/communities/1/join',
    (client, headers) => client.x.communities.join.deleteAll('1', { account: '@a', ...headers }),
  ],
];

describe('write Prefer header', () => {
  test.each(writes)('%s sends Prefer as a header', async (route, write) => {
    const { client, sent } = fixtureClient({});

    await write(client, { 'Idempotency-Key': 'key-1', Prefer: 'wait=50' });

    expect(`${sent[0]!.method} ${new URL(sent[0]!.url).pathname}`).toBe(route.replace(' ', ' /api/v1'));
    expect(sent[0]!.headers.get('prefer')).toBe('wait=50');
    expect(sent[0]!.headers.get('idempotency-key')).toBe('key-1');
    expect(await sent[0]!.clone().text()).not.toContain('wait=50');
  });

  test.each(writes)('%s sends no Prefer header when unset', async (_route, write) => {
    const { client, sent } = fixtureClient({});

    await write(client, { 'Idempotency-Key': 'key-1' });

    expect(sent[0]!.headers.has('prefer')).toBe(false);
  });
});
