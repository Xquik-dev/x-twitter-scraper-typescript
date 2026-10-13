// SPDX-FileCopyrightText: 2026 Xquik contributors
//
// SPDX-License-Identifier: Apache-2.0

import XTwitterScraper from 'x-twitter-scraper';

const client = new XTwitterScraper({
  apiKey: 'My API Key',
  bearerToken: 'My Bearer Token',
  baseURL: process.env['TEST_API_BASE_URL'] ?? 'http://127.0.0.1:4010',
});

describe('resource tweets', () => {
  test('list: only required params', async () => {
    const responsePromise = client.x.communities.tweets.list({ q: 'q' });
    const rawResponse = await responsePromise.asResponse();
    expect(rawResponse).toBeInstanceOf(Response);
    const response = await responsePromise;
    expect(response).not.toBeInstanceOf(Response);
    const dataAndResponse = await responsePromise.withResponse();
    expect(dataAndResponse.data).toBe(response);
    expect(dataAndResponse.response).toBe(rawResponse);
  });

  test('list: required and optional params', async () => {
    const response = await client.x.communities.tweets.list({
      q: 'q',
      anyWords: 'anyWords',
      blueVerifiedOnly: true,
      cashtags: 'cashtags',
      communityId: '321669910225',
      conversationId: 'conversationId',
      cursor: 'cursor',
      exactPhrase: 'exactPhrase',
      excludeWords: 'excludeWords',
      fields: 'id,text,author.username',
      fromUser: 'fromUser',
      hashtags: 'hashtags',
      inReplyToTweetId: 'inReplyToTweetId',
      language: 'language',
      maxFaves: 0,
      maxId: 'maxId',
      maxQuotes: 0,
      maxReplies: 0,
      maxRetweets: 0,
      mediaType: 'images',
      mentioning: 'mentioning',
      minBookmarks: 0,
      minLikes: 0,
      minQuotes: 0,
      minReplies: 0,
      minRetweets: 0,
      minViews: 0,
      nativeRetweets: true,
      omit: 'entities,media',
      pageSize: 1,
      queryType: 'Latest',
      quotes: 'include',
      quotesOfTweetId: 'quotesOfTweetId',
      replies: 'include',
      retweets: 'include',
      retweetsOfTweetId: 'retweetsOfTweetId',
      sinceDate: '2019-12-27',
      sinceId: 'sinceId',
      toUser: 'toUser',
      untilDate: '2019-12-27',
      url: 'url',
      verifiedOnly: true,
      withinTime: '7d',
    });
  });

  test('listByCommunity', async () => {
    const responsePromise = client.x.communities.tweets.listByCommunity('id');
    const rawResponse = await responsePromise.asResponse();
    expect(rawResponse).toBeInstanceOf(Response);
    const response = await responsePromise;
    expect(response).not.toBeInstanceOf(Response);
    const dataAndResponse = await responsePromise.withResponse();
    expect(dataAndResponse.data).toBe(response);
    expect(dataAndResponse.response).toBe(rawResponse);
  });

  test('listByCommunity: request options and params are passed correctly', async () => {
    // ensure the request options are being passed correctly by passing an invalid HTTP method in order to cause an error
    await expect(
      client.x.communities.tweets.listByCommunity(
        'id',
        {
          anyWords: 'anyWords',
          blueVerifiedOnly: true,
          cashtags: 'cashtags',
          conversationId: 'conversationId',
          cursor: 'cursor',
          exactPhrase: 'exactPhrase',
          excludeWords: 'excludeWords',
          fields: 'id,text,author.username',
          fromUser: 'fromUser',
          hashtags: 'hashtags',
          inReplyToTweetId: 'inReplyToTweetId',
          language: 'language',
          maxFaves: 0,
          maxId: 'maxId',
          maxQuotes: 0,
          maxReplies: 0,
          maxRetweets: 0,
          mediaType: 'images',
          mentioning: 'mentioning',
          minBookmarks: 0,
          minLikes: 0,
          minQuotes: 0,
          minReplies: 0,
          minRetweets: 0,
          minViews: 0,
          nativeRetweets: true,
          omit: 'entities,media',
          pageSize: 1,
          queryType: 'Latest',
          quotes: 'include',
          quotesOfTweetId: 'quotesOfTweetId',
          replies: 'include',
          retweets: 'include',
          retweetsOfTweetId: 'retweetsOfTweetId',
          sinceDate: '2019-12-27',
          sinceId: 'sinceId',
          toUser: 'toUser',
          untilDate: '2019-12-27',
          url: 'url',
          verifiedOnly: true,
          withinTime: '7d',
        },
        { path: '/_stainless_unknown_path' },
      ),
    ).rejects.toThrow(XTwitterScraper.NotFoundError);
  });
});
