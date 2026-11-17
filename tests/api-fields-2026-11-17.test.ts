// SPDX-FileCopyrightText: 2026 Xquik contributors
//
// SPDX-License-Identifier: Apache-2.0

import XTwitterScraper from 'x-twitter-scraper';
import { fixtureClient } from './fixture-client';

describe('API fields added on 2026-11-17', () => {
  test('a tweets page and a users page say when X cut the list short', async () => {
    const { client } = fixtureClient({
      has_next_page: false,
      next_cursor: '',
      tweets: [],
      users: [],
      endReason: 'stalled',
    });

    const tweets = await client.x.users.retrieveTweets('nasa');
    const followers = await client.x.users.retrieveFollowers('nasa');

    expect([tweets.endReason, followers.endReason]).toEqual(['stalled', 'stalled']);
    expectTypeOf<XTwitterScraper.PaginatedTweets['endReason']>().toEqualTypeOf<'stalled' | undefined>();
    expectTypeOf<XTwitterScraper.PaginatedUsers['endReason']>().toEqualTypeOf<'stalled' | undefined>();
  });
});
