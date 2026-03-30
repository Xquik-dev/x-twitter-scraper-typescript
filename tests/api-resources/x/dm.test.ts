// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import XTwitterScraper from 'x-twitter-scraper';

const client = new XTwitterScraper({
  apiKey: 'My API Key',
  bearerToken: 'My Bearer Token',
  baseURL: process.env['TEST_API_BASE_URL'] ?? 'http://127.0.0.1:4010',
});

describe('resource dm', () => {
  // Mock server tests are disabled
  test.skip('retrieveHistory', async () => {
    const responsePromise = client.x.dm.retrieveHistory('userId');
    const rawResponse = await responsePromise.asResponse();
    expect(rawResponse).toBeInstanceOf(Response);
    const response = await responsePromise;
    expect(response).not.toBeInstanceOf(Response);
    const dataAndResponse = await responsePromise.withResponse();
    expect(dataAndResponse.data).toBe(response);
    expect(dataAndResponse.response).toBe(rawResponse);
  });

  // Mock server tests are disabled
  test.skip('retrieveHistory: request options and params are passed correctly', async () => {
    // ensure the request options are being passed correctly by passing an invalid HTTP method in order to cause an error
    await expect(
      client.x.dm.retrieveHistory(
        'userId',
        { cursor: 'cursor', maxId: 'maxId' },
        { path: '/_stainless_unknown_path' },
      ),
    ).rejects.toThrow(XTwitterScraper.NotFoundError);
  });

  // Mock server tests are disabled
  test.skip('send: only required params', async () => {
    const responsePromise = client.x.dm.send('userId', { account: 'account', text: 'text' });
    const rawResponse = await responsePromise.asResponse();
    expect(rawResponse).toBeInstanceOf(Response);
    const response = await responsePromise;
    expect(response).not.toBeInstanceOf(Response);
    const dataAndResponse = await responsePromise.withResponse();
    expect(dataAndResponse.data).toBe(response);
    expect(dataAndResponse.response).toBe(rawResponse);
  });

  // Mock server tests are disabled
  test.skip('send: required and optional params', async () => {
    const response = await client.x.dm.send('userId', {
      account: 'account',
      text: 'text',
      media_ids: ['string'],
      reply_to_message_id: 'reply_to_message_id',
    });
  });
});
