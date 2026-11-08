// SPDX-FileCopyrightText: 2026 Xquik contributors
//
// SPDX-License-Identifier: Apache-2.0

import type XTwitterScraper from 'x-twitter-scraper';
import { fixtureClient } from '../../../fixture-client';

const report: XTwitterScraper.X.ShadowbanReport = {
  username: 'NASA',
  userId: '11348282',
  account: 'active',
  checkedAt: '2026-11-03T02:15:00.000Z',
  overall: 'clear',
  checks: {
    account: {
      verdict: 'pass',
      reason: 'active',
      evidence: { profileUrl: 'https://x.com/NASA' },
    },
    search: {
      verdict: 'pass',
      reason: 'listed',
      evidence: {
        query: 'from:NASA',
        searchUrl: 'https://x.com/search?q=from%3ANASA&f=live',
        recentPostIds: ['2103610284464316469', '2103583087540003274'],
        foundPostIds: ['2103610284464316469'],
      },
    },
    suggestion: {
      verdict: 'fail',
      reason: 'not_suggested',
      evidence: { query: 'NASA', suggestedUsernames: ['NASAHubble', 'NASAEarth'] },
    },
    replies: {
      verdict: 'unknown',
      reason: 'more_replies',
      evidence: {
        replies: [
          {
            replyId: '2103589735449141451',
            replyUrl: 'https://x.com/i/status/2103589735449141451',
            parentId: '2102883223948628205',
            parentUrl: 'https://x.com/i/status/2102883223948628205',
            placement: 'more_replies',
          },
        ],
      },
    },
    replyLock: {
      verdict: 'unknown',
      reason: 'no_recent_replies',
      evidence: { checkedReplies: 0, shownReplies: 0 },
    },
    timeline: { verdict: 'pass', reason: 'visible', evidence: { postCount: 74486, timelinePosts: 20 } },
    engagement: {
      verdict: 'pass',
      reason: 'typical',
      evidence: { newestMedian: 4268, newestPosts: 5, earlierMedian: 2773, earlierPosts: 7 },
    },
    sensitive: { verdict: 'pass', reason: 'not_flagged', evidence: null },
    withheld: { verdict: 'pass', reason: 'none', evidence: { countries: [] } },
  },
};

const suspended: XTwitterScraper.X.ShadowbanReport = {
  username: 'gone',
  userId: null,
  account: 'suspended',
  checkedAt: '2026-11-03T02:15:00.000Z',
  overall: 'suspended',
  checks: {
    account: { verdict: 'fail', reason: 'suspended', evidence: { profileUrl: 'https://x.com/gone' } },
    search: { verdict: 'unknown', reason: 'suspended', evidence: null },
    suggestion: { verdict: 'unknown', reason: 'suspended', evidence: null },
    replies: { verdict: 'unknown', reason: 'suspended', evidence: null },
    replyLock: { verdict: 'unknown', reason: 'suspended', evidence: null },
    timeline: { verdict: 'unknown', reason: 'suspended', evidence: null },
    engagement: { verdict: 'unknown', reason: 'suspended', evidence: null },
    sensitive: { verdict: 'unknown', reason: 'suspended', evidence: null },
    withheld: { verdict: 'unknown', reason: 'suspended', evidence: null },
  },
};

describe('shadowban checks', () => {
  test('retrieveShadowban sends the user & field filters and reads each check', async () => {
    const { client, requests } = fixtureClient(report);

    const response = await client.x.users.retrieveShadowban('NASA', { fields: 'checks', omit: 'username' });

    expect(requests).toEqual([
      'GET https://xquik.test/api/v1/x/users/NASA/shadowban?fields=checks&omit=username',
    ]);
    expect(response.account).toBe('active');
    expect(response.overall).toBe('clear');
    expect(response.checks.engagement.evidence?.newestMedian).toBe(4268);
    expect(response.checks.withheld.evidence?.countries).toEqual([]);
    expect(response.checks.search.evidence?.foundPostIds).toEqual(['2103610284464316469']);
    expect(response.checks.suggestion.verdict).toBe('fail');
    expect(response.checks.replies.evidence?.replies.map((reply) => reply.placement)).toEqual([
      'more_replies',
    ]);
  });

  test('a suspended account carries evidence only for the account check', async () => {
    const { client, requests } = fixtureClient(suspended);

    const response = await client.x.users.retrieveShadowban('gone');

    expect(requests).toEqual(['GET https://xquik.test/api/v1/x/users/gone/shadowban']);
    expect(response.userId).toBeNull();
    expect(response.overall).toBe('suspended');
    expect(response.checks.account.evidence.profileUrl).toBe('https://x.com/gone');
    expect([response.checks.search, response.checks.suggestion, response.checks.replies]).toEqual([
      { verdict: 'unknown', reason: 'suspended', evidence: null },
      { verdict: 'unknown', reason: 'suspended', evidence: null },
      { verdict: 'unknown', reason: 'suspended', evidence: null },
    ]);
  });
});
