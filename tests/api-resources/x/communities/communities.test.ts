// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import XTwitterScraper from 'x-twitter-scraper';

const client = new XTwitterScraper({
  apiKey: 'My API Key',
  bearerToken: 'My Bearer Token',
  baseURL: process.env['TEST_API_BASE_URL'] ?? 'http://127.0.0.1:4010',
});

describe('resource communities', () => {
  test('create: only required params', async () => {
    const responsePromise = client.x.communities.create({
      account: '@elonmusk',
      name: 'Example Name',
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
    const response = await client.x.communities.create({
      account: '@elonmusk',
      name: 'Example Name',
      'Idempotency-Key': 'Idempotency-Key',
      description: 'A community for Tesla enthusiasts',
    });
  });

  test('delete: only required params', async () => {
    const responsePromise = client.x.communities.delete('id', {
      account: '@elonmusk',
      community_name: 'Tesla Fans',
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
    const response = await client.x.communities.delete('id', {
      account: '@elonmusk',
      community_name: 'Tesla Fans',
      'Idempotency-Key': 'Idempotency-Key',
    });
  });

  test('retrieveInfo', async () => {
    const responsePromise = client.x.communities.retrieveInfo('id');
    const rawResponse = await responsePromise.asResponse();
    expect(rawResponse).toBeInstanceOf(Response);
    const response = await responsePromise;
    expect(response).not.toBeInstanceOf(Response);
    const dataAndResponse = await responsePromise.withResponse();
    expect(dataAndResponse.data).toBe(response);
    expect(dataAndResponse.response).toBe(rawResponse);
  });

  test('retrieveMembers', async () => {
    const responsePromise = client.x.communities.retrieveMembers('id');
    const rawResponse = await responsePromise.asResponse();
    expect(rawResponse).toBeInstanceOf(Response);
    const response = await responsePromise;
    expect(response).not.toBeInstanceOf(Response);
    const dataAndResponse = await responsePromise.withResponse();
    expect(dataAndResponse.data).toBe(response);
    expect(dataAndResponse.response).toBe(rawResponse);
  });

  test('retrieveMembers: request options and params are passed correctly', async () => {
    // ensure the request options are being passed correctly by passing an invalid HTTP method in order to cause an error
    await expect(
      client.x.communities.retrieveMembers(
        'id',
        { cursor: 'cursor', pageSize: 20 },
        { path: '/_stainless_unknown_path' },
      ),
    ).rejects.toThrow(XTwitterScraper.NotFoundError);
  });

  test('retrieveModerators', async () => {
    const responsePromise = client.x.communities.retrieveModerators('id');
    const rawResponse = await responsePromise.asResponse();
    expect(rawResponse).toBeInstanceOf(Response);
    const response = await responsePromise;
    expect(response).not.toBeInstanceOf(Response);
    const dataAndResponse = await responsePromise.withResponse();
    expect(dataAndResponse.data).toBe(response);
    expect(dataAndResponse.response).toBe(rawResponse);
  });

  test('retrieveModerators: request options and params are passed correctly', async () => {
    // ensure the request options are being passed correctly by passing an invalid HTTP method in order to cause an error
    await expect(
      client.x.communities.retrieveModerators(
        'id',
        { cursor: 'cursor' },
        { path: '/_stainless_unknown_path' },
      ),
    ).rejects.toThrow(XTwitterScraper.NotFoundError);
  });

  test('retrieveSearch: only required params', async () => {
    const responsePromise = client.x.communities.retrieveSearch({ communityId: '321669910225', q: 'q' });
    const rawResponse = await responsePromise.asResponse();
    expect(rawResponse).toBeInstanceOf(Response);
    const response = await responsePromise;
    expect(response).not.toBeInstanceOf(Response);
    const dataAndResponse = await responsePromise.withResponse();
    expect(dataAndResponse.data).toBe(response);
    expect(dataAndResponse.response).toBe(rawResponse);
  });

  test('retrieveSearch: required and optional params', async () => {
    const response = await client.x.communities.retrieveSearch({
      communityId: '321669910225',
      q: 'q',
      cursor: 'cursor',
      pageSize: 1,
      queryType: 'Latest',
    });
  });
});
