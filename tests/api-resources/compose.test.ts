// SPDX-FileCopyrightText: 2026 Xquik contributors
//
// SPDX-License-Identifier: Apache-2.0

import XTwitterScraper from 'x-twitter-scraper';

const client = new XTwitterScraper({
  apiKey: 'My API Key',
  bearerToken: 'My Bearer Token',
  baseURL: process.env['TEST_API_BASE_URL'] ?? 'http://127.0.0.1:4010',
});

describe('resource compose', () => {
  test('create: only required params', async () => {
    const responsePromise = client.compose.create({ step: 'compose', topic: 'PostgreSQL query planning' });
    const rawResponse = await responsePromise.asResponse();
    expect(rawResponse).toBeInstanceOf(Response);
    const response = await responsePromise;
    expect(response).not.toBeInstanceOf(Response);
    const dataAndResponse = await responsePromise.withResponse();
    expect(dataAndResponse.data).toBe(response);
    expect(dataAndResponse.response).toBe(rawResponse);
  });

  test('create: required and optional params', async () => {
    const response = await client.compose.create({
      step: 'compose',
      topic: 'PostgreSQL query planning',
      goal: 'engagement',
      styleUsername: 'example_user',
    });
  });

  test('create: accepts the multiplier text the API sends now', () => {
    const multiplier: XTwitterScraper.ComposeCreateResponse.ComposePrepareResult.EngagementMultiplier = {
      action: 'Reply',
      multiplier: 'Source default. Production value can vary.',
    };

    expect(multiplier.multiplier).toBe('Source default. Production value can vary.');
  });
});
