// SPDX-FileCopyrightText: 2026 Xquik contributors
//
// SPDX-License-Identifier: Apache-2.0

import { fixtureClient } from './fixture-client';

describe('API fields added on 2026-11-10', () => {
  test('bookmarks.list and getHomeTimeline send pageSize', async () => {
    const { client, requests } = fixtureClient({ tweets: [], has_next_page: false, next_cursor: '' });

    await client.x.bookmarks.list({ pageSize: 50 });
    await client.x.getHomeTimeline({ pageSize: 100 });

    expect(requests).toEqual([
      'GET https://xquik.test/api/v1/x/bookmarks?pageSize=50',
      'GET https://xquik.test/api/v1/x/timeline?pageSize=100',
    ]);
  });

  test('media.download returns the posts with no media and the posts it could not read', async () => {
    const { client } = fixtureClient({ noMediaTweetIds: ['1234567893'], failedTweetIds: ['1234567894'] });

    const response = await client.x.media.download({ tweetIds: ['1234567893', '1234567894'] });

    expect(response.noMediaTweetIds).toEqual(['1234567893']);
    expect(response.failedTweetIds).toEqual(['1234567894']);
  });
});
