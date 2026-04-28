// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import XTwitterScraper from 'x-twitter-scraper';

const client = new XTwitterScraper({
  apiKey: 'My API Key',
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
      client.extractions.retrieve('id', { after: 'after', limit: 1 }, { path: '/_stainless_unknown_path' }),
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
          after: 'after',
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
      exactPhrase: 'artificial intelligence',
      excludeWords: 'spam',
      searchQuery: 'AI trends 2025',
      targetCommunityId: '1500000000000000000',
      targetListId: '1234567890',
      targetSpaceId: '1vOGwMdBqpwGB',
      targetTweetId: '1234567890',
      targetUsername: 'elonmusk',
    });
  });

  // Mock server tests are disabled
  test.skip('exportResults: request options and params are passed correctly', async () => {
    // ensure the request options are being passed correctly by passing an invalid HTTP method in order to cause an error
    await expect(
      client.extractions.exportResults('id', { format: 'csv' }, { path: '/_stainless_unknown_path' }),
    ).rejects.toThrow(XTwitterScraper.NotFoundError);
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
      exactPhrase: 'artificial intelligence',
      excludeWords: 'spam',
      searchQuery: 'AI trends 2025',
      targetCommunityId: '1500000000000000000',
      targetListId: '1234567890',
      targetSpaceId: '1vOGwMdBqpwGB',
      targetTweetId: '1234567890',
      targetUsername: 'elonmusk',
    });
  });
});
