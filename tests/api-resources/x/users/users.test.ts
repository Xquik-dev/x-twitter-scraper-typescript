// SPDX-FileCopyrightText: 2026 Xquik contributors
//
// SPDX-License-Identifier: Apache-2.0

import XTwitterScraper from 'x-twitter-scraper';
import { fixtureClient } from '../../../fixture-client';

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

  test('retrieve: request options and params are passed correctly', async () => {
    await expect(
      client.x.users.retrieve(
        'id',
        { fields: 'id,text,author.username', omit: 'entities,media' },
        { path: '/_stainless_unknown_path' },
      ),
    ).rejects.toThrow(XTwitterScraper.NotFoundError);
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

  test('retrieveAffiliates', async () => {
    const responsePromise = client.x.users.retrieveAffiliates('id');
    const rawResponse = await responsePromise.asResponse();
    expect(rawResponse).toBeInstanceOf(Response);
    const response = await responsePromise;
    expect(response).not.toBeInstanceOf(Response);
    const dataAndResponse = await responsePromise.withResponse();
    expect(dataAndResponse.data).toBe(response);
    expect(dataAndResponse.response).toBe(rawResponse);
  });

  test('retrieveAffiliates: request options and params are passed correctly', async () => {
    await expect(
      client.x.users.retrieveAffiliates(
        'id',
        {
          bioContains: 'bioContains',
          blueVerifiedOnly: true,
          businessEmailOnly: true,
          cursor: 'cursor',
          emailDomains: 'acme.com,stanford.edu',
          fields: 'id,text,author.username',
          hasEmail: true,
          hasLocation: true,
          hasWebsite: true,
          locationContains: 'locationContains',
          maxFollowers: 0,
          maxFollowing: 0,
          maxStatuses: 0,
          minAccountAgeDays: 0,
          minFollowers: 0,
          minFollowing: 0,
          minStatuses: 0,
          omit: 'entities,media',
          pageSize: 1,
          usernameContains: 'usernameContains',
          verifiedOnly: true,
          verifiedType: 'verifiedType',
        },
        { path: '/_stainless_unknown_path' },
      ),
    ).rejects.toThrow(XTwitterScraper.NotFoundError);
  });

  test('retrieveArticles', async () => {
    const responsePromise = client.x.users.retrieveArticles('id');
    const rawResponse = await responsePromise.asResponse();
    expect(rawResponse).toBeInstanceOf(Response);
    const response = await responsePromise;
    expect(response).not.toBeInstanceOf(Response);
    const dataAndResponse = await responsePromise.withResponse();
    expect(dataAndResponse.data).toBe(response);
    expect(dataAndResponse.response).toBe(rawResponse);
  });

  test('retrieveArticles: request options and params are passed correctly', async () => {
    await expect(
      client.x.users.retrieveArticles(
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

  test('retrieveBatch', async () => {
    const responsePromise = client.x.users.retrieveBatch();
    const rawResponse = await responsePromise.asResponse();
    expect(rawResponse).toBeInstanceOf(Response);
    const response = await responsePromise;
    expect(response).not.toBeInstanceOf(Response);
    const dataAndResponse = await responsePromise.withResponse();
    expect(dataAndResponse.data).toBe(response);
    expect(dataAndResponse.response).toBe(rawResponse);
  });

  test('retrieveBatch: request options and params are passed correctly', async () => {
    await expect(
      client.x.users.retrieveBatch(
        {
          bioContains: 'bioContains',
          blueVerifiedOnly: true,
          businessEmailOnly: true,
          emailDomains: 'acme.com,stanford.edu',
          fields: 'id,text,author.username',
          hasEmail: true,
          hasLocation: true,
          hasWebsite: true,
          ids: 'ids',
          locationContains: 'locationContains',
          maxFollowers: 0,
          maxFollowing: 0,
          maxStatuses: 0,
          minAccountAgeDays: 0,
          minFollowers: 0,
          minFollowing: 0,
          minStatuses: 0,
          omit: 'entities,media',
          usernameContains: 'usernameContains',
          usernames: 'nasa,@OpenAI,x.com/verge',
          verifiedOnly: true,
          verifiedType: 'verifiedType',
        },
        { path: '/_stainless_unknown_path' },
      ),
    ).rejects.toThrow(XTwitterScraper.NotFoundError);
  });

  test('retrieveBatchTweets', async () => {
    const responsePromise = client.x.users.retrieveBatchTweets();
    const rawResponse = await responsePromise.asResponse();
    expect(rawResponse).toBeInstanceOf(Response);
    const response = await responsePromise;
    expect(response).not.toBeInstanceOf(Response);
    const dataAndResponse = await responsePromise.withResponse();
    expect(dataAndResponse.data).toBe(response);
    expect(dataAndResponse.response).toBe(rawResponse);
  });

  test('retrieveBatchTweets: request options and params are passed correctly', async () => {
    await expect(
      client.x.users.retrieveBatchTweets(
        {
          fields: 'id,text,author.username',
          ids: 'ids',
          omit: 'entities,media',
          pageSize: 1,
          usernames: 'nasa,@OpenAI,x.com/verge',
        },
        { path: '/_stainless_unknown_path' },
      ),
    ).rejects.toThrow(XTwitterScraper.NotFoundError);
  });

  test('retrieveFollowerIds', async () => {
    const responsePromise = client.x.users.retrieveFollowerIds('id');
    const rawResponse = await responsePromise.asResponse();
    expect(rawResponse).toBeInstanceOf(Response);
    const response = await responsePromise;
    expect(response).not.toBeInstanceOf(Response);
    const dataAndResponse = await responsePromise.withResponse();
    expect(dataAndResponse.data).toBe(response);
    expect(dataAndResponse.response).toBe(rawResponse);
  });

  test('retrieveFollowerIds: request options and params are passed correctly', async () => {
    await expect(
      client.x.users.retrieveFollowerIds(
        'id',
        { cursor: 'cursor', pageSize: 1 },
        { path: '/_stainless_unknown_path' },
      ),
    ).rejects.toThrow(XTwitterScraper.NotFoundError);
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
    await expect(
      client.x.users.retrieveFollowers(
        'id',
        {
          after: 'after',
          bioContains: 'bioContains',
          blueVerifiedOnly: true,
          businessEmailOnly: true,
          cursor: 'cursor',
          emailDomains: 'acme.com,stanford.edu',
          enrichProfiles: true,
          fields: 'id,text,author.username',
          hasEmail: true,
          hasLocation: true,
          hasWebsite: true,
          limit: 1,
          locationContains: 'locationContains',
          maxFollowers: 0,
          maxFollowing: 0,
          maxScan: 10000,
          maxStatuses: 0,
          minAccountAgeDays: 0,
          minFollowers: 0,
          minFollowing: 0,
          minStatuses: 0,
          mode: 'standard',
          omit: 'entities,media',
          pageSize: 1,
          usernameContains: 'usernameContains',
          verifiedOnly: true,
          verifiedType: 'verifiedType',
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
    await expect(
      client.x.users.retrieveFollowersYouKnow(
        'id',
        {
          bioContains: 'bioContains',
          blueVerifiedOnly: true,
          businessEmailOnly: true,
          cursor: 'cursor',
          emailDomains: 'acme.com,stanford.edu',
          fields: 'id,text,author.username',
          hasEmail: true,
          hasLocation: true,
          hasWebsite: true,
          locationContains: 'locationContains',
          maxFollowers: 0,
          maxFollowing: 0,
          maxStatuses: 0,
          minAccountAgeDays: 0,
          minFollowers: 0,
          minFollowing: 0,
          minStatuses: 0,
          omit: 'entities,media',
          pageSize: 1,
          usernameContains: 'usernameContains',
          verifiedOnly: true,
          verifiedType: 'verifiedType',
        },
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
    await expect(
      client.x.users.retrieveFollowing(
        'id',
        {
          after: 'after',
          bioContains: 'bioContains',
          blueVerifiedOnly: true,
          businessEmailOnly: true,
          cursor: 'cursor',
          emailDomains: 'acme.com,stanford.edu',
          enrichProfiles: true,
          fields: 'id,text,author.username',
          hasEmail: true,
          hasLocation: true,
          hasWebsite: true,
          limit: 1,
          locationContains: 'locationContains',
          maxFollowers: 0,
          maxFollowing: 0,
          maxScan: 10000,
          maxStatuses: 0,
          minAccountAgeDays: 0,
          minFollowers: 0,
          minFollowing: 0,
          minStatuses: 0,
          mode: 'standard',
          omit: 'entities,media',
          pageSize: 1,
          usernameContains: 'usernameContains',
          verifiedOnly: true,
          verifiedType: 'verifiedType',
        },
        { path: '/_stainless_unknown_path' },
      ),
    ).rejects.toThrow(XTwitterScraper.NotFoundError);
  });

  test('retrieveFollowingIds', async () => {
    const responsePromise = client.x.users.retrieveFollowingIds('id');
    const rawResponse = await responsePromise.asResponse();
    expect(rawResponse).toBeInstanceOf(Response);
    const response = await responsePromise;
    expect(response).not.toBeInstanceOf(Response);
    const dataAndResponse = await responsePromise.withResponse();
    expect(dataAndResponse.data).toBe(response);
    expect(dataAndResponse.response).toBe(rawResponse);
  });

  test('retrieveFollowingIds: request options and params are passed correctly', async () => {
    await expect(
      client.x.users.retrieveFollowingIds(
        'id',
        { cursor: 'cursor', pageSize: 1 },
        { path: '/_stainless_unknown_path' },
      ),
    ).rejects.toThrow(XTwitterScraper.NotFoundError);
  });

  test('retrieveHighlights', async () => {
    const responsePromise = client.x.users.retrieveHighlights('id');
    const rawResponse = await responsePromise.asResponse();
    expect(rawResponse).toBeInstanceOf(Response);
    const response = await responsePromise;
    expect(response).not.toBeInstanceOf(Response);
    const dataAndResponse = await responsePromise.withResponse();
    expect(dataAndResponse.data).toBe(response);
    expect(dataAndResponse.response).toBe(rawResponse);
  });

  test('retrieveHighlights: request options and params are passed correctly', async () => {
    await expect(
      client.x.users.retrieveHighlights(
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

  test('retrieveInsights', async () => {
    const responsePromise = client.x.users.retrieveInsights('id');
    const rawResponse = await responsePromise.asResponse();
    expect(rawResponse).toBeInstanceOf(Response);
    const response = await responsePromise;
    expect(response).not.toBeInstanceOf(Response);
    const dataAndResponse = await responsePromise.withResponse();
    expect(dataAndResponse.data).toBe(response);
    expect(dataAndResponse.response).toBe(rawResponse);
  });

  test('retrieveInsights: request options and params are passed correctly', async () => {
    await expect(
      client.x.users.retrieveInsights(
        'id',
        { fields: 'id,text,author.username', omit: 'entities,media' },
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
    await expect(
      client.x.users.retrieveLikes(
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

  test('retrieveListMemberships', async () => {
    const responsePromise = client.x.users.retrieveListMemberships('id');
    const rawResponse = await responsePromise.asResponse();
    expect(rawResponse).toBeInstanceOf(Response);
    const response = await responsePromise;
    expect(response).not.toBeInstanceOf(Response);
    const dataAndResponse = await responsePromise.withResponse();
    expect(dataAndResponse.data).toBe(response);
    expect(dataAndResponse.response).toBe(rawResponse);
  });

  test('retrieveListMemberships: request options and params are passed correctly', async () => {
    await expect(
      client.x.users.retrieveListMemberships(
        'id',
        {
          cursor: 'cursor',
          fields: 'id,text,author.username',
          omit: 'entities,media',
          pageSize: 1,
        },
        { path: '/_stainless_unknown_path' },
      ),
    ).rejects.toThrow(XTwitterScraper.NotFoundError);
  });

  test('retrieveLists', async () => {
    const responsePromise = client.x.users.retrieveLists('id');
    const rawResponse = await responsePromise.asResponse();
    expect(rawResponse).toBeInstanceOf(Response);
    const response = await responsePromise;
    expect(response).not.toBeInstanceOf(Response);
    const dataAndResponse = await responsePromise.withResponse();
    expect(dataAndResponse.data).toBe(response);
    expect(dataAndResponse.response).toBe(rawResponse);
  });

  test('retrieveLists: request options and params are passed correctly', async () => {
    await expect(
      client.x.users.retrieveLists(
        'id',
        {
          cursor: 'cursor',
          fields: 'id,text,author.username',
          omit: 'entities,media',
          pageSize: 1,
        },
        { path: '/_stainless_unknown_path' },
      ),
    ).rejects.toThrow(XTwitterScraper.NotFoundError);
  });

  test('retrieveLive', async () => {
    const responsePromise = client.x.users.retrieveLive('id');
    const rawResponse = await responsePromise.asResponse();
    expect(rawResponse).toBeInstanceOf(Response);
    const response = await responsePromise;
    expect(response).not.toBeInstanceOf(Response);
    const dataAndResponse = await responsePromise.withResponse();
    expect(dataAndResponse.data).toBe(response);
    expect(dataAndResponse.response).toBe(rawResponse);
  });

  test('retrieveLive: request options and params are passed correctly', async () => {
    await expect(
      client.x.users.retrieveLive(
        'id',
        { fields: 'id,text,author.username', omit: 'entities,media' },
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
    await expect(
      client.x.users.retrieveMedia(
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
    await expect(
      client.x.users.retrieveMentions(
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
          quotes: 'include',
          quotesOfTweetId: 'quotesOfTweetId',
          replies: 'include',
          retweets: 'include',
          retweetsOfTweetId: 'retweetsOfTweetId',
          sinceDate: '2019-12-27',
          sinceId: 'sinceId',
          sinceTime: 'sinceTime',
          toUser: 'toUser',
          untilDate: '2019-12-27',
          untilTime: 'untilTime',
          url: 'url',
          verifiedOnly: true,
          withinTime: '7d',
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
    await expect(
      client.x.users.retrieveReplies(
        'id',
        {
          advancedQuery: 'advancedQuery',
          anyWords: 'anyWords',
          blueVerifiedOnly: true,
          boundingBox: 'boundingBox',
          cardName: 'cardName',
          cashtags: 'cashtags',
          conversationId: 'conversationId',
          cursor: 'cursor',
          exactPhrase: 'exactPhrase',
          excludeSource: 'excludeSource',
          excludeWords: 'excludeWords',
          fields: 'id,text,author.username',
          fromUser: 'fromUser',
          geocode: 'geocode',
          hashtags: 'hashtags',
          includeParentTweet: true,
          inReplyToTweetId: 'inReplyToTweetId',
          keywords: 'keywords',
          language: 'language',
          listId: 'listId',
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
          mode: 'standard',
          nativeRetweets: true,
          near: 'near',
          news: true,
          omit: 'entities,media',
          pageSize: 1,
          place: 'place',
          placeCountry: 'placeCountry',
          pointRadius: 'pointRadius',
          quotes: 'include',
          quotesOfTweetId: 'quotesOfTweetId',
          replies: 'include',
          retweets: 'include',
          retweetsOfTweetId: 'retweetsOfTweetId',
          safe: true,
          sinceDate: '2019-12-27',
          sinceId: 'sinceId',
          sinceTime: 'sinceTime',
          source: 'source',
          toUser: 'toUser',
          untilDate: '2019-12-27',
          untilTime: 'untilTime',
          url: 'url',
          verifiedOnly: true,
          within: 'within',
          withinTime: '7d',
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
    const response = await client.x.users.retrieveSearch({
      q: 'q',
      bioContains: 'bioContains',
      blueVerifiedOnly: true,
      businessEmailOnly: true,
      cursor: 'cursor',
      emailDomains: 'acme.com,stanford.edu',
      enrichProfiles: true,
      fields: 'id,text,author.username',
      hasEmail: true,
      hasLocation: true,
      hasWebsite: true,
      locationContains: 'locationContains',
      maxFollowers: 0,
      maxFollowing: 0,
      maxStatuses: 0,
      minAccountAgeDays: 0,
      minFollowers: 0,
      minFollowing: 0,
      minStatuses: 0,
      omit: 'entities,media',
      pageSize: 1,
      usernameContains: 'usernameContains',
      verifiedOnly: true,
      verifiedType: 'verifiedType',
    });
  });

  test('retrieveSimilar', async () => {
    const responsePromise = client.x.users.retrieveSimilar('id');
    const rawResponse = await responsePromise.asResponse();
    expect(rawResponse).toBeInstanceOf(Response);
    const response = await responsePromise;
    expect(response).not.toBeInstanceOf(Response);
    const dataAndResponse = await responsePromise.withResponse();
    expect(dataAndResponse.data).toBe(response);
    expect(dataAndResponse.response).toBe(rawResponse);
  });

  test('retrieveSimilar: request options and params are passed correctly', async () => {
    await expect(
      client.x.users.retrieveSimilar(
        'id',
        {
          bioContains: 'bioContains',
          blueVerifiedOnly: true,
          businessEmailOnly: true,
          cursor: 'cursor',
          emailDomains: 'acme.com,stanford.edu',
          fields: 'id,text,author.username',
          hasEmail: true,
          hasLocation: true,
          hasWebsite: true,
          locationContains: 'locationContains',
          maxFollowers: 0,
          maxFollowing: 0,
          maxStatuses: 0,
          minAccountAgeDays: 0,
          minFollowers: 0,
          minFollowing: 0,
          minStatuses: 0,
          omit: 'entities,media',
          pageSize: 1,
          usernameContains: 'usernameContains',
          verifiedOnly: true,
          verifiedType: 'verifiedType',
        },
        { path: '/_stainless_unknown_path' },
      ),
    ).rejects.toThrow(XTwitterScraper.NotFoundError);
  });

  test('retrieveSubscriptions', async () => {
    const responsePromise = client.x.users.retrieveSubscriptions('id');
    const rawResponse = await responsePromise.asResponse();
    expect(rawResponse).toBeInstanceOf(Response);
    const response = await responsePromise;
    expect(response).not.toBeInstanceOf(Response);
    const dataAndResponse = await responsePromise.withResponse();
    expect(dataAndResponse.data).toBe(response);
    expect(dataAndResponse.response).toBe(rawResponse);
  });

  test('retrieveSubscriptions: request options and params are passed correctly', async () => {
    await expect(
      client.x.users.retrieveSubscriptions(
        'id',
        {
          bioContains: 'bioContains',
          blueVerifiedOnly: true,
          businessEmailOnly: true,
          cursor: 'cursor',
          emailDomains: 'acme.com,stanford.edu',
          fields: 'id,text,author.username',
          hasEmail: true,
          hasLocation: true,
          hasWebsite: true,
          locationContains: 'locationContains',
          maxFollowers: 0,
          maxFollowing: 0,
          maxStatuses: 0,
          minAccountAgeDays: 0,
          minFollowers: 0,
          minFollowing: 0,
          minStatuses: 0,
          omit: 'entities,media',
          pageSize: 1,
          usernameContains: 'usernameContains',
          verifiedOnly: true,
          verifiedType: 'verifiedType',
        },
        { path: '/_stainless_unknown_path' },
      ),
    ).rejects.toThrow(XTwitterScraper.NotFoundError);
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
    await expect(
      client.x.users.retrieveTweets(
        'id',
        {
          advancedQuery: 'advancedQuery',
          anyWords: 'anyWords',
          blueVerifiedOnly: true,
          boundingBox: 'boundingBox',
          cardName: 'cardName',
          cashtags: 'cashtags',
          conversationId: 'conversationId',
          cursor: 'cursor',
          exactPhrase: 'exactPhrase',
          excludeSource: 'excludeSource',
          excludeWords: 'excludeWords',
          fields: 'id,text,author.username',
          fromUser: 'fromUser',
          geocode: 'geocode',
          hashtags: 'hashtags',
          includeParentTweet: true,
          includeReplies: true,
          inReplyToTweetId: 'inReplyToTweetId',
          keywords: 'keywords',
          language: 'language',
          listId: 'listId',
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
          mode: 'standard',
          nativeRetweets: true,
          near: 'near',
          news: true,
          omit: 'entities,media',
          pageSize: 1,
          place: 'place',
          placeCountry: 'placeCountry',
          pointRadius: 'pointRadius',
          quotes: 'include',
          quotesOfTweetId: 'quotesOfTweetId',
          replies: 'include',
          retweets: 'include',
          retweetsOfTweetId: 'retweetsOfTweetId',
          safe: true,
          sinceDate: '2019-12-27',
          sinceId: 'sinceId',
          sinceTime: 'sinceTime',
          source: 'source',
          toUser: 'toUser',
          untilDate: '2019-12-27',
          untilTime: 'untilTime',
          url: 'url',
          verifiedOnly: true,
          within: 'within',
          withinTime: '7d',
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
    await expect(
      client.x.users.retrieveVerifiedFollowers(
        'id',
        {
          after: 'after',
          bioContains: 'bioContains',
          blueVerifiedOnly: true,
          businessEmailOnly: true,
          cursor: 'cursor',
          emailDomains: 'acme.com,stanford.edu',
          enrichProfiles: true,
          fields: 'id,text,author.username',
          hasEmail: true,
          hasLocation: true,
          hasWebsite: true,
          limit: 1,
          locationContains: 'locationContains',
          maxFollowers: 0,
          maxFollowing: 0,
          maxScan: 10000,
          maxStatuses: 0,
          minAccountAgeDays: 0,
          minFollowers: 0,
          minFollowing: 0,
          minStatuses: 0,
          mode: 'standard',
          omit: 'entities,media',
          pageSize: 1,
          usernameContains: 'usernameContains',
          verifiedOnly: true,
          verifiedType: 'verifiedType',
        },
        { path: '/_stainless_unknown_path' },
      ),
    ).rejects.toThrow(XTwitterScraper.NotFoundError);
  });

  test('translateBio: only required params', async () => {
    const responsePromise = client.x.users.translateBio('id', { language: 'es' });
    const rawResponse = await responsePromise.asResponse();
    expect(rawResponse).toBeInstanceOf(Response);
    const response = await responsePromise;
    expect(response).not.toBeInstanceOf(Response);
    const dataAndResponse = await responsePromise.withResponse();
    expect(dataAndResponse.data).toBe(response);
    expect(dataAndResponse.response).toBe(rawResponse);
  });

  test('translateBio: required and optional params', async () => {
    const response = await client.x.users.translateBio('id', {
      language: 'es',
      fields: 'id,text,author.username',
      omit: 'entities,media',
    });
  });

  test('retrieve: returns the profile fields the SDK used to drop', async () => {
    const example: XTwitterScraper.UserProfile = {
      id: '11348282',
      name: 'NASA',
      username: 'NASA',
      profilePicture: 'https://pbs.twimg.com/profile_images/1321163587679784960/0ZxKlEKB_normal.jpg',
      profilePictureOriginal: 'https://pbs.twimg.com/profile_images/1321163587679784960/0ZxKlEKB.jpg',
      redirectsToUsername: 'spacexsi',
      identityVerification: { overrideVerifiedYear: 2009 },
    };
    const { client: fixture, requests } = fixtureClient(example);

    const response: XTwitterScraper.UserProfile = await fixture.x.users.retrieve('NASA');

    expect(requests).toEqual(['GET https://xquik.test/api/v1/x/users/NASA']);
    expect(response).toEqual(example);
  });
});
