// SPDX-FileCopyrightText: 2026 Xquik contributors
//
// SPDX-License-Identifier: Apache-2.0

import XTwitterScraper from 'x-twitter-scraper';
import { fixtureClient } from './fixture-client';

type AnalysisAnswer =
  | XTwitterScraper.X.AnalysisBrandResponse
  | XTwitterScraper.X.AnalysisClassifyResponse
  | XTwitterScraper.X.AnalysisMarketSignalsResponse
  | XTwitterScraper.X.AnalysisNewsResponse
  | XTwitterScraper.X.AnalysisSentimentResponse
  | XTwitterScraper.X.AnalysisViralScoreResponse;

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

  test('each analysis answer returns the IDs the time ran out for', async () => {
    const { client } = fixtureClient({ results: [], unanalyzed: [], unprocessed_ids: ['1234567892'] });

    const answer = await client.x.analysis.sentiment({ tweetIds: ['1234567891', '1234567892'] });

    expect(answer.unprocessed_ids).toEqual(['1234567892']);
    expectTypeOf<AnalysisAnswer['unprocessed_ids']>().toEqualTypeOf<Array<string>>();
  });
});
