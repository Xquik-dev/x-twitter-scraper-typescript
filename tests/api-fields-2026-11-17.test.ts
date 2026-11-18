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

  test('a batch user lookup splits the unavailable IDs by why X shows no account', async () => {
    const { client } = fixtureClient({
      users: [],
      has_next_page: false,
      next_cursor: '',
      requested_count: 3,
      processed_count: 3,
      returned_count: 0,
      unavailable_ids: ['1234567890', '1234567891', '1234567892'],
      not_found_ids: ['1234567890', '1234567892'],
      suspended_ids: ['1234567891'],
      failed_ids: [],
      unprocessed_ids: [],
    });

    const answer = await client.x.users.retrieveBatch({ ids: '1234567890,1234567891,1234567892' });

    expect(answer.not_found_ids).toEqual(['1234567890', '1234567892']);
    expect(answer.suspended_ids).toEqual(['1234567891']);
    type Answer = XTwitterScraper.X.UserRetrieveBatchResponse;
    expectTypeOf<Answer['not_found_ids']>().toEqualTypeOf<Array<string>>();
    expectTypeOf<Answer['suspended_ids']>().toEqualTypeOf<Array<string>>();
  });

  test('a batch tweets read splits the unavailable users into missing, suspended and protected', async () => {
    const { client } = fixtureClient({
      tweets: [],
      has_next_page: false,
      next_cursor: '',
      unavailable_ids: ['deleted', 'banned', 'locked'],
      not_found_ids: ['deleted'],
      suspended_ids: ['banned'],
      protected_ids: ['locked'],
      unprocessed_ids: [],
    });

    const answer = await client.x.users.retrieveBatchTweets({ usernames: 'deleted,banned,locked' });

    expect([answer.not_found_ids, answer.suspended_ids, answer.protected_ids]).toEqual([
      ['deleted'],
      ['banned'],
      ['locked'],
    ]);
    type Answer = XTwitterScraper.X.UserRetrieveBatchTweetsResponse;
    expectTypeOf<Answer['not_found_ids']>().toEqualTypeOf<Array<string>>();
    expectTypeOf<Answer['suspended_ids']>().toEqualTypeOf<Array<string>>();
    expectTypeOf<Answer['protected_ids']>().toEqualTypeOf<Array<string>>();
  });

  test('a follow removal of an unavailable account says why X shows no account', async () => {
    const removal = {
      id: '42',
      type: 'follower.removed',
      monitorId: '10',
      monitorType: 'account',
      occurredAt: '2026-11-17T23:45:00.000Z',
      data: { id: '2244994945', reason: 'unavailable', unavailableReason: 'suspended' },
    };
    const { client } = fixtureClient({ ...removal, events: [removal], hasMore: false });

    const page = await client.events.list();
    const event = await client.events.retrieve('42');

    expect([page.events[0]?.data, event.data]).toEqual([removal.data, removal.data]);
    expectTypeOf<XTwitterScraper.MonitorFollow['unavailableReason']>().toEqualTypeOf<
      'not_found' | 'suspended' | undefined
    >();
  });
});
