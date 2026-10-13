// SPDX-FileCopyrightText: 2026 Xquik contributors
//
// SPDX-License-Identifier: Apache-2.0

import XTwitterScraper from 'x-twitter-scraper';

const client = new XTwitterScraper({
  apiKey: 'My API Key',
  bearerToken: 'My Bearer Token',
  baseURL: process.env['TEST_API_BASE_URL'] ?? 'http://127.0.0.1:4010',
});

describe('resource extractions', () => {
  test('retrieve', async () => {
    const responsePromise = client.extractions.retrieve('L3NjAbCdEfGh');
    const rawResponse = await responsePromise.asResponse();
    expect(rawResponse).toBeInstanceOf(Response);
    const response = await responsePromise;
    expect(response).not.toBeInstanceOf(Response);
    const dataAndResponse = await responsePromise.withResponse();
    expect(dataAndResponse.data).toBe(response);
    expect(dataAndResponse.response).toBe(rawResponse);
  });

  test('retrieve: request options and params are passed correctly', async () => {
    // ensure the request options are being passed correctly by passing an invalid HTTP method in order to cause an error
    await expect(
      client.extractions.retrieve(
        'L3NjAbCdEfGh',
        {
          cursor: 'cursor',
          fieldStyle: 'source',
          includeRaw: true,
          limit: 1,
          outputMode: 'compact',
          outputPreset: 'nested',
          wait: 0,
        },
        { path: '/_stainless_unknown_path' },
      ),
    ).rejects.toThrow(XTwitterScraper.NotFoundError);
  });

  test('list', async () => {
    const responsePromise = client.extractions.list();
    const rawResponse = await responsePromise.asResponse();
    expect(rawResponse).toBeInstanceOf(Response);
    const response = await responsePromise;
    expect(response).not.toBeInstanceOf(Response);
    const dataAndResponse = await responsePromise.withResponse();
    expect(dataAndResponse.data).toBe(response);
    expect(dataAndResponse.response).toBe(rawResponse);
  });

  test('list: request options and params are passed correctly', async () => {
    // ensure the request options are being passed correctly by passing an invalid HTTP method in order to cause an error
    await expect(
      client.extractions.list(
        {
          cursor: 'cursor',
          limit: 1,
          status: 'pending',
          toolType: 'follower_explorer',
        },
        { path: '/_stainless_unknown_path' },
      ),
    ).rejects.toThrow(XTwitterScraper.NotFoundError);
  });

  test('cancel', async () => {
    const responsePromise = client.extractions.cancel('L3NjAbCdEfGh');
    const rawResponse = await responsePromise.asResponse();
    expect(rawResponse).toBeInstanceOf(Response);
    const response = await responsePromise;
    expect(response).not.toBeInstanceOf(Response);
    const dataAndResponse = await responsePromise.withResponse();
    expect(dataAndResponse.data).toBe(response);
    expect(dataAndResponse.response).toBe(rawResponse);
  });

  test('estimateCost: only required params', async () => {
    const responsePromise = client.extractions.estimateCost({ toolType: 'follower_explorer' });
    const rawResponse = await responsePromise.asResponse();
    expect(rawResponse).toBeInstanceOf(Response);
    const response = await responsePromise;
    expect(response).not.toBeInstanceOf(Response);
    const dataAndResponse = await responsePromise.withResponse();
    expect(dataAndResponse.data).toBe(response);
    expect(dataAndResponse.response).toBe(rawResponse);
  });

  test('estimateCost: required and optional params', async () => {
    const response = await client.extractions.estimateCost({
      toolType: 'follower_explorer',
      advancedQuery: 'advancedQuery',
      anyWords: 'anyWords',
      bioContains: 'space, astronomy',
      blueVerifiedOnly: true,
      boundingBox: 'boundingBox',
      businessEmailOnly: true,
      cardName: 'cardName',
      cashtags: 'cashtags',
      collectionStrategy: 'auto',
      conversationId: 'conversationId',
      dedupeAcrossTargets: true,
      dedupeMode: 'none',
      emailDomains: 'nasa.gov',
      enrichProfiles: true,
      exactPhrase: 'exactPhrase',
      excludeOriginalAuthor: true,
      excludeSource: 'excludeSource',
      excludeWords: 'excludeWords',
      fromUser: 'fromUser',
      geocode: 'geocode',
      hasEmail: true,
      hashtags: 'hashtags',
      hasLocation: true,
      hasMediaOnly: true,
      hasWebsite: true,
      includeOriginalPost: true,
      includeSearchTerms: true,
      includeTargetMetadata: true,
      inReplyToTweetId: 'inReplyToTweetId',
      language: 'language',
      listId: 'listId',
      locationContains: 'Houston',
      maxDepth: 1,
      maxFollowers: 1000000,
      maxFollowing: 5000,
      maxId: 'maxId',
      maxItemsPerTarget: 1,
      maxLikes: 0,
      maxPagesPerTarget: 1,
      maxPosts: 100000,
      maxQuotes: 0,
      maxReplies: 0,
      maxRetweets: 0,
      mediaType: 'images',
      mentioning: 'mentioning',
      minAccountAgeDays: 365,
      minBookmarks: 0,
      minFaves: 0,
      minFollowers: 1000,
      minFollowing: 10,
      minPosts: 100,
      minQuotes: 0,
      minReplies: 0,
      minRetweets: 0,
      minViews: 0,
      nativeRetweets: true,
      near: 'near',
      news: true,
      overlapMode: true,
      place: 'place',
      placeCountry: 'placeCountry',
      pointRadius: 'pointRadius',
      queryType: 'Latest',
      quotes: 'include',
      quotesOfTweetId: 'quotesOfTweetId',
      relationTargets: [{ relation: 'community_members', value: 'x' }],
      replies: 'include',
      resultsLimit: 500,
      retweets: 'include',
      retweetsOfTweetId: 'retweetsOfTweetId',
      safe: true,
      scope: 'all',
      searchQueries: ['string'],
      searchQuery: 'searchQuery',
      sinceDate: '2019-12-27',
      sinceId: 'sinceId',
      sinceTime: '2019-12-27T18:11:19.117Z',
      sort: 'relevance',
      source: 'source',
      startCursor: 'x',
      targetCommunityId: 'targetCommunityId',
      targetCommunityIds: ['string'],
      targetListId: 'targetListId',
      targetListIds: ['string'],
      targets: ['string'],
      targetSpaceId: 'targetSpaceId',
      targetTweetId: 'targetTweetId',
      targetTweetIds: ['string'],
      targetUsername: 'NASA',
      targetUsernames: ['string'],
      toUser: 'toUser',
      untilDate: '2019-12-27',
      untilTime: '2019-12-27T18:11:19.117Z',
      url: 'url',
      usernameContains: 'space',
      verifiedOnly: true,
      verifiedType: 'Business',
      within: 'within',
      withinTime: 'withinTime',
    });
  });

  test('exportResults: required and optional params', async () => {
    const response = await client.extractions.exportResults('L3NjAbCdEfGh', {
      format: 'csv',
      businessEmailOnly: true,
      emailDomains: 'acme.com,stanford.edu',
      hasDescription: true,
      hasEmail: true,
      hasLocation: true,
      hasMedia: true,
      lang: 'lang',
      maxFollowers: 0,
      maxFollowing: 0,
      maxPosts: 0,
      minFollowers: 0,
      minFollowing: 0,
      minLikes: 0,
      minPosts: 0,
      minReplies: 0,
      minRetweets: 0,
      minViews: 0,
      search: 'search',
      sinceDate: '2019-12-27',
      untilDate: '2019-12-27',
      verified: true,
    });
  });

  test('run: only required params', async () => {
    const responsePromise = client.extractions.run({ toolType: 'follower_explorer' });
    const rawResponse = await responsePromise.asResponse();
    expect(rawResponse).toBeInstanceOf(Response);
    const response = await responsePromise;
    expect(response).not.toBeInstanceOf(Response);
    const dataAndResponse = await responsePromise.withResponse();
    expect(dataAndResponse.data).toBe(response);
    expect(dataAndResponse.response).toBe(rawResponse);
  });

  test('run: required and optional params', async () => {
    const response = await client.extractions.run({
      toolType: 'follower_explorer',
      dry_run: true,
      advancedQuery: 'advancedQuery',
      anyWords: 'anyWords',
      bioContains: 'space, astronomy',
      blueVerifiedOnly: true,
      boundingBox: 'boundingBox',
      businessEmailOnly: true,
      cardName: 'cardName',
      cashtags: 'cashtags',
      collectionStrategy: 'auto',
      conversationId: 'conversationId',
      dedupeAcrossTargets: true,
      dedupeMode: 'none',
      emailDomains: 'nasa.gov',
      enrichProfiles: true,
      exactPhrase: 'exactPhrase',
      excludeOriginalAuthor: true,
      excludeSource: 'excludeSource',
      excludeWords: 'excludeWords',
      fromUser: 'fromUser',
      geocode: 'geocode',
      hasEmail: true,
      hashtags: 'hashtags',
      hasLocation: true,
      hasMediaOnly: true,
      hasWebsite: true,
      includeOriginalPost: true,
      includeSearchTerms: true,
      includeTargetMetadata: true,
      inReplyToTweetId: 'inReplyToTweetId',
      language: 'language',
      listId: 'listId',
      locationContains: 'Houston',
      maxDepth: 1,
      maxFollowers: 1000000,
      maxFollowing: 5000,
      maxId: 'maxId',
      maxItemsPerTarget: 1,
      maxLikes: 0,
      maxPagesPerTarget: 1,
      maxPosts: 100000,
      maxQuotes: 0,
      maxReplies: 0,
      maxRetweets: 0,
      mediaType: 'images',
      mentioning: 'mentioning',
      minAccountAgeDays: 365,
      minBookmarks: 0,
      minFaves: 0,
      minFollowers: 1000,
      minFollowing: 10,
      minPosts: 100,
      minQuotes: 0,
      minReplies: 0,
      minRetweets: 0,
      minViews: 0,
      nativeRetweets: true,
      near: 'near',
      news: true,
      overlapMode: true,
      place: 'place',
      placeCountry: 'placeCountry',
      pointRadius: 'pointRadius',
      queryType: 'Latest',
      quotes: 'include',
      quotesOfTweetId: 'quotesOfTweetId',
      relationTargets: [{ relation: 'community_members', value: 'x' }],
      replies: 'include',
      resultsLimit: 500,
      retweets: 'include',
      retweetsOfTweetId: 'retweetsOfTweetId',
      safe: true,
      scope: 'all',
      searchQueries: ['string'],
      searchQuery: 'searchQuery',
      sinceDate: '2019-12-27',
      sinceId: 'sinceId',
      sinceTime: '2019-12-27T18:11:19.117Z',
      sort: 'relevance',
      source: 'source',
      startCursor: 'x',
      targetCommunityId: 'targetCommunityId',
      targetCommunityIds: ['string'],
      targetListId: 'targetListId',
      targetListIds: ['string'],
      targets: ['string'],
      targetSpaceId: 'targetSpaceId',
      targetTweetId: 'targetTweetId',
      targetTweetIds: ['string'],
      targetUsername: 'NASA',
      targetUsernames: ['string'],
      toUser: 'toUser',
      untilDate: '2019-12-27',
      untilTime: '2019-12-27T18:11:19.117Z',
      url: 'url',
      usernameContains: 'space',
      verifiedOnly: true,
      verifiedType: 'Business',
      within: 'within',
      withinTime: 'withinTime',
      'Idempotency-Key': 'Idempotency-Key',
    });
  });
});
