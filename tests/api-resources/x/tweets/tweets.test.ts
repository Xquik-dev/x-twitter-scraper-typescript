// SPDX-FileCopyrightText: 2026 Xquik contributors
//
// SPDX-License-Identifier: Apache-2.0

// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import XTwitterScraper from 'x-twitter-scraper';

const client = new XTwitterScraper({
  apiKey: 'My API Key',
  bearerToken: 'My Bearer Token',
  baseURL: process.env['TEST_API_BASE_URL'] ?? 'http://127.0.0.1:4010',
});

describe('resource tweets', () => {
  test('create: only required params', async () => {
    const responsePromise = client.x.tweets.create({
      account: '@elonmusk',
      'Idempotency-Key': 'Idempotency-Key',
    });
    const rawResponse = await responsePromise.asResponse();
    expect(rawResponse).toBeInstanceOf(Response);
    const response = await responsePromise;
    expect(response).not.toBeInstanceOf(Response);
    const dataAndResponse = await responsePromise.withResponse();
    expect(dataAndResponse.data).toBe(response);
    expect(dataAndResponse.response).toBe(rawResponse);
  });

  test('create: required and optional params', async () => {
    const response = await client.x.tweets.create({
      account: '@elonmusk',
      'Idempotency-Key': 'Idempotency-Key',
      community_id: '1500000000000000000',
      is_note_tweet: false,
      media: ['https://example.com/video.mp4'],
      reply_to_tweet_id: '1234567890',
      text: 'Just launched our new feature!',
    });
  });

  test('retrieve', async () => {
    const responsePromise = client.x.tweets.retrieve('id');
    const rawResponse = await responsePromise.asResponse();
    expect(rawResponse).toBeInstanceOf(Response);
    const response = await responsePromise;
    expect(response).not.toBeInstanceOf(Response);
    const dataAndResponse = await responsePromise.withResponse();
    expect(dataAndResponse.data).toBe(response);
    expect(dataAndResponse.response).toBe(rawResponse);
  });

  test('list: only required params', async () => {
    const responsePromise = client.x.tweets.list({ ids: 'ids' });
    const rawResponse = await responsePromise.asResponse();
    expect(rawResponse).toBeInstanceOf(Response);
    const response = await responsePromise;
    expect(response).not.toBeInstanceOf(Response);
    const dataAndResponse = await responsePromise.withResponse();
    expect(dataAndResponse.data).toBe(response);
    expect(dataAndResponse.response).toBe(rawResponse);
  });

  test('list: required and optional params', async () => {
    const response = await client.x.tweets.list({ ids: 'ids' });
  });

  test('delete: only required params', async () => {
    const responsePromise = client.x.tweets.delete('id', {
      account: '@elonmusk',
      'Idempotency-Key': 'Idempotency-Key',
    });
    const rawResponse = await responsePromise.asResponse();
    expect(rawResponse).toBeInstanceOf(Response);
    const response = await responsePromise;
    expect(response).not.toBeInstanceOf(Response);
    const dataAndResponse = await responsePromise.withResponse();
    expect(dataAndResponse.data).toBe(response);
    expect(dataAndResponse.response).toBe(rawResponse);
  });

  test('delete: required and optional params', async () => {
    const response = await client.x.tweets.delete('id', {
      account: '@elonmusk',
      'Idempotency-Key': 'Idempotency-Key',
    });
  });

  test('getFavoriters', async () => {
    const responsePromise = client.x.tweets.getFavoriters('id');
    const rawResponse = await responsePromise.asResponse();
    expect(rawResponse).toBeInstanceOf(Response);
    const response = await responsePromise;
    expect(response).not.toBeInstanceOf(Response);
    const dataAndResponse = await responsePromise.withResponse();
    expect(dataAndResponse.data).toBe(response);
    expect(dataAndResponse.response).toBe(rawResponse);
  });

  test('getFavoriters: request options and params are passed correctly', async () => {
    // ensure the request options are being passed correctly by passing an invalid HTTP method in order to cause an error
    await expect(
      client.x.tweets.getFavoriters(
        'id',
        { cursor: 'cursor', pageSize: 20 },
        { path: '/_stainless_unknown_path' },
      ),
    ).rejects.toThrow(XTwitterScraper.NotFoundError);
  });

  test('getQuotes', async () => {
    const responsePromise = client.x.tweets.getQuotes('id');
    const rawResponse = await responsePromise.asResponse();
    expect(rawResponse).toBeInstanceOf(Response);
    const response = await responsePromise;
    expect(response).not.toBeInstanceOf(Response);
    const dataAndResponse = await responsePromise.withResponse();
    expect(dataAndResponse.data).toBe(response);
    expect(dataAndResponse.response).toBe(rawResponse);
  });

  test('getQuotes: request options and params are passed correctly', async () => {
    // ensure the request options are being passed correctly by passing an invalid HTTP method in order to cause an error
    await expect(
      client.x.tweets.getQuotes(
        'id',
        {
          anyWords: 'anyWords',
          cashtags: 'cashtags',
          conversationId: 'conversationId',
          cursor: 'cursor',
          exactPhrase: 'exactPhrase',
          excludeWords: 'excludeWords',
          fromUser: 'fromUser',
          hashtags: 'hashtags',
          includeReplies: true,
          inReplyToTweetId: 'inReplyToTweetId',
          language: 'language',
          mediaType: 'images',
          mentioning: 'mentioning',
          minFaves: 0,
          minQuotes: 0,
          minReplies: 0,
          minRetweets: 0,
          pageSize: 1,
          quotes: 'include',
          quotesOfTweetId: 'quotesOfTweetId',
          replies: 'include',
          retweets: 'include',
          retweetsOfTweetId: 'retweetsOfTweetId',
          sinceDate: '2019-12-27',
          sinceTime: 'sinceTime',
          toUser: 'toUser',
          untilDate: '2019-12-27',
          untilTime: 'untilTime',
          url: 'url',
          verifiedOnly: true,
        },
        { path: '/_stainless_unknown_path' },
      ),
    ).rejects.toThrow(XTwitterScraper.NotFoundError);
  });

  test('getReplies', async () => {
    const responsePromise = client.x.tweets.getReplies('id');
    const rawResponse = await responsePromise.asResponse();
    expect(rawResponse).toBeInstanceOf(Response);
    const response = await responsePromise;
    expect(response).not.toBeInstanceOf(Response);
    const dataAndResponse = await responsePromise.withResponse();
    expect(dataAndResponse.data).toBe(response);
    expect(dataAndResponse.response).toBe(rawResponse);
  });

  test('getReplies: request options and params are passed correctly', async () => {
    // ensure the request options are being passed correctly by passing an invalid HTTP method in order to cause an error
    await expect(
      client.x.tweets.getReplies(
        'id',
        {
          anyWords: 'anyWords',
          cashtags: 'cashtags',
          conversationId: 'conversationId',
          cursor: 'cursor',
          exactPhrase: 'exactPhrase',
          excludeWords: 'excludeWords',
          fromUser: 'fromUser',
          hashtags: 'hashtags',
          inReplyToTweetId: 'inReplyToTweetId',
          language: 'language',
          mediaType: 'images',
          mentioning: 'mentioning',
          minFaves: 0,
          minQuotes: 0,
          minReplies: 0,
          minRetweets: 0,
          pageSize: 1,
          quotes: 'include',
          quotesOfTweetId: 'quotesOfTweetId',
          replies: 'include',
          retweets: 'include',
          retweetsOfTweetId: 'retweetsOfTweetId',
          sinceDate: '2019-12-27',
          sinceTime: 'sinceTime',
          toUser: 'toUser',
          untilDate: '2019-12-27',
          untilTime: 'untilTime',
          url: 'url',
          verifiedOnly: true,
        },
        { path: '/_stainless_unknown_path' },
      ),
    ).rejects.toThrow(XTwitterScraper.NotFoundError);
  });

  test('getRetweeters', async () => {
    const responsePromise = client.x.tweets.getRetweeters('id');
    const rawResponse = await responsePromise.asResponse();
    expect(rawResponse).toBeInstanceOf(Response);
    const response = await responsePromise;
    expect(response).not.toBeInstanceOf(Response);
    const dataAndResponse = await responsePromise.withResponse();
    expect(dataAndResponse.data).toBe(response);
    expect(dataAndResponse.response).toBe(rawResponse);
  });

  test('getRetweeters: request options and params are passed correctly', async () => {
    // ensure the request options are being passed correctly by passing an invalid HTTP method in order to cause an error
    await expect(
      client.x.tweets.getRetweeters(
        'id',
        { cursor: 'cursor', pageSize: 20 },
        { path: '/_stainless_unknown_path' },
      ),
    ).rejects.toThrow(XTwitterScraper.NotFoundError);
  });

  test('getThread', async () => {
    const responsePromise = client.x.tweets.getThread('id');
    const rawResponse = await responsePromise.asResponse();
    expect(rawResponse).toBeInstanceOf(Response);
    const response = await responsePromise;
    expect(response).not.toBeInstanceOf(Response);
    const dataAndResponse = await responsePromise.withResponse();
    expect(dataAndResponse.data).toBe(response);
    expect(dataAndResponse.response).toBe(rawResponse);
  });

  test('getThread: request options and params are passed correctly', async () => {
    // ensure the request options are being passed correctly by passing an invalid HTTP method in order to cause an error
    await expect(
      client.x.tweets.getThread(
        'id',
        { cursor: 'cursor', pageSize: 1 },
        { path: '/_stainless_unknown_path' },
      ),
    ).rejects.toThrow(XTwitterScraper.NotFoundError);
  });

  test('search: only required params', async () => {
    const responsePromise = client.x.tweets.search({ q: 'q' });
    const rawResponse = await responsePromise.asResponse();
    expect(rawResponse).toBeInstanceOf(Response);
    const response = await responsePromise;
    expect(response).not.toBeInstanceOf(Response);
    const dataAndResponse = await responsePromise.withResponse();
    expect(dataAndResponse.data).toBe(response);
    expect(dataAndResponse.response).toBe(rawResponse);
  });

  test('search: required and optional params', async () => {
    const response = await client.x.tweets.search({
      q: 'q',
      advancedQuery: 'advancedQuery',
      anyWords: 'anyWords',
      boundingBox: 'boundingBox',
      cashtags: 'cashtags',
      conversationId: 'conversationId',
      cursor: 'cursor',
      exactPhrase: 'exactPhrase',
      excludeWords: 'excludeWords',
      fromUser: 'fromUser',
      hashtags: 'hashtags',
      inReplyToTweetId: 'inReplyToTweetId',
      language: 'language',
      limit: 200,
      listId: 'listId',
      mediaType: 'images',
      mentioning: 'mentioning',
      minFaves: 0,
      minQuotes: 0,
      minReplies: 0,
      minRetweets: 0,
      place: 'place',
      placeCountry: 'placeCountry',
      pointRadius: 'pointRadius',
      queryType: 'Latest',
      quotes: 'include',
      quotesOfTweetId: 'quotesOfTweetId',
      replies: 'include',
      retweets: 'include',
      retweetsOfTweetId: 'retweetsOfTweetId',
      sinceDate: '2019-12-27',
      sinceTime: 'sinceTime',
      toUser: 'toUser',
      untilDate: '2019-12-27',
      untilTime: 'untilTime',
      url: 'url',
      verifiedOnly: true,
    });
  });
});
