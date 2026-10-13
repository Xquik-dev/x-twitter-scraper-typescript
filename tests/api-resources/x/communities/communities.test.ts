// SPDX-FileCopyrightText: 2026 Xquik contributors
//
// SPDX-License-Identifier: Apache-2.0

import XTwitterScraper from 'x-twitter-scraper';

const client = new XTwitterScraper({
  apiKey: 'My API Key',
  bearerToken: 'My Bearer Token',
  baseURL: process.env['TEST_API_BASE_URL'] ?? 'http://127.0.0.1:4010',
});

describe('resource communities', () => {
  test('create: only required params', async () => {
    const responsePromise = client.x.communities.create({
      account: '@elonmusk',
      name: 'Example Name',
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
    const response = await client.x.communities.create({
      account: '@elonmusk',
      name: 'Example Name',
      'Idempotency-Key': 'Idempotency-Key',
      description: 'A community for Tesla enthusiasts',
    });
  });

  test('delete: only required params', async () => {
    const responsePromise = client.x.communities.delete('1500000000000000000', {
      account: '@elonmusk',
      community_name: 'Tesla Fans',
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
    const response = await client.x.communities.delete('1500000000000000000', {
      account: '@elonmusk',
      community_name: 'Tesla Fans',
      'Idempotency-Key': 'Idempotency-Key',
    });
  });

  test('find: only required params', async () => {
    const responsePromise = client.x.communities.find({ q: 'q' });
    const rawResponse = await responsePromise.asResponse();
    expect(rawResponse).toBeInstanceOf(Response);
    const response = await responsePromise;
    expect(response).not.toBeInstanceOf(Response);
    const dataAndResponse = await responsePromise.withResponse();
    expect(dataAndResponse.data).toBe(response);
    expect(dataAndResponse.response).toBe(rawResponse);
  });

  test('find: required and optional params', async () => {
    const response = await client.x.communities.find({
      q: 'q',
      cursor: 'cursor',
      fields: 'id,text,author.username',
      omit: 'entities,media',
      pageSize: 1,
    });
  });

  test('listPopular', async () => {
    const responsePromise = client.x.communities.listPopular();
    const rawResponse = await responsePromise.asResponse();
    expect(rawResponse).toBeInstanceOf(Response);
    const response = await responsePromise;
    expect(response).not.toBeInstanceOf(Response);
    const dataAndResponse = await responsePromise.withResponse();
    expect(dataAndResponse.data).toBe(response);
    expect(dataAndResponse.response).toBe(rawResponse);
  });

  test('listPopular: request options and params are passed correctly', async () => {
    // ensure the request options are being passed correctly by passing an invalid HTTP method in order to cause an error
    await expect(
      client.x.communities.listPopular(
        {
          cursor: 'cursor',
          fields: 'id,text,author.username',
          omit: 'entities,media',
          pageSize: 1,
          topic: 'topic',
          topicId: 'topicId',
        },
        { path: '/_stainless_unknown_path' },
      ),
    ).rejects.toThrow(XTwitterScraper.NotFoundError);
  });

  test('listSuggested', async () => {
    const responsePromise = client.x.communities.listSuggested();
    const rawResponse = await responsePromise.asResponse();
    expect(rawResponse).toBeInstanceOf(Response);
    const response = await responsePromise;
    expect(response).not.toBeInstanceOf(Response);
    const dataAndResponse = await responsePromise.withResponse();
    expect(dataAndResponse.data).toBe(response);
    expect(dataAndResponse.response).toBe(rawResponse);
  });

  test('listSuggested: request options and params are passed correctly', async () => {
    // ensure the request options are being passed correctly by passing an invalid HTTP method in order to cause an error
    await expect(
      client.x.communities.listSuggested(
        { fields: 'id,text,author.username', limit: 1, omit: 'entities,media' },
        { path: '/_stainless_unknown_path' },
      ),
    ).rejects.toThrow(XTwitterScraper.NotFoundError);
  });

  test('listTopics', async () => {
    const responsePromise = client.x.communities.listTopics();
    const rawResponse = await responsePromise.asResponse();
    expect(rawResponse).toBeInstanceOf(Response);
    const response = await responsePromise;
    expect(response).not.toBeInstanceOf(Response);
    const dataAndResponse = await responsePromise.withResponse();
    expect(dataAndResponse.data).toBe(response);
    expect(dataAndResponse.response).toBe(rawResponse);
  });

  test('listTopics: request options and params are passed correctly', async () => {
    // ensure the request options are being passed correctly by passing an invalid HTTP method in order to cause an error
    await expect(
      client.x.communities.listTopics(
        { fields: 'id,text,author.username', limit: 1, omit: 'entities,media' },
        { path: '/_stainless_unknown_path' },
      ),
    ).rejects.toThrow(XTwitterScraper.NotFoundError);
  });

  test('retrieveInfo', async () => {
    const responsePromise = client.x.communities.retrieveInfo('id');
    const rawResponse = await responsePromise.asResponse();
    expect(rawResponse).toBeInstanceOf(Response);
    const response = await responsePromise;
    expect(response).not.toBeInstanceOf(Response);
    const dataAndResponse = await responsePromise.withResponse();
    expect(dataAndResponse.data).toBe(response);
    expect(dataAndResponse.response).toBe(rawResponse);
  });

  test('retrieveInfo: request options and params are passed correctly', async () => {
    // ensure the request options are being passed correctly by passing an invalid HTTP method in order to cause an error
    await expect(
      client.x.communities.retrieveInfo(
        'id',
        { fields: 'id,text,author.username', omit: 'entities,media' },
        { path: '/_stainless_unknown_path' },
      ),
    ).rejects.toThrow(XTwitterScraper.NotFoundError);
  });

  test('retrieveMembers', async () => {
    const responsePromise = client.x.communities.retrieveMembers('id');
    const rawResponse = await responsePromise.asResponse();
    expect(rawResponse).toBeInstanceOf(Response);
    const response = await responsePromise;
    expect(response).not.toBeInstanceOf(Response);
    const dataAndResponse = await responsePromise.withResponse();
    expect(dataAndResponse.data).toBe(response);
    expect(dataAndResponse.response).toBe(rawResponse);
  });

  test('retrieveMembers: request options and params are passed correctly', async () => {
    // ensure the request options are being passed correctly by passing an invalid HTTP method in order to cause an error
    await expect(
      client.x.communities.retrieveMembers(
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

  test('retrieveModerators', async () => {
    const responsePromise = client.x.communities.retrieveModerators('id');
    const rawResponse = await responsePromise.asResponse();
    expect(rawResponse).toBeInstanceOf(Response);
    const response = await responsePromise;
    expect(response).not.toBeInstanceOf(Response);
    const dataAndResponse = await responsePromise.withResponse();
    expect(dataAndResponse.data).toBe(response);
    expect(dataAndResponse.response).toBe(rawResponse);
  });

  test('retrieveModerators: request options and params are passed correctly', async () => {
    // ensure the request options are being passed correctly by passing an invalid HTTP method in order to cause an error
    await expect(
      client.x.communities.retrieveModerators(
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
          usernameContains: 'usernameContains',
          verifiedOnly: true,
          verifiedType: 'verifiedType',
        },
        { path: '/_stainless_unknown_path' },
      ),
    ).rejects.toThrow(XTwitterScraper.NotFoundError);
  });

  test('retrieveSearch: only required params', async () => {
    const responsePromise = client.x.communities.retrieveSearch({ q: 'q' });
    const rawResponse = await responsePromise.asResponse();
    expect(rawResponse).toBeInstanceOf(Response);
    const response = await responsePromise;
    expect(response).not.toBeInstanceOf(Response);
    const dataAndResponse = await responsePromise.withResponse();
    expect(dataAndResponse.data).toBe(response);
    expect(dataAndResponse.response).toBe(rawResponse);
  });

  test('retrieveSearch: required and optional params', async () => {
    const response = await client.x.communities.retrieveSearch({
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

  test('searchMembers: only required params', async () => {
    const responsePromise = client.x.communities.searchMembers('id', { q: 'q' });
    const rawResponse = await responsePromise.asResponse();
    expect(rawResponse).toBeInstanceOf(Response);
    const response = await responsePromise;
    expect(response).not.toBeInstanceOf(Response);
    const dataAndResponse = await responsePromise.withResponse();
    expect(dataAndResponse.data).toBe(response);
    expect(dataAndResponse.response).toBe(rawResponse);
  });

  test('searchMembers: required and optional params', async () => {
    const response = await client.x.communities.searchMembers('id', {
      q: 'q',
      bioContains: 'bioContains',
      blueVerifiedOnly: true,
      businessEmailOnly: true,
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
      usernameContains: 'usernameContains',
      verifiedOnly: true,
      verifiedType: 'verifiedType',
    });
  });
});
