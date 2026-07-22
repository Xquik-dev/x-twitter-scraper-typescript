// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import XTwitterScraper from 'x-twitter-scraper';

const client = new XTwitterScraper({
  apiKey: 'My API Key',
  bearerToken: 'My Bearer Token',
  baseURL: process.env['TEST_API_BASE_URL'] ?? 'http://127.0.0.1:4010',
});

describe('resource profile', () => {
  test('update: only required params', async () => {
    const responsePromise = client.x.profile.update({
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

  test('update: required and optional params', async () => {
    const response = await client.x.profile.update({
      account: '@elonmusk',
      'Idempotency-Key': 'Idempotency-Key',
      description: 'description_value',
      location: 'location_value',
      name: 'Example Name',
      url: 'https://xquik.com/example',
    });
  });

  test('updateAvatar: only required params', async () => {
    const responsePromise = client.x.profile.updateAvatar({
      account: '@elonmusk',
      url: 'https://example.com/avatar.png',
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

  test('updateAvatar: required and optional params', async () => {
    const response = await client.x.profile.updateAvatar({
      account: '@elonmusk',
      url: 'https://example.com/avatar.png',
      'Idempotency-Key': 'Idempotency-Key',
    });
  });

  test('updateBanner: only required params', async () => {
    const responsePromise = client.x.profile.updateBanner({
      account: '@elonmusk',
      url: 'https://example.com/banner.png',
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

  test('updateBanner: required and optional params', async () => {
    const response = await client.x.profile.updateBanner({
      account: '@elonmusk',
      url: 'https://example.com/banner.png',
      'Idempotency-Key': 'Idempotency-Key',
    });
  });
});
