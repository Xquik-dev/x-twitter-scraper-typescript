// SPDX-FileCopyrightText: 2026 Xquik contributors
//
// SPDX-License-Identifier: Apache-2.0

// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import XTwitterScraper from 'x-twitter-scraper';

const client = new XTwitterScraper({
  apiKey: 'My API Key',
  bearerToken: 'My Bearer Token',
  baseURL: process.env['TEST_API_BASE_URL'] ?? 'http://127.0.0.1:4010',
});

describe('resource guestWallets', () => {
  test('create: only required params', async () => {
    const responsePromise = client.guestWallets.create({
      amount_minor: 1000,
      currency: 'usd',
      'Idempotency-Key': 'e1cb97D8-dDF3-4AaA-ad0a-49E4A0d1CfAa',
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
    const response = await client.guestWallets.create({
      amount_minor: 1000,
      currency: 'usd',
      'Idempotency-Key': 'e1cb97D8-dDF3-4AaA-ad0a-49E4A0d1CfAa',
    });
  });

  test('retrieveStatus', async () => {
    const responsePromise = client.guestWallets.retrieveStatus();
    const rawResponse = await responsePromise.asResponse();
    expect(rawResponse).toBeInstanceOf(Response);
    const response = await responsePromise;
    expect(response).not.toBeInstanceOf(Response);
    const dataAndResponse = await responsePromise.withResponse();
    expect(dataAndResponse.data).toBe(response);
    expect(dataAndResponse.response).toBe(rawResponse);
  });

  test('topup: only required params', async () => {
    const responsePromise = client.guestWallets.topup({
      amount_minor: 1000,
      currency: 'usd',
      'Idempotency-Key': 'e1cb97D8-dDF3-4AaA-ad0a-49E4A0d1CfAa',
    });
    const rawResponse = await responsePromise.asResponse();
    expect(rawResponse).toBeInstanceOf(Response);
    const response = await responsePromise;
    expect(response).not.toBeInstanceOf(Response);
    const dataAndResponse = await responsePromise.withResponse();
    expect(dataAndResponse.data).toBe(response);
    expect(dataAndResponse.response).toBe(rawResponse);
  });

  test('topup: required and optional params', async () => {
    const response = await client.guestWallets.topup({
      amount_minor: 1000,
      currency: 'usd',
      'Idempotency-Key': 'e1cb97D8-dDF3-4AaA-ad0a-49E4A0d1CfAa',
    });
  });

  test('uses a Bearer guest key for status and top-up requests', async () => {
    const requests: Request[] = [];
    const bearerClient = new XTwitterScraper({
      apiKey: null,
      bearerToken: 'guest-key',
      baseURL: 'https://example.com/api/v1',
      fetch: async (input, init) => {
        requests.push(new Request(input, init));
        return Response.json({});
      },
    });

    await bearerClient.guestWallets.retrieveStatus();
    await bearerClient.guestWallets.topup({
      amount_minor: 1000,
      currency: 'usd',
      'Idempotency-Key': 'e1cb97D8-dDF3-4AaA-ad0a-49E4A0d1CfAa',
    });

    expect(requests).toHaveLength(2);
    for (const request of requests) {
      expect(request.headers.get('authorization')).toBe('Bearer guest-key');
      expect(request.headers.has('x-api-key')).toBe(false);
    }
  });

  test('excludes browser-session-only resources', () => {
    expect(client).not.toHaveProperty('apiKeys');
    expect(client.credits).not.toHaveProperty('quickTopupBalance');
  });
});
