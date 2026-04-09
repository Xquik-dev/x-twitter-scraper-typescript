// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import XTwitterScraper from 'x-twitter-scraper';

const client = new XTwitterScraper({
  apiKey: 'My API Key',
  baseURL: process.env['TEST_API_BASE_URL'] ?? 'http://127.0.0.1:4010',
});

describe('resource tweets', () => {
  // Mock server tests are disabled
  test.skip('create: only required params', async () => {
    const responsePromise = client.x.tweets.create({
      account: '@elonmusk',
      text: 'Just launched our new feature!',
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
    const response = await client.x.tweets.create({
      account: '@elonmusk',
      text: 'Just launched our new feature!',
      attachment_url: 'https://x.com/elonmusk/status/1234567890',
      community_id: '1500000000000000000',
      is_note_tweet: false,
      media_ids: ['1234567890123456789'],
      reply_to_tweet_id: '1234567890',
    });
  });

  // Mock server tests are disabled
  test.skip('retrieve', async () => {
    const responsePromise = client.x.tweets.retrieve('id');
    const rawResponse = await responsePromise.asResponse();
    expect(rawResponse).toBeInstanceOf(Response);
    const response = await responsePromise;
    expect(response).not.toBeInstanceOf(Response);
    const dataAndResponse = await responsePromise.withResponse();
    expect(dataAndResponse.data).toBe(response);
    expect(dataAndResponse.response).toBe(rawResponse);
  });

  // Mock server tests are disabled
  test.skip('list: only required params', async () => {
    const responsePromise = client.x.tweets.list({ ids: 'ids' });
    const rawResponse = await responsePromise.asResponse();
    expect(rawResponse).toBeInstanceOf(Response);
    const response = await responsePromise;
    expect(response).not.toBeInstanceOf(Response);
    const dataAndResponse = await responsePromise.withResponse();
    expect(dataAndResponse.data).toBe(response);
    expect(dataAndResponse.response).toBe(rawResponse);
  });

  // Mock server tests are disabled
  test.skip('list: required and optional params', async () => {
    const response = await client.x.tweets.list({ ids: 'ids' });
  });

  // Mock server tests are disabled
  test.skip('delete: only required params', async () => {
    const responsePromise = client.x.tweets.delete('id', { account: '@elonmusk' });
    const rawResponse = await responsePromise.asResponse();
    expect(rawResponse).toBeInstanceOf(Response);
    const response = await responsePromise;
    expect(response).not.toBeInstanceOf(Response);
    const dataAndResponse = await responsePromise.withResponse();
    expect(dataAndResponse.data).toBe(response);
    expect(dataAndResponse.response).toBe(rawResponse);
  });

  // Mock server tests are disabled
  test.skip('delete: required and optional params', async () => {
    const response = await client.x.tweets.delete('id', { account: '@elonmusk' });
  });

  // Mock server tests are disabled
  test.skip('getFavoriters', async () => {
    const responsePromise = client.x.tweets.getFavoriters('id');
    const rawResponse = await responsePromise.asResponse();
    expect(rawResponse).toBeInstanceOf(Response);
    const response = await responsePromise;
    expect(response).not.toBeInstanceOf(Response);
    const dataAndResponse = await responsePromise.withResponse();
    expect(dataAndResponse.data).toBe(response);
    expect(dataAndResponse.response).toBe(rawResponse);
  });

  // Mock server tests are disabled
  test.skip('getFavoriters: request options and params are passed correctly', async () => {
    // ensure the request options are being passed correctly by passing an invalid HTTP method in order to cause an error
    await expect(
      client.x.tweets.getFavoriters('id', { cursor: 'cursor' }, { path: '/_stainless_unknown_path' }),
    ).rejects.toThrow(XTwitterScraper.NotFoundError);
  });

  // Mock server tests are disabled
  test.skip('getQuotes', async () => {
    const responsePromise = client.x.tweets.getQuotes('id');
    const rawResponse = await responsePromise.asResponse();
    expect(rawResponse).toBeInstanceOf(Response);
    const response = await responsePromise;
    expect(response).not.toBeInstanceOf(Response);
    const dataAndResponse = await responsePromise.withResponse();
    expect(dataAndResponse.data).toBe(response);
    expect(dataAndResponse.response).toBe(rawResponse);
  });

  // Mock server tests are disabled
  test.skip('getQuotes: request options and params are passed correctly', async () => {
    // ensure the request options are being passed correctly by passing an invalid HTTP method in order to cause an error
    await expect(
      client.x.tweets.getQuotes(
        'id',
        {
          cursor: 'cursor',
          includeReplies: true,
          sinceTime: 'sinceTime',
          untilTime: 'untilTime',
        },
        { path: '/_stainless_unknown_path' },
      ),
    ).rejects.toThrow(XTwitterScraper.NotFoundError);
  });

  // Mock server tests are disabled
  test.skip('getReplies', async () => {
    const responsePromise = client.x.tweets.getReplies('id');
    const rawResponse = await responsePromise.asResponse();
    expect(rawResponse).toBeInstanceOf(Response);
    const response = await responsePromise;
    expect(response).not.toBeInstanceOf(Response);
    const dataAndResponse = await responsePromise.withResponse();
    expect(dataAndResponse.data).toBe(response);
    expect(dataAndResponse.response).toBe(rawResponse);
  });

  // Mock server tests are disabled
  test.skip('getReplies: request options and params are passed correctly', async () => {
    // ensure the request options are being passed correctly by passing an invalid HTTP method in order to cause an error
    await expect(
      client.x.tweets.getReplies(
        'id',
        {
          cursor: 'cursor',
          sinceTime: 'sinceTime',
          untilTime: 'untilTime',
        },
        { path: '/_stainless_unknown_path' },
      ),
    ).rejects.toThrow(XTwitterScraper.NotFoundError);
  });

  // Mock server tests are disabled
  test.skip('getRetweeters', async () => {
    const responsePromise = client.x.tweets.getRetweeters('id');
    const rawResponse = await responsePromise.asResponse();
    expect(rawResponse).toBeInstanceOf(Response);
    const response = await responsePromise;
    expect(response).not.toBeInstanceOf(Response);
    const dataAndResponse = await responsePromise.withResponse();
    expect(dataAndResponse.data).toBe(response);
    expect(dataAndResponse.response).toBe(rawResponse);
  });

  // Mock server tests are disabled
  test.skip('getRetweeters: request options and params are passed correctly', async () => {
    // ensure the request options are being passed correctly by passing an invalid HTTP method in order to cause an error
    await expect(
      client.x.tweets.getRetweeters('id', { cursor: 'cursor' }, { path: '/_stainless_unknown_path' }),
    ).rejects.toThrow(XTwitterScraper.NotFoundError);
  });

  // Mock server tests are disabled
  test.skip('getThread', async () => {
    const responsePromise = client.x.tweets.getThread('id');
    const rawResponse = await responsePromise.asResponse();
    expect(rawResponse).toBeInstanceOf(Response);
    const response = await responsePromise;
    expect(response).not.toBeInstanceOf(Response);
    const dataAndResponse = await responsePromise.withResponse();
    expect(dataAndResponse.data).toBe(response);
    expect(dataAndResponse.response).toBe(rawResponse);
  });

  // Mock server tests are disabled
  test.skip('getThread: request options and params are passed correctly', async () => {
    // ensure the request options are being passed correctly by passing an invalid HTTP method in order to cause an error
    await expect(
      client.x.tweets.getThread('id', { cursor: 'cursor' }, { path: '/_stainless_unknown_path' }),
    ).rejects.toThrow(XTwitterScraper.NotFoundError);
  });

  // Mock server tests are disabled
  test.skip('search: only required params', async () => {
    const responsePromise = client.x.tweets.search({ q: 'q' });
    const rawResponse = await responsePromise.asResponse();
    expect(rawResponse).toBeInstanceOf(Response);
    const response = await responsePromise;
    expect(response).not.toBeInstanceOf(Response);
    const dataAndResponse = await responsePromise.withResponse();
    expect(dataAndResponse.data).toBe(response);
    expect(dataAndResponse.response).toBe(rawResponse);
  });

  // Mock server tests are disabled
  test.skip('search: required and optional params', async () => {
    const response = await client.x.tweets.search({
      q: 'q',
      cursor: 'cursor',
      limit: 200,
      queryType: 'Latest',
      sinceTime: 'sinceTime',
      untilTime: 'untilTime',
    });
  });
});
