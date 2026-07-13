// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import XTwitterScraper from 'x-twitter-scraper';

const client = new XTwitterScraper({
  apiKey: 'My API Key',
  bearerToken: 'My Bearer Token',
  baseURL: process.env['TEST_API_BASE_URL'] ?? 'http://127.0.0.1:4010',
});

describe('resource guestWallets', () => {
  // Mock server tests are disabled
  test.skip('create: only required params', async () => {
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

  // Mock server tests are disabled
  test.skip('create: required and optional params', async () => {
    const response = await client.guestWallets.create({
      amount_minor: 1000,
      currency: 'usd',
      'Idempotency-Key': 'e1cb97D8-dDF3-4AaA-ad0a-49E4A0d1CfAa',
    });
  });

  // Mock server tests are disabled
  test.skip('retrieveStatus', async () => {
    const responsePromise = client.guestWallets.retrieveStatus();
    const rawResponse = await responsePromise.asResponse();
    expect(rawResponse).toBeInstanceOf(Response);
    const response = await responsePromise;
    expect(response).not.toBeInstanceOf(Response);
    const dataAndResponse = await responsePromise.withResponse();
    expect(dataAndResponse.data).toBe(response);
    expect(dataAndResponse.response).toBe(rawResponse);
  });

  // Mock server tests are disabled
  test.skip('topup: only required params', async () => {
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

  // Mock server tests are disabled
  test.skip('topup: required and optional params', async () => {
    const response = await client.guestWallets.topup({
      amount_minor: 1000,
      currency: 'usd',
      'Idempotency-Key': 'e1cb97D8-dDF3-4AaA-ad0a-49E4A0d1CfAa',
    });
  });
});
