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

type AnalysisRequest =
  | XTwitterScraper.X.AnalysisBrandParams
  | XTwitterScraper.X.AnalysisClassifyParams
  | XTwitterScraper.X.AnalysisMarketSignalsParams
  | XTwitterScraper.X.AnalysisNewsParams
  | XTwitterScraper.X.AnalysisSentimentParams
  | XTwitterScraper.X.AnalysisViralScoreParams;

type AnalysisSource = 'threadOf' | 'repliesBy' | 'mediaBy' | 'likedBy' | 'usernames' | 'listIds' | 'queries';

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

  test('the 6 analysis methods send the thread, account, List and search sources', async () => {
    const { client, sent } = fixtureClient({ results: [], unanalyzed: [], unprocessed_ids: [] });

    await client.x.analysis.sentiment({ threadOf: '2102882545427714266' });
    await client.x.analysis.brand({ repliesBy: '@NASA' });
    await client.x.analysis.news({ mediaBy: 'https://x.com/NASA' });
    await client.x.analysis.marketSignals({ likedBy: '11348282' });
    await client.x.analysis.viralScore({ usernames: ['@NASA', 'SpaceX'], queries: ['Artemis lang:en'] });
    await client.x.analysis.classify({ listIds: ['4143408', 'https://x.com/i/lists/1234567'] });

    expect(await Promise.all(sent.map((request) => request.json()))).toEqual([
      { threadOf: '2102882545427714266' },
      { repliesBy: '@NASA' },
      { mediaBy: 'https://x.com/NASA' },
      { likedBy: '11348282' },
      { usernames: ['@NASA', 'SpaceX'], queries: ['Artemis lang:en'] },
      { listIds: ['4143408', 'https://x.com/i/lists/1234567'] },
    ]);
    expectTypeOf<AnalysisSource>().toExtend<keyof AnalysisRequest>();
  });
});
