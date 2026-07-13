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
      client.extractions.retrieve('id', { cursor: 'cursor', limit: 1 }, { path: '/_stainless_unknown_path' }),
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
      boundingBox: '-74.1 40.6 -73.9 40.8',
      cashtags: '$TSLA $NVDA',
      conversationId: '1234567890',
      exactPhrase: 'artificial intelligence',
      excludeWords: 'spam',
      fromUser: 'nasa',
      hashtags: '#AI startups',
      inReplyToTweetId: '1234567890',
      language: 'en',
      listId: '1234567890',
      mediaType: 'images',
      mentioning: 'example_user',
      minFaves: 10,
      minQuotes: 2,
      minReplies: 3,
      minRetweets: 5,
      place: '96683cc9126741d1',
      placeCountry: 'US',
      pointRadius: '-73.99 40.73 25mi',
      quotes: 'include',
      quotesOfTweetId: '1234567890',
      replies: 'include',
      resultsLimit: 1000,
      retweets: 'exclude',
      retweetsOfTweetId: '1234567890',
      searchQuery: 'AI trends 2025',
      sinceDate: '2025-01-01',
      targetCommunityId: '1500000000000000000',
      targetListId: '1234567890',
      targetSpaceId: '1vOGwMdBqpwGB',
      targetTweetId: '1234567890',
      targetUsername: 'elonmusk',
      toUser: 'openai',
      untilDate: '2025-12-31',
      url: 'example.com',
      verifiedOnly: false,
    });
  });

  // Mock server tests are disabled
  test.skip('exportResults: required and optional params', async () => {
    const response = await client.extractions.exportResults('id', { format: 'csv' });
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
      advancedQuery: 'min_faves:100',
      anyWords: 'ChatGPT AI model',
      boundingBox: '-74.1 40.6 -73.9 40.8',
      cashtags: '$TSLA $NVDA',
      conversationId: '1234567890',
      exactPhrase: 'artificial intelligence',
      excludeWords: 'spam',
      fromUser: 'nasa',
      hashtags: '#AI startups',
      inReplyToTweetId: '1234567890',
      language: 'en',
      listId: '1234567890',
      mediaType: 'images',
      mentioning: 'example_user',
      minFaves: 10,
      minQuotes: 2,
      minReplies: 3,
      minRetweets: 5,
      place: '96683cc9126741d1',
      placeCountry: 'US',
      pointRadius: '-73.99 40.73 25mi',
      quotes: 'include',
      quotesOfTweetId: '1234567890',
      replies: 'include',
      resultsLimit: 1000,
      retweets: 'exclude',
      retweetsOfTweetId: '1234567890',
      searchQuery: 'AI trends 2025',
      sinceDate: '2025-01-01',
      targetCommunityId: '1500000000000000000',
      targetListId: '1234567890',
      targetSpaceId: '1vOGwMdBqpwGB',
      targetTweetId: '1234567890',
      targetUsername: 'elonmusk',
      toUser: 'openai',
      untilDate: '2025-12-31',
      url: 'example.com',
      verifiedOnly: false,
    });
  });
});
