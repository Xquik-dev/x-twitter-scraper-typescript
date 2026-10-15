// SPDX-FileCopyrightText: 2026 Xquik contributors
//
// SPDX-License-Identifier: Apache-2.0

import XTwitterScraper from 'x-twitter-scraper';
import { fixtureClient } from '../fixture-client';

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

  test('create: returns a replayed purchase without the one-time credential', async () => {
    const example: XTwitterScraper.GuestWalletCreateResponse = {
      account_required: false,
      amount: { amount_minor: 1000, currency: 'usd' },
      checkout_url: 'https://checkout.example/guest/example',
      credits: '66666',
      expires_at: '2026-07-13T13:00:00.000Z',
      instructions:
        'Give checkout_url to the user. They must complete payment on the hosted checkout page. Never submit payment for them. After payment, poll status_url every poll_after_seconds until latest_purchase.status is no longer pending.',
      poll_after_seconds: 2,
      purchase_id: 'gp_example',
      requires_user_interaction: true,
      status: 'pending',
      status_url: 'https://xquik.com/api/v1/guest-wallets/status',
      wallet_id: 'gw_example',
    };
    const { client: fixture } = fixtureClient(example);

    const response: XTwitterScraper.GuestWalletCreateResponse = await fixture.guestWallets.create({
      amount_minor: 1000,
      currency: 'usd',
      'Idempotency-Key': 'e1cb97D8-dDF3-4AaA-ad0a-49E4A0d1CfAa',
    });

    expect(response).toEqual(example);
  });
});
