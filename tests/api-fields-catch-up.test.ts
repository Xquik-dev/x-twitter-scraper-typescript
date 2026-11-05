// SPDX-FileCopyrightText: 2026 Xquik contributors
//
// SPDX-License-Identifier: Apache-2.0

import { fixtureClient } from './fixture-client';

describe('API fields added on 2026-11-04', () => {
  test('exportResults sends the account filters and the compare run', async () => {
    const { client, sent } = fixtureClient({});

    await client.extractions.exportResults('run-1', {
      format: 'csv',
      compare: 'run-0',
      change: 'removed',
      hasWebsite: true,
      hideFake: true,
      hideInactive: false,
      joinedSince: '2020-01-01',
      joinedUntil: '2024-01-01',
      location: 'Berlin',
    });

    const query = new URL(sent[0]!.url).searchParams;
    expect(Object.fromEntries(query)).toEqual({
      format: 'csv',
      compare: 'run-0',
      change: 'removed',
      hasWebsite: 'true',
      hideFake: 'true',
      hideInactive: 'false',
      joinedSince: '2020-01-01',
      joinedUntil: '2024-01-01',
      location: 'Berlin',
    });
  });

  test('search, run and estimateCost send textOnlyTerms', async () => {
    const { client, sent } = fixtureClient({ tweets: [], has_next_page: false, next_cursor: '' });

    await client.x.tweets.search({ q: 'launch', textOnlyTerms: 'rocket' });
    await client.extractions.run({
      toolType: 'tweet_search_extractor',
      searchQuery: 'launch',
      textOnlyTerms: 'rocket',
    });
    await client.extractions.estimateCost({
      toolType: 'tweet_search_extractor',
      searchQuery: 'launch',
      textOnlyTerms: 'rocket',
    });

    expect(new URL(sent[0]!.url).searchParams.get('textOnlyTerms')).toBe('rocket');
    expect(await sent[1]!.json()).toMatchObject({ textOnlyTerms: 'rocket' });
    expect(await sent[2]!.json()).toMatchObject({ textOnlyTerms: 'rocket' });
  });
});

describe('API fields added on 2026-11-05', () => {
  test('each AI analysis route sends analysis.images', async () => {
    const { client, sent } = fixtureClient({ results: [] });

    await client.x.analysis.sentiment({ tweetIds: ['1'], analysis: { images: false } });
    await client.x.analysis.brand({ tweetIds: ['1'], analysis: { images: false } });
    await client.x.analysis.news({ tweetIds: ['1'], analysis: { images: false } });
    await client.x.analysis.marketSignals({ tweetIds: ['1'], analysis: { images: false } });
    await client.x.analysis.viralScore({ tweetIds: ['1'], analysis: { images: false } });
    await client.x.analysis.classify({ tweetIds: ['1'], analysis: { images: true } });

    const bodies = await Promise.all(sent.map((request) => request.json()));
    expect(bodies).toMatchObject([
      { analysis: { images: false } },
      { analysis: { images: false } },
      { analysis: { images: false } },
      { analysis: { images: false } },
      { analysis: { images: false } },
      { analysis: { images: true } },
    ]);
  });
});
