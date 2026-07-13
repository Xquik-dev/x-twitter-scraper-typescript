// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import XTwitterScraper from 'x-twitter-scraper';

const client = new XTwitterScraper({
  apiKey: 'My API Key',
  bearerToken: 'My Bearer Token',
  baseURL: process.env['TEST_API_BASE_URL'] ?? 'http://127.0.0.1:4010',
});

describe('resource dm', () => {
  test('retrieveHistory: only required params', async () => {
    const responsePromise = client.x.dm.retrieveHistory('userId', { account: 'account' });
    const rawResponse = await responsePromise.asResponse();
    expect(rawResponse).toBeInstanceOf(Response);
    const response = await responsePromise;
    expect(response).not.toBeInstanceOf(Response);
    const dataAndResponse = await responsePromise.withResponse();
    expect(dataAndResponse.data).toBe(response);
    expect(dataAndResponse.response).toBe(rawResponse);
  });

  test('retrieveHistory: required and optional params', async () => {
    const response = await client.x.dm.retrieveHistory('userId', {
      account: 'account',
      cursor: 'cursor',
      maxId: 'maxId',
    });
  });

  test('send: only required params', async () => {
    const responsePromise = client.x.dm.send('userId', {
      account: '@elonmusk',
      text: 'Example text content',
    });
    const rawResponse = await responsePromise.asResponse();
    expect(rawResponse).toBeInstanceOf(Response);
    const response = await responsePromise;
    expect(response).not.toBeInstanceOf(Response);
    const dataAndResponse = await responsePromise.withResponse();
    expect(dataAndResponse.data).toBe(response);
    expect(dataAndResponse.response).toBe(rawResponse);
  });

  test('send: required and optional params', async () => {
    const response = await client.x.dm.send('userId', {
      account: '@elonmusk',
      text: 'Example text content',
      media_ids: ['1234567890123456789'],
    });
  });
});
