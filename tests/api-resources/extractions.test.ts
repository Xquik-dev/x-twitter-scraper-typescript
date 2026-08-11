// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import XTwitterScraper from 'x-twitter-scraper';

const client = new XTwitterScraper({
  apiKey: 'My API Key',
  bearerToken: 'My Bearer Token',
  baseURL: process.env['TEST_API_BASE_URL'] ?? 'http://127.0.0.1:4010',
});

describe('resource extractions', () => {
  // Mock server tests are disabled
  test.skip('retrieve', async () => {
    const responsePromise = client.extractions.retrieve('id');
    const rawResponse = await responsePromise.asResponse();
    expect(rawResponse).toBeInstanceOf(Response);
    const response = await responsePromise;
    expect(response).not.toBeInstanceOf(Response);
    const dataAndResponse = await responsePromise.withResponse();
    expect(dataAndResponse.data).toBe(response);
    expect(dataAndResponse.response).toBe(rawResponse);
  });

  // Mock server tests are disabled
  test.skip('retrieve: request options and params are passed correctly', async () => {
    // ensure the request options are being passed correctly by passing an invalid HTTP method in order to cause an error
    await expect(
      client.extractions.retrieve(
        'id',
        {
          cursor: 'cursor',
          fieldStyle: 'source',
          includeRaw: true,
          limit: 1,
          outputMode: 'compact',
          outputPreset: 'nested',
        },
        { path: '/_stainless_unknown_path' },
      ),
    ).rejects.toThrow(XTwitterScraper.NotFoundError);
  });

  // Mock server tests are disabled
  test.skip('list', async () => {
    const responsePromise = client.extractions.list();
    const rawResponse = await responsePromise.asResponse();
    expect(rawResponse).toBeInstanceOf(Response);
    const response = await responsePromise;
    expect(response).not.toBeInstanceOf(Response);
    const dataAndResponse = await responsePromise.withResponse();
    expect(dataAndResponse.data).toBe(response);
    expect(dataAndResponse.response).toBe(rawResponse);
  });

  // Mock server tests are disabled
  test.skip('list: request options and params are passed correctly', async () => {
    // ensure the request options are being passed correctly by passing an invalid HTTP method in order to cause an error
    await expect(
      client.extractions.list(
        {
          cursor: 'cursor',
          limit: 1,
          status: 'running',
          toolType: 'follower_explorer',
        },
        { path: '/_stainless_unknown_path' },
      ),
    ).rejects.toThrow(XTwitterScraper.NotFoundError);
  });

  // Mock server tests are disabled
  test.skip('estimateCost: only required params', async () => {
    const responsePromise = client.extractions.estimateCost({ toolType: 'follower_explorer' });
    const rawResponse = await responsePromise.asResponse();
    expect(rawResponse).toBeInstanceOf(Response);
    const response = await responsePromise;
    expect(response).not.toBeInstanceOf(Response);
    const dataAndResponse = await responsePromise.withResponse();
    expect(dataAndResponse.data).toBe(response);
    expect(dataAndResponse.response).toBe(rawResponse);
  });

  // Mock server tests are disabled
  test.skip('estimateCost: required and optional params', async () => {
    const response = await client.extractions.estimateCost({
      toolType: 'follower_explorer',
      advancedQuery: 'min_faves:100',
      anyWords: 'ChatGPT AI model',
      bioContains: 'bioContains',
      blueVerifiedOnly: true,
      boundingBox: '-74.1 40.6 -73.9 40.8',
      cardName: 'cardName',
      cashtags: '$TSLA $NVDA',
      collectionStrategy: 'auto',
      conversationId: '1234567890',
      dedupeAcrossTargets: true,
      dedupeMode: 'none',
      exactPhrase: 'artificial intelligence',
      excludeOriginalAuthor: true,
      excludeSource: 'excludeSource',
      excludeWords: 'spam',
      fromUser: 'nasa',
      geocode: 'geocode',
      hashtags: '#AI startups',
      hasLocation: true,
      hasMediaOnly: true,
      hasWebsite: true,
      includeOriginalPost: true,
      includeSearchTerms: true,
      includeTargetMetadata: true,
      inReplyToTweetId: '1234567890',
      language: 'en',
      listId: '1234567890',
      locationContains: 'locationContains',
      maxDepth: 1,
      maxFollowers: 0,
      maxFollowing: 0,
      maxId: 'maxId',
      maxItemsPerTarget: 1,
      maxLikes: 0,
      maxPagesPerTarget: 1,
      maxPosts: 0,
      maxQuotes: 0,
      maxReplies: 0,
      maxRetweets: 0,
      mediaType: 'images',
      mentioning: 'example_user',
      minAccountAgeDays: 0,
      minBookmarks: 0,
      minFaves: 10,
      minFollowers: 0,
      minFollowing: 0,
      minPosts: 0,
      minQuotes: 2,
      minReplies: 3,
      minRetweets: 5,
      minViews: 0,
      nativeRetweets: true,
      near: 'near',
      news: true,
      overlapMode: true,
      place: '96683cc9126741d1',
      placeCountry: 'US',
      pointRadius: '-73.99 40.73 25mi',
      queryType: 'Latest',
      quotes: 'include',
      quotesOfTweetId: '1234567890',
      relationTargets: [{ relation: 'community_members', value: 'x' }],
      replies: 'include',
      resultsLimit: 1000,
      retweets: 'exclude',
      retweetsOfTweetId: '1234567890',
      safe: true,
      scope: 'all',
      searchQueries: ['string'],
      searchQuery: 'AI trends 2025',
      sinceDate: '2025-01-01',
      sinceId: 'sinceId',
      sinceTime: '2019-12-27T18:11:19.117Z',
      sort: 'relevance',
      source: 'source',
      startCursor: 'x',
      targetCommunityId: '1500000000000000000',
      targetCommunityIds: ['string'],
      targetListId: '1234567890',
      targetListIds: ['string'],
      targets: ['string'],
      targetSpaceId: '1vOGwMdBqpwGB',
      targetTweetId: '1234567890',
      targetTweetIds: ['string'],
      targetUsername: 'elonmusk',
      targetUsernames: ['string'],
      toUser: 'openai',
      untilDate: '2025-12-31',
      untilTime: '2019-12-27T18:11:19.117Z',
      url: 'example.com',
      usernameContains: 'usernameContains',
      verifiedOnly: false,
      verifiedType: 'verifiedType',
      within: 'within',
      withinTime: 'withinTime',
    });
  });

  // Mock server tests are disabled
  test.skip('exportResults: required and optional params', async () => {
    const response = await client.extractions.exportResults('id', {
      format: 'csv',
      hasDescription: true,
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

  // Mock server tests are disabled
  test.skip('run: only required params', async () => {
    const responsePromise = client.extractions.run({ toolType: 'follower_explorer' });
    const rawResponse = await responsePromise.asResponse();
    expect(rawResponse).toBeInstanceOf(Response);
    const response = await responsePromise;
    expect(response).not.toBeInstanceOf(Response);
    const dataAndResponse = await responsePromise.withResponse();
    expect(dataAndResponse.data).toBe(response);
    expect(dataAndResponse.response).toBe(rawResponse);
  });

  // Mock server tests are disabled
  test.skip('run: required and optional params', async () => {
    const response = await client.extractions.run({
      toolType: 'follower_explorer',
      dry_run: true,
      advancedQuery: 'min_faves:100',
      anyWords: 'ChatGPT AI model',
      bioContains: 'bioContains',
      blueVerifiedOnly: true,
      boundingBox: '-74.1 40.6 -73.9 40.8',
      cardName: 'cardName',
      cashtags: '$TSLA $NVDA',
      collectionStrategy: 'auto',
      conversationId: '1234567890',
      dedupeAcrossTargets: true,
      dedupeMode: 'none',
      exactPhrase: 'artificial intelligence',
      excludeOriginalAuthor: true,
      excludeSource: 'excludeSource',
      excludeWords: 'spam',
      fromUser: 'nasa',
      geocode: 'geocode',
      hashtags: '#AI startups',
      hasLocation: true,
      hasMediaOnly: true,
      hasWebsite: true,
      includeOriginalPost: true,
      includeSearchTerms: true,
      includeTargetMetadata: true,
      inReplyToTweetId: '1234567890',
      language: 'en',
      listId: '1234567890',
      locationContains: 'locationContains',
      maxDepth: 1,
      maxFollowers: 0,
      maxFollowing: 0,
      maxId: 'maxId',
      maxItemsPerTarget: 1,
      maxLikes: 0,
      maxPagesPerTarget: 1,
      maxPosts: 0,
      maxQuotes: 0,
      maxReplies: 0,
      maxRetweets: 0,
      mediaType: 'images',
      mentioning: 'example_user',
      minAccountAgeDays: 0,
      minBookmarks: 0,
      minFaves: 10,
      minFollowers: 0,
      minFollowing: 0,
      minPosts: 0,
      minQuotes: 2,
      minReplies: 3,
      minRetweets: 5,
      minViews: 0,
      nativeRetweets: true,
      near: 'near',
      news: true,
      overlapMode: true,
      place: '96683cc9126741d1',
      placeCountry: 'US',
      pointRadius: '-73.99 40.73 25mi',
      queryType: 'Latest',
      quotes: 'include',
      quotesOfTweetId: '1234567890',
      relationTargets: [{ relation: 'community_members', value: 'x' }],
      replies: 'include',
      resultsLimit: 1000,
      retweets: 'exclude',
      retweetsOfTweetId: '1234567890',
      safe: true,
      scope: 'all',
      searchQueries: ['string'],
      searchQuery: 'AI trends 2025',
      sinceDate: '2025-01-01',
      sinceId: 'sinceId',
      sinceTime: '2019-12-27T18:11:19.117Z',
      sort: 'relevance',
      source: 'source',
      startCursor: 'x',
      targetCommunityId: '1500000000000000000',
      targetCommunityIds: ['string'],
      targetListId: '1234567890',
      targetListIds: ['string'],
      targets: ['string'],
      targetSpaceId: '1vOGwMdBqpwGB',
      targetTweetId: '1234567890',
      targetTweetIds: ['string'],
      targetUsername: 'elonmusk',
      targetUsernames: ['string'],
      toUser: 'openai',
      untilDate: '2025-12-31',
      untilTime: '2019-12-27T18:11:19.117Z',
      url: 'example.com',
      usernameContains: 'usernameContains',
      verifiedOnly: false,
      verifiedType: 'verifiedType',
      within: 'within',
      withinTime: 'withinTime',
    });
  });
});
