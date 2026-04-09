// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import XTwitterScraper from 'x-twitter-scraper';

const client = new XTwitterScraper({
  apiKey: 'My API Key',
  baseURL: process.env['TEST_API_BASE_URL'] ?? 'http://127.0.0.1:4010',
});

describe('resource radar', () => {
  // Mock server tests are disabled
  test.skip('retrieveTrendingTopics', async () => {
    const responsePromise = client.radar.retrieveTrendingTopics();
    const rawResponse = await responsePromise.asResponse();
    expect(rawResponse).toBeInstanceOf(Response);
    const response = await responsePromise;
    expect(response).not.toBeInstanceOf(Response);
    const dataAndResponse = await responsePromise.withResponse();
    expect(dataAndResponse.data).toBe(response);
    expect(dataAndResponse.response).toBe(rawResponse);
  });

  // Mock server tests are disabled
  test.skip('retrieveTrendingTopics: request options and params are passed correctly', async () => {
    // ensure the request options are being passed correctly by passing an invalid HTTP method in order to cause an error
    await expect(
      client.radar.retrieveTrendingTopics(
        {
          category: 'category',
          count: 0,
          hours: 0,
          region: 'region',
          source: 'github',
        },
        { path: '/_stainless_unknown_path' },
      ),
    ).rejects.toThrow(XTwitterScraper.NotFoundError);
  });
});
