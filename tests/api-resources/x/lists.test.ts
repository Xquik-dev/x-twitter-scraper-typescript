// SPDX-FileCopyrightText: 2026 Xquik contributors
//
// SPDX-License-Identifier: Apache-2.0

import XTwitterScraper from 'x-twitter-scraper';

const client = new XTwitterScraper({
  apiKey: 'My API Key',
  bearerToken: 'My Bearer Token',
  baseURL: process.env['TEST_API_BASE_URL'] ?? 'http://127.0.0.1:4010',
});

describe('resource lists', () => {
  test('retrieve', async () => {
    const responsePromise = client.x.lists.retrieve('id');
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
      client.x.lists.retrieve(
        'id',
        { fields: 'id,text,author.username', omit: 'entities,media' },
        { path: '/_stainless_unknown_path' },
      ),
    ).rejects.toThrow(XTwitterScraper.NotFoundError);
  });

  test('retrieveFollowers', async () => {
    const responsePromise = client.x.lists.retrieveFollowers('id');
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
      client.x.lists.retrieveFollowers(
        'id',
        {
          after: 'after',
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

  test('retrieveMembers', async () => {
    const responsePromise = client.x.lists.retrieveMembers('id');
    const rawResponse = await responsePromise.asResponse();
    expect(rawResponse).toBeInstanceOf(Response);
    const response = await responsePromise;
    expect(response).not.toBeInstanceOf(Response);
    const dataAndResponse = await responsePromise.withResponse();
    expect(dataAndResponse.data).toBe(response);
    expect(dataAndResponse.response).toBe(rawResponse);
  });

  test('retrieveMembers: request options and params are passed correctly', async () => {
    await expect(
      client.x.lists.retrieveMembers(
        'id',
        {
          after: 'after',
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

  test('retrieveSearch: only required params', async () => {
    const responsePromise = client.x.lists.retrieveSearch({ q: 'q' });
    const rawResponse = await responsePromise.asResponse();
    expect(rawResponse).toBeInstanceOf(Response);
    const response = await responsePromise;
    expect(response).not.toBeInstanceOf(Response);
    const dataAndResponse = await responsePromise.withResponse();
    expect(dataAndResponse.data).toBe(response);
    expect(dataAndResponse.response).toBe(rawResponse);
  });

  test('retrieveSearch: required and optional params', async () => {
    const response = await client.x.lists.retrieveSearch({
      q: 'q',
      cursor: 'cursor',
      fields: 'id,text,author.username',
      omit: 'entities,media',
      pageSize: 1,
    });
  });

  test('retrieveTweets', async () => {
    const responsePromise = client.x.lists.retrieveTweets('id');
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
      client.x.lists.retrieveTweets(
        'id',
        {
          advancedQuery: 'advancedQuery',
          after: 'after',
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
          includeReplies: true,
          inReplyToTweetId: 'inReplyToTweetId',
          keywords: 'keywords',
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
});
