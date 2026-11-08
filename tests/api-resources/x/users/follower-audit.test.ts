// SPDX-FileCopyrightText: 2026 Xquik contributors
//
// SPDX-License-Identifier: Apache-2.0

import XTwitterScraper from 'x-twitter-scraper';
import { fixtureClient } from '../../../fixture-client';

const follower: XTwitterScraper.X.AuditedFollower = {
  id: '1850000000000000001',
  userName: 'orbit_fan_2026',
  name: 'Orbit Fan',
  class: 'likelyFake',
  score: 82,
  signals: ['default_picture', 'no_posts', 'new_account'],
  followers: 0,
  following: 4100,
  likes: 0,
  posts: 0,
  position: 0,
  joinedAtMs: 1793836800000,
};

const audit: XTwitterScraper.X.UserRetrieveFollowerAuditResponse = {
  audit: {
    account: {
      userId: '11348282',
      userName: 'NASA',
      followers: 89000000,
      following: 180,
      posts: 74486,
      postsPrivate: false,
      accountAgeDays: 6570,
      engagementRate: 0.0021,
      engagementPerView: 0.012,
      medianViews: 410000,
      postsPerDay: 9.4,
      topPostId: '2103610284464316469',
      averages: {
        likes: 4200,
        replies: 310,
        reposts: 820,
        quotes: 95,
        bookmarks: 260,
        views: 480000,
        engagements: 5425,
      },
      sample: { posts: 20, newestAt: '2026-11-07T21:00:00.000Z', oldestAt: '2026-11-05T09:00:00.000Z' },
    },
    coverage: { read: 2, total: 89000000, percent: 0 },
    quality: { grade: 'B', score: 74 },
    classes: [
      { class: 'likelyFake', count: 1, percent: 50 },
      { class: 'likelyReal', count: 1, percent: 50 },
    ],
    signals: [{ id: 'default_picture', count: 1, percent: 50, points: 20 }],
    arrivalBands: [{ from: 0, to: 2, read: 2, count: 1, percent: 50 }],
    cohorts: [{ weekStartMs: 1793664000000, count: 1, likelyFake: 1, percent: 50 }],
    languages: [{ value: 'en', count: 2, percent: 100 }],
    places: [{ value: 'US', count: 1, percent: 50 }],
    verified: { count: 1, percent: 50 },
    followers: [
      follower,
      {
        ...follower,
        id: '6253282',
        userName: 'XDevelopers',
        name: 'Developers',
        class: 'likelyReal',
        score: 4,
        signals: [],
        position: 1,
        owner: 'X',
      },
    ],
    topFollowers: [],
  },
};

describe('follower audit', () => {
  test('retrieveFollowerAudit sends limit and the field filters and reads the report', async () => {
    const { client, requests } = fixtureClient(audit);

    const response = await client.x.users.retrieveFollowerAudit('NASA', {
      limit: 2,
      fields: 'audit',
      omit: 'audit.followers.pictureUrl',
    });

    expect(requests).toEqual([
      'GET https://xquik.test/api/v1/x/users/NASA/follower-audit?limit=2&fields=audit&omit=audit.followers.pictureUrl',
    ]);
    expect(response.audit.quality).toEqual({ grade: 'B', score: 74 });
    expect(response.audit.account.userName).toBe('NASA');
    expect(response.audit.followers.map((row) => [row.position, row.class, row.owner])).toEqual([
      [0, 'likelyFake', undefined],
      [1, 'likelyReal', 'X'],
    ]);
    expect(response.audit.cohorts[0]?.likelyFake).toBe(1);
  });

  test('a follower class is 1 of the 5 the API names', () => {
    expectTypeOf<XTwitterScraper.X.FollowerClass>().toEqualTypeOf<
      'automated' | 'inactive' | 'likelyFake' | 'likelyReal' | 'tooNew'
    >();
    expectTypeOf<XTwitterScraper.X.FollowerAudit['account']>().toEqualTypeOf<
      XTwitterScraper.X.UserRetrieveInsightsResponse['insights']
    >();
  });
});
