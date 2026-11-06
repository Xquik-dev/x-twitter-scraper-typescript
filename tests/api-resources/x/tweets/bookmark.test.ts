// SPDX-FileCopyrightText: 2026 Xquik contributors
//
// SPDX-License-Identifier: Apache-2.0

import XTwitterScraper from 'x-twitter-scraper';

const client = new XTwitterScraper({
  apiKey: 'My API Key',
  bearerToken: 'My Bearer Token',
  baseURL: process.env['TEST_API_BASE_URL'] ?? 'http://127.0.0.1:4010',
});

describe('resource bookmark', () => {
  test('create: only required params', async () => {
    const responsePromise = client.x.tweets.bookmark.create('id', {
      account: '@elonmusk',
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
    await client.x.tweets.bookmark.create('id', {
      account: '@elonmusk',
      'Idempotency-Key': 'Idempotency-Key',
      Prefer: 'wait=50',
    });
  });

  test('delete: only required params', async () => {
    const responsePromise = client.x.tweets.bookmark.delete('id', {
      account: '@elonmusk',
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
    await client.x.tweets.bookmark.delete('id', {
      account: '@elonmusk',
      'Idempotency-Key': 'Idempotency-Key',
      Prefer: 'wait=50',
    });
  });
});
