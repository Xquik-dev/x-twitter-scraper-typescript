// SPDX-FileCopyrightText: 2026 Xquik contributors
//
// SPDX-License-Identifier: Apache-2.0

import XTwitterScraper from 'x-twitter-scraper';
import { fixtureClient } from './fixture-client';

const post = {
  id: '2103610284464316469',
  text: 'Rust 2026 edition notes',
  createdAt: '2026-11-07T12:00:00.000Z',
  likeCount: 12,
  retweetCount: 3,
  replyCount: 1,
  quoteCount: 0,
  viewCount: 900,
  bookmarkCount: 2,
  author: { id: '11348282', username: 'rustlang', name: 'Rust Language', verified: false },
};

const topicPage = {
  has_next_page: true,
  next_cursor: 'c2',
  tweets: [{ ...post, topicScore: 0.92 }],
  topicFilter: {
    topic: 'the Rust programming language',
    question: 'Is this post about the Rust programming language?',
    cutoff: 0.5,
    checked: 20,
    kept: 1,
    unchecked: [{ id: '2103583087540003274', reason: 'no_text' }],
  },
};

const imageFilter = {
  imageShows: 'charts',
  question: 'Does a picture attached to this post show a chart or graph that plots data?',
  cutoff: 0.5,
  checked: 16,
  kept: 4,
  unchecked: [{ id: '1234567890', reason: 'no_safe_photos' }],
};

const imagePage = {
  has_next_page: false,
  next_cursor: '',
  tweets: [{ ...post, imageScore: 0.81 }],
  imageFilter,
};

const filters = { topic: 'the Rust programming language', imageShows: 'charts' };

describe('image and topic filters', () => {
  test('search and the 3 user timeline reads send topic and imageShows', async () => {
    const { client, sent } = fixtureClient(topicPage);

    await client.x.tweets.search({ q: 'rust', ...filters });
    await client.x.users.retrieveTweets('rustlang', filters);
    await client.x.users.retrieveReplies('rustlang', filters);
    await client.x.users.retrieveMedia('rustlang', filters);

    expect(sent.map((request) => Object.fromEntries(new URL(request.url).searchParams))).toEqual([
      { q: 'rust', ...filters },
      filters,
      filters,
      filters,
    ]);
  });

  test('a topic page holds topicFilter and each kept post its topicScore', async () => {
    const { client } = fixtureClient(topicPage);

    const page = await client.x.users.retrieveTweets('rustlang', { topic: filters.topic });

    expect('topicFilter' in page && page.topicFilter.kept).toBe(1);
    expect('topicFilter' in page && page.tweets.map((tweet) => tweet.topicScore)).toEqual([0.92]);
  });

  test('an image page holds imageFilter and each kept post its imageScore', async () => {
    const { client } = fixtureClient(imagePage);

    const page = await client.x.tweets.search({ q: 'rust', imageShows: 'charts' });

    expect('imageFilter' in page && page.imageFilter.unchecked).toEqual([
      { id: '1234567890', reason: 'no_safe_photos' },
    ]);
    expect('imageFilter' in page && page.tweets.map((tweet) => tweet.imageScore)).toEqual([0.81]);
  });

  test('extraction runs and estimates send topic and imageShows in the body', async () => {
    const { client, sent } = fixtureClient({});

    await client.extractions.run({ toolType: 'tweet_search_extractor', searchQuery: 'rust', topic: 'rust' });
    await client.extractions.estimateCost({
      toolType: 'tweet_search_extractor',
      searchQuery: 'rust',
      imageShows: 'charts',
    });

    expect(await sent[0]?.json()).toEqual({
      toolType: 'tweet_search_extractor',
      searchQuery: 'rust',
      topic: 'rust',
    });
    expect(await sent[1]?.json()).toEqual({
      toolType: 'tweet_search_extractor',
      searchQuery: 'rust',
      imageShows: 'charts',
    });
  });

  test('a media download sends imageShows and returns imageFilter', async () => {
    const { client, sent } = fixtureClient({ tweetId: '1234567890', imageFilter });

    const response = await client.x.media.download({ tweetIds: ['1234567890'], imageShows: 'charts' });

    expect(await sent[0]?.json()).toEqual({ tweetIds: ['1234567890'], imageShows: 'charts' });
    expect(response.imageFilter?.kept).toBe(4);
  });

  test('a filtered page still reads as a plain page', () => {
    expectTypeOf<XTwitterScraper.FilterablePaginatedTweets>().toExtend<XTwitterScraper.PaginatedTweets>();
    expectTypeOf<XTwitterScraper.X.TweetSearchResponse>().toExtend<XTwitterScraper.PaginatedTweets>();
    expectTypeOf<XTwitterScraper.TopicFilterSummary['cutoff']>().toEqualTypeOf<0.5>();
  });

  test('an extraction job returns the filter it ran', () => {
    expectTypeOf<XTwitterScraper.ExtractionJob['topicFilter']>().toEqualTypeOf<
      XTwitterScraper.TopicFilterSummary | undefined
    >();
    expectTypeOf<XTwitterScraper.ExtractionJob['imageFilter']>().toEqualTypeOf<
      XTwitterScraper.ImageFilterSummary | undefined
    >();
  });
});
