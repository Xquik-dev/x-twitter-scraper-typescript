// SPDX-FileCopyrightText: 2026 Xquik contributors
//
// SPDX-License-Identifier: Apache-2.0

import XTwitterScraper from 'x-twitter-scraper';

const client = new XTwitterScraper({
  apiKey: 'My API Key',
  bearerToken: 'My Bearer Token',
  baseURL: process.env['TEST_API_BASE_URL'] ?? 'http://127.0.0.1:4010',
});

describe('resource x', () => {
  test('autocompleteSearch: only required params', async () => {
    const responsePromise = client.x.autocompleteSearch({ q: 'nasa' });
    const rawResponse = await responsePromise.asResponse();
    expect(rawResponse).toBeInstanceOf(Response);
    const response = await responsePromise;
    expect(response).not.toBeInstanceOf(Response);
    const dataAndResponse = await responsePromise.withResponse();
    expect(dataAndResponse.data).toBe(response);
    expect(dataAndResponse.response).toBe(rawResponse);
  });

  test('autocompleteSearch: required and optional params', async () => {
    const response = await client.x.autocompleteSearch({
      q: 'nasa',
      fields: 'id,text,author.username',
      limit: 1,
      omit: 'entities,media',
      types: 'users,topics',
    });
  });

  test('getArticle', async () => {
    const responsePromise = client.x.getArticle('tweetId');
    const rawResponse = await responsePromise.asResponse();
    expect(rawResponse).toBeInstanceOf(Response);
    const response = await responsePromise;
    expect(response).not.toBeInstanceOf(Response);
    const dataAndResponse = await responsePromise.withResponse();
    expect(dataAndResponse.data).toBe(response);
    expect(dataAndResponse.response).toBe(rawResponse);
  });

  test('getArticle: request options and params are passed correctly', async () => {
    await expect(
      client.x.getArticle(
        'tweetId',
        { fields: 'id,text,author.username', omit: 'entities,media' },
        { path: '/_stainless_unknown_path' },
      ),
    ).rejects.toThrow(XTwitterScraper.NotFoundError);
  });

  test('getHashflags', async () => {
    const responsePromise = client.x.getHashflags();
    const rawResponse = await responsePromise.asResponse();
    expect(rawResponse).toBeInstanceOf(Response);
    const response = await responsePromise;
    expect(response).not.toBeInstanceOf(Response);
    const dataAndResponse = await responsePromise.withResponse();
    expect(dataAndResponse.data).toBe(response);
    expect(dataAndResponse.response).toBe(rawResponse);
  });

  test('getHashflags: request options and params are passed correctly', async () => {
    await expect(
      client.x.getHashflags(
        {
          activeOnly: true,
          fields: 'id,text,author.username',
          limit: 1,
          omit: 'entities,media',
          q: 'q',
        },
        { path: '/_stainless_unknown_path' },
      ),
    ).rejects.toThrow(XTwitterScraper.NotFoundError);
  });

  test('getHomeTimeline', async () => {
    const responsePromise = client.x.getHomeTimeline();
    const rawResponse = await responsePromise.asResponse();
    expect(rawResponse).toBeInstanceOf(Response);
    const response = await responsePromise;
    expect(response).not.toBeInstanceOf(Response);
    const dataAndResponse = await responsePromise.withResponse();
    expect(dataAndResponse.data).toBe(response);
    expect(dataAndResponse.response).toBe(rawResponse);
  });

  test('getHomeTimeline: request options and params are passed correctly', async () => {
    await expect(
      client.x.getHomeTimeline(
        { cursor: 'cursor', seenTweetIds: 'seenTweetIds' },
        { path: '/_stainless_unknown_path' },
      ),
    ).rejects.toThrow(XTwitterScraper.NotFoundError);
  });

  test('getNotifications', async () => {
    const responsePromise = client.x.getNotifications();
    const rawResponse = await responsePromise.asResponse();
    expect(rawResponse).toBeInstanceOf(Response);
    const response = await responsePromise;
    expect(response).not.toBeInstanceOf(Response);
    const dataAndResponse = await responsePromise.withResponse();
    expect(dataAndResponse.data).toBe(response);
    expect(dataAndResponse.response).toBe(rawResponse);
  });

  test('getNotifications: request options and params are passed correctly', async () => {
    await expect(
      client.x.getNotifications({ cursor: 'cursor', type: 'All' }, { path: '/_stainless_unknown_path' }),
    ).rejects.toThrow(XTwitterScraper.NotFoundError);
  });

  test('getTrendLocations', async () => {
    const responsePromise = client.x.getTrendLocations();
    const rawResponse = await responsePromise.asResponse();
    expect(rawResponse).toBeInstanceOf(Response);
    const response = await responsePromise;
    expect(response).not.toBeInstanceOf(Response);
    const dataAndResponse = await responsePromise.withResponse();
    expect(dataAndResponse.data).toBe(response);
    expect(dataAndResponse.response).toBe(rawResponse);
  });

  test('getTrendLocations: request options and params are passed correctly', async () => {
    await expect(
      client.x.getTrendLocations(
        {
          country: 'country',
          fields: 'id,text,author.username',
          limit: 1,
          omit: 'entities,media',
          placeType: 'country',
          q: 'q',
        },
        { path: '/_stainless_unknown_path' },
      ),
    ).rejects.toThrow(XTwitterScraper.NotFoundError);
  });

  test('getTrends', async () => {
    const responsePromise = client.x.getTrends();
    const rawResponse = await responsePromise.asResponse();
    expect(rawResponse).toBeInstanceOf(Response);
    const response = await responsePromise;
    expect(response).not.toBeInstanceOf(Response);
    const dataAndResponse = await responsePromise.withResponse();
    expect(dataAndResponse.data).toBe(response);
    expect(dataAndResponse.response).toBe(rawResponse);
  });

  test('getTrends: request options and params are passed correctly', async () => {
    await expect(
      client.x.getTrends(
        {
          count: 1,
          country: 'country',
          fields: 'id,text,author.username',
          location: 'location',
          omit: 'entities,media',
          woeid: 1,
        },
        { path: '/_stainless_unknown_path' },
      ),
    ).rejects.toThrow(XTwitterScraper.NotFoundError);
  });

  test('searchPlaces: only required params', async () => {
    const responsePromise = client.x.searchPlaces({ q: 'q' });
    const rawResponse = await responsePromise.asResponse();
    expect(rawResponse).toBeInstanceOf(Response);
    const response = await responsePromise;
    expect(response).not.toBeInstanceOf(Response);
    const dataAndResponse = await responsePromise.withResponse();
    expect(dataAndResponse.data).toBe(response);
    expect(dataAndResponse.response).toBe(rawResponse);
  });

  test('searchPlaces: required and optional params', async () => {
    const response = await client.x.searchPlaces({
      q: 'q',
      fields: 'id,text,author.username',
      limit: 1,
      omit: 'entities,media',
    });
  });
});
