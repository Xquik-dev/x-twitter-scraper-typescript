// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import XTwitterScraper from 'x-twitter-scraper';

const client = new XTwitterScraper({
  apiKey: 'My API Key',
  bearerToken: 'My Bearer Token',
  baseURL: process.env['TEST_API_BASE_URL'] ?? 'http://127.0.0.1:4010',
});

describe('resource users', () => {
  test('retrieve', async () => {
    const responsePromise = client.x.users.retrieve('id');
    const rawResponse = await responsePromise.asResponse();
    expect(rawResponse).toBeInstanceOf(Response);
    const response = await responsePromise;
    expect(response).not.toBeInstanceOf(Response);
    const dataAndResponse = await responsePromise.withResponse();
    expect(dataAndResponse.data).toBe(response);
    expect(dataAndResponse.response).toBe(rawResponse);
  });

  test('removeFollower: only required params', async () => {
    const responsePromise = client.x.users.removeFollower('id', {
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

  test('removeFollower: required and optional params', async () => {
    const response = await client.x.users.removeFollower('id', {
      account: '@elonmusk',
      'Idempotency-Key': 'Idempotency-Key',
    });
  });

  test('retrieveBatch: only required params', async () => {
    const responsePromise = client.x.users.retrieveBatch({ ids: 'ids' });
    const rawResponse = await responsePromise.asResponse();
    expect(rawResponse).toBeInstanceOf(Response);
    const response = await responsePromise;
    expect(response).not.toBeInstanceOf(Response);
    const dataAndResponse = await responsePromise.withResponse();
    expect(dataAndResponse.data).toBe(response);
    expect(dataAndResponse.response).toBe(rawResponse);
  });

  test('retrieveBatch: required and optional params', async () => {
    const response = await client.x.users.retrieveBatch({ ids: 'ids' });
  });

  test('retrieveFollowers', async () => {
    const responsePromise = client.x.users.retrieveFollowers('id');
    const rawResponse = await responsePromise.asResponse();
    expect(rawResponse).toBeInstanceOf(Response);
    const response = await responsePromise;
    expect(response).not.toBeInstanceOf(Response);
    const dataAndResponse = await responsePromise.withResponse();
    expect(dataAndResponse.data).toBe(response);
    expect(dataAndResponse.response).toBe(rawResponse);
  });

  test('retrieveFollowers: request options and params are passed correctly', async () => {
    // ensure the request options are being passed correctly by passing an invalid HTTP method in order to cause an error
    await expect(
      client.x.users.retrieveFollowers(
        'id',
        {
          after: 'after',
          cursor: 'cursor',
          limit: 0,
          pageSize: 20,
        },
        { path: '/_stainless_unknown_path' },
      ),
    ).rejects.toThrow(XTwitterScraper.NotFoundError);
  });

  test('retrieveFollowersYouKnow', async () => {
    const responsePromise = client.x.users.retrieveFollowersYouKnow('id');
    const rawResponse = await responsePromise.asResponse();
    expect(rawResponse).toBeInstanceOf(Response);
    const response = await responsePromise;
    expect(response).not.toBeInstanceOf(Response);
    const dataAndResponse = await responsePromise.withResponse();
    expect(dataAndResponse.data).toBe(response);
    expect(dataAndResponse.response).toBe(rawResponse);
  });

  test('retrieveFollowersYouKnow: request options and params are passed correctly', async () => {
    // ensure the request options are being passed correctly by passing an invalid HTTP method in order to cause an error
    await expect(
      client.x.users.retrieveFollowersYouKnow(
        'id',
        { cursor: 'cursor', pageSize: 20 },
        { path: '/_stainless_unknown_path' },
      ),
    ).rejects.toThrow(XTwitterScraper.NotFoundError);
  });

  test('retrieveFollowing', async () => {
    const responsePromise = client.x.users.retrieveFollowing('id');
    const rawResponse = await responsePromise.asResponse();
    expect(rawResponse).toBeInstanceOf(Response);
    const response = await responsePromise;
    expect(response).not.toBeInstanceOf(Response);
    const dataAndResponse = await responsePromise.withResponse();
    expect(dataAndResponse.data).toBe(response);
    expect(dataAndResponse.response).toBe(rawResponse);
  });

  test('retrieveFollowing: request options and params are passed correctly', async () => {
    // ensure the request options are being passed correctly by passing an invalid HTTP method in order to cause an error
    await expect(
      client.x.users.retrieveFollowing(
        'id',
        {
          after: 'after',
          cursor: 'cursor',
          limit: 0,
          pageSize: 20,
        },
        { path: '/_stainless_unknown_path' },
      ),
    ).rejects.toThrow(XTwitterScraper.NotFoundError);
  });

  test('retrieveLikes', async () => {
    const responsePromise = client.x.users.retrieveLikes('id');
    const rawResponse = await responsePromise.asResponse();
    expect(rawResponse).toBeInstanceOf(Response);
    const response = await responsePromise;
    expect(response).not.toBeInstanceOf(Response);
    const dataAndResponse = await responsePromise.withResponse();
    expect(dataAndResponse.data).toBe(response);
    expect(dataAndResponse.response).toBe(rawResponse);
  });

  test('retrieveLikes: request options and params are passed correctly', async () => {
    // ensure the request options are being passed correctly by passing an invalid HTTP method in order to cause an error
    await expect(
      client.x.users.retrieveLikes(
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
          toUser: 'toUser',
          untilDate: '2019-12-27',
          url: 'url',
          verifiedOnly: true,
        },
        { path: '/_stainless_unknown_path' },
      ),
    ).rejects.toThrow(XTwitterScraper.NotFoundError);
  });

  test('retrieveMedia', async () => {
    const responsePromise = client.x.users.retrieveMedia('id');
    const rawResponse = await responsePromise.asResponse();
    expect(rawResponse).toBeInstanceOf(Response);
    const response = await responsePromise;
    expect(response).not.toBeInstanceOf(Response);
    const dataAndResponse = await responsePromise.withResponse();
    expect(dataAndResponse.data).toBe(response);
    expect(dataAndResponse.response).toBe(rawResponse);
  });

  test('retrieveMedia: request options and params are passed correctly', async () => {
    // ensure the request options are being passed correctly by passing an invalid HTTP method in order to cause an error
    await expect(
      client.x.users.retrieveMedia(
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
          toUser: 'toUser',
          untilDate: '2019-12-27',
          url: 'url',
          verifiedOnly: true,
        },
        { path: '/_stainless_unknown_path' },
      ),
    ).rejects.toThrow(XTwitterScraper.NotFoundError);
  });

  test('retrieveMentions', async () => {
    const responsePromise = client.x.users.retrieveMentions('id');
    const rawResponse = await responsePromise.asResponse();
    expect(rawResponse).toBeInstanceOf(Response);
    const response = await responsePromise;
    expect(response).not.toBeInstanceOf(Response);
    const dataAndResponse = await responsePromise.withResponse();
    expect(dataAndResponse.data).toBe(response);
    expect(dataAndResponse.response).toBe(rawResponse);
  });

  test('retrieveMentions: request options and params are passed correctly', async () => {
    // ensure the request options are being passed correctly by passing an invalid HTTP method in order to cause an error
    await expect(
      client.x.users.retrieveMentions(
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

  test('retrieveReplies', async () => {
    const responsePromise = client.x.users.retrieveReplies('id');
    const rawResponse = await responsePromise.asResponse();
    expect(rawResponse).toBeInstanceOf(Response);
    const response = await responsePromise;
    expect(response).not.toBeInstanceOf(Response);
    const dataAndResponse = await responsePromise.withResponse();
    expect(dataAndResponse.data).toBe(response);
    expect(dataAndResponse.response).toBe(rawResponse);
  });

  test('retrieveReplies: request options and params are passed correctly', async () => {
    // ensure the request options are being passed correctly by passing an invalid HTTP method in order to cause an error
    await expect(
      client.x.users.retrieveReplies(
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
          includeParentTweet: true,
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
          toUser: 'toUser',
          untilDate: '2019-12-27',
          url: 'url',
          verifiedOnly: true,
        },
        { path: '/_stainless_unknown_path' },
      ),
    ).rejects.toThrow(XTwitterScraper.NotFoundError);
  });

  test('retrieveSearch: only required params', async () => {
    const responsePromise = client.x.users.retrieveSearch({ q: 'q' });
    const rawResponse = await responsePromise.asResponse();
    expect(rawResponse).toBeInstanceOf(Response);
    const response = await responsePromise;
    expect(response).not.toBeInstanceOf(Response);
    const dataAndResponse = await responsePromise.withResponse();
    expect(dataAndResponse.data).toBe(response);
    expect(dataAndResponse.response).toBe(rawResponse);
  });

  test('retrieveSearch: required and optional params', async () => {
    const response = await client.x.users.retrieveSearch({ q: 'q', cursor: 'cursor' });
  });

  test('retrieveTweets', async () => {
    const responsePromise = client.x.users.retrieveTweets('id');
    const rawResponse = await responsePromise.asResponse();
    expect(rawResponse).toBeInstanceOf(Response);
    const response = await responsePromise;
    expect(response).not.toBeInstanceOf(Response);
    const dataAndResponse = await responsePromise.withResponse();
    expect(dataAndResponse.data).toBe(response);
    expect(dataAndResponse.response).toBe(rawResponse);
  });

  test('retrieveTweets: request options and params are passed correctly', async () => {
    // ensure the request options are being passed correctly by passing an invalid HTTP method in order to cause an error
    await expect(
      client.x.users.retrieveTweets(
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
          includeParentTweet: true,
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
          toUser: 'toUser',
          untilDate: '2019-12-27',
          url: 'url',
          verifiedOnly: true,
        },
        { path: '/_stainless_unknown_path' },
      ),
    ).rejects.toThrow(XTwitterScraper.NotFoundError);
  });

  test('retrieveVerifiedFollowers', async () => {
    const responsePromise = client.x.users.retrieveVerifiedFollowers('id');
    const rawResponse = await responsePromise.asResponse();
    expect(rawResponse).toBeInstanceOf(Response);
    const response = await responsePromise;
    expect(response).not.toBeInstanceOf(Response);
    const dataAndResponse = await responsePromise.withResponse();
    expect(dataAndResponse.data).toBe(response);
    expect(dataAndResponse.response).toBe(rawResponse);
  });

  test('retrieveVerifiedFollowers: request options and params are passed correctly', async () => {
    // ensure the request options are being passed correctly by passing an invalid HTTP method in order to cause an error
    await expect(
      client.x.users.retrieveVerifiedFollowers(
        'id',
        { cursor: 'cursor', pageSize: 20 },
        { path: '/_stainless_unknown_path' },
      ),
    ).rejects.toThrow(XTwitterScraper.NotFoundError);
  });
});
