// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import XTwitterScraper from 'x-twitter-scraper';

const client = new XTwitterScraper({
  apiKey: 'My API Key',
  bearerToken: 'My Bearer Token',
  baseURL: process.env['TEST_API_BASE_URL'] ?? 'http://127.0.0.1:4010',
});

describe('resource draws', () => {
  // Mock server tests are disabled
  test.skip('retrieve', async () => {
    const responsePromise = client.draws.retrieve('f4bd00a2-7b4e-4e59-8e1b-72e2c9f12345');
    const rawResponse = await responsePromise.asResponse();
    expect(rawResponse).toBeInstanceOf(Response);
    const response = await responsePromise;
    expect(response).not.toBeInstanceOf(Response);
    const dataAndResponse = await responsePromise.withResponse();
    expect(dataAndResponse.data).toBe(response);
    expect(dataAndResponse.response).toBe(rawResponse);
  });

  // Mock server tests are disabled
  test.skip('list', async () => {
    const responsePromise = client.draws.list();
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
      client.draws.list({ cursor: 'cursor', limit: 1 }, { path: '/_stainless_unknown_path' }),
    ).rejects.toThrow(XTwitterScraper.NotFoundError);
  });

  // Mock server tests are disabled
  test.skip('export: required and optional params', async () => {
    const response = await client.draws.export('f4bd00a2-7b4e-4e59-8e1b-72e2c9f12345', {
      format: 'csv',
      type: 'winners',
    });
  });

  // Mock server tests are disabled
  test.skip('run: only required params', async () => {
    const responsePromise = client.draws.run({ tweetUrl: 'https://x.com/elonmusk/status/1234567890' });
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
    const response = await client.draws.run({
      tweetUrl: 'https://x.com/elonmusk/status/1234567890',
      backupCount: 2,
      filterAccountAgeDays: 30,
      filterLanguage: 'en',
      filterMinFollowers: 50,
      mustFollowUsername: 'elonmusk',
      mustRetweet: true,
      requiredHashtags: ['#giveaway'],
      requiredKeywords: ['entered'],
      requiredMentions: ['@elonmusk'],
      uniqueAuthorsOnly: true,
      winnerCount: 3,
    });
  });
});
