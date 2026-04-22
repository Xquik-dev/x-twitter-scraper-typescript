// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import XTwitterScraper from 'x-twitter-scraper';

const client = new XTwitterScraper({
  apiKey: 'My API Key',
  baseURL: process.env['TEST_API_BASE_URL'] ?? 'http://127.0.0.1:4010',
});

describe('resource compose', () => {
  // Mock server tests are disabled
  test.skip('create: only required params', async () => {
    const responsePromise = client.compose.create({ step: 'compose' });
    const rawResponse = await responsePromise.asResponse();
    expect(rawResponse).toBeInstanceOf(Response);
    const response = await responsePromise;
    expect(response).not.toBeInstanceOf(Response);
    const dataAndResponse = await responsePromise.withResponse();
    expect(dataAndResponse.data).toBe(response);
    expect(dataAndResponse.response).toBe(rawResponse);
  });

  // Mock server tests are disabled
  test.skip('create: required and optional params', async () => {
    const response = await client.compose.create({
      step: 'compose',
      additionalContext: 'https://x.com/elonmusk/status/1234567890',
      callToAction: 'Follow for more',
      draft: "AI is changing everything. Here's why.",
      goal: 'engagement',
      hasLink: false,
      hasMedia: false,
      mediaType: 'none',
      styleUsername: 'elonmusk',
      tone: 'professional',
      topic: 'AI trends in 2025',
    });
  });
});
