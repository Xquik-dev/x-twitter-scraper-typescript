// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import XTwitterScraper from 'x-twitter-scraper';

const client = new XTwitterScraper({
  apiKey: 'My API Key',
  bearerToken: 'My Bearer Token',
  baseURL: process.env['TEST_API_BASE_URL'] ?? 'http://127.0.0.1:4010',
});

describe('resource bot', () => {
  // Mock server tests are disabled
  test.skip('trackUsage: only required params', async () => {
    const responsePromise = client.bot.trackUsage({
      inputTokens: 0,
      outputTokens: 0,
      platformUserId: 'platformUserId',
    });
    const rawResponse = await responsePromise.asResponse();
    expect(rawResponse).toBeInstanceOf(Response);
    const response = await responsePromise;
    expect(response).not.toBeInstanceOf(Response);
    const dataAndResponse = await responsePromise.withResponse();
    expect(dataAndResponse.data).toBe(response);
    expect(dataAndResponse.response).toBe(rawResponse);
  });

  // Mock server tests are disabled
  test.skip('trackUsage: required and optional params', async () => {
    const response = await client.bot.trackUsage({
      inputTokens: 0,
      outputTokens: 0,
      platformUserId: 'platformUserId',
    });
  });
});
