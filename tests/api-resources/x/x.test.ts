// SPDX-FileCopyrightText: 2026 Xquik contributors
//
// SPDX-License-Identifier: Apache-2.0

import XTwitterScraper from 'x-twitter-scraper';
import { fixtureClient } from '../../fixture-client';

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

  test('getNewsStoryVersions', async () => {
    const responsePromise = client.x.getNewsStoryVersions('id');
    const rawResponse = await responsePromise.asResponse();
    expect(rawResponse).toBeInstanceOf(Response);
    const response = await responsePromise;
    expect(response).not.toBeInstanceOf(Response);
    const dataAndResponse = await responsePromise.withResponse();
    expect(dataAndResponse.data).toBe(response);
    expect(dataAndResponse.response).toBe(rawResponse);
  });

  test('getNewsStoryVersions: request options and params are passed correctly', async () => {
    await expect(
      client.x.getNewsStoryVersions(
        'id',
        { fields: 'id,text,author.username', omit: 'entities,media' },
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
          at: '2026-10-13T14:00:00Z',
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

  test('getTrendsHistory', async () => {
    const responsePromise = client.x.getTrendsHistory();
    const rawResponse = await responsePromise.asResponse();
    expect(rawResponse).toBeInstanceOf(Response);
    const response = await responsePromise;
    expect(response).not.toBeInstanceOf(Response);
    const dataAndResponse = await responsePromise.withResponse();
    expect(dataAndResponse.data).toBe(response);
    expect(dataAndResponse.response).toBe(rawResponse);
  });

  test('getTrendsHistory: request options and params are passed correctly', async () => {
    await expect(
      client.x.getTrendsHistory(
        {
          count: 1,
          country: 'country',
          cursor: '2026-10-14T00:00:00.000Z~1791979200000',
          every: '1h',
          fields: 'id,text,author.username',
          from: '2026-10-13',
          limit: 1,
          location: 'location',
          omit: 'entities,media',
          to: '2026-10-14',
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

  test('getNewsStoryVersions: requests the story and returns its versions', async () => {
    const example: XTwitterScraper.X.XGetNewsStoryVersionsResponse = {
      id: '2110209733533598095',
      count: 1,
      versions: [
        {
          id: '2110211669641105725',
          createdAt: '2026-10-14T03:30:42.536Z',
          headline: "Elon Musk Pushes Starlink for India's Remote Areas Amid Regulatory Hurdles",
          text: "Musk has accused Reliance Industries' Mukesh Ambani of blocking Starlink's entry to protect local telecom giants like Jio, while India's government insists on equal treatment for all applicants, including ongoing security reviews. In Vietnam, Starlink already provides free internet to isolated spots for tourism and disaster response, highlighting its potential for hard-to-reach areas. Yet challengers note India's cheap mobile data from Jio and Airtel covers most needs, raising questions on pricing and national security as Starlink seeks final clearances.",
        },
      ],
    };
    const { client: fixture, requests } = fixtureClient(example);

    const response: XTwitterScraper.X.XGetNewsStoryVersionsResponse = await fixture.x.getNewsStoryVersions(
      'x.com/i/trending/2110209733533598095',
    );

    expect(requests).toEqual([
      'GET https://xquik.test/api/v1/x/news/x.com%2Fi%2Ftrending%2F2110209733533598095/versions',
    ]);
    expect(response).toEqual(example);
  });

  test('getTrends: reads the stored list nearest at and returns its times', async () => {
    const example: XTwitterScraper.X.XGetTrendsResponse = {
      trends: [
        {
          name: '#AI',
          description: 'Artificial intelligence discussions',
          promotedContent: null,
          query: '%23AI',
          rank: 1,
          tweetVolume: 250000,
          url: 'https://x.com/search?q=%23AI',
        },
      ],
      count: 1,
      woeid: 2344116,
      location: {
        woeid: 2344116,
        name: 'Istanbul',
        country: 'Turkey',
        countryCode: 'TR',
        placeType: 'Town',
        placeTypeCode: 7,
        parentWoeid: 23424969,
        url: 'http://where.yahooapis.com/v1/place/2344116',
      },
      capturedAt: '2026-10-13T14:00:26.000Z',
      requestedAt: '2026-10-13T14:00:00.000Z',
    };
    const { client: fixture, requests } = fixtureClient(example);

    const response: XTwitterScraper.X.XGetTrendsResponse = await fixture.x.getTrends({
      location: 'Istanbul',
      at: '2026-10-13T14:00:00Z',
    });

    expect(requests).toEqual([
      'GET https://xquik.test/api/v1/x/trends?location=Istanbul&at=2026-10-13T14%3A00%3A00Z',
    ]);
    expect(response).toEqual(example);
  });

  test('getTrendsHistory: sends the range and returns the stored lists', async () => {
    const example: XTwitterScraper.X.XGetTrendsHistoryResponse = {
      fromTime: '2026-10-13T00:00:00.000Z',
      toTime: '2026-10-14T00:00:00.000Z',
      snapshots: [
        {
          capturedAt: '2026-10-13T14:00:26.000Z',
          count: 1,
          trends: [
            {
              name: '#AI',
              description: 'Artificial intelligence discussions',
              promotedContent: null,
              query: '%23AI',
              rank: 1,
              tweetVolume: 250000,
              url: 'https://x.com/search?q=%23AI',
            },
          ],
        },
      ],
      count: 1,
      woeid: 1,
      has_next_page: false,
      next_cursor: '',
    };
    const { client: fixture, requests } = fixtureClient(example);

    const response: XTwitterScraper.X.XGetTrendsHistoryResponse = await fixture.x.getTrendsHistory({
      woeid: 1,
      from: '2026-10-13',
      to: '2026-10-14',
      every: '1h',
      count: 1,
    });

    expect(requests).toEqual([
      'GET https://xquik.test/api/v1/x/trends/history?woeid=1&from=2026-10-13&to=2026-10-14&every=1h&count=1',
    ]);
    expect(response).toEqual(example);
  });

  test('getTrendsHistory: returns the place a country names', async () => {
    const example: XTwitterScraper.X.XGetTrendsHistoryResponse = {
      fromTime: '2026-10-13T00:00:00.000Z',
      toTime: '2026-10-14T00:00:00.000Z',
      snapshots: [],
      count: 0,
      woeid: 23424969,
      location: {
        woeid: 23424969,
        name: 'Turkey',
        country: 'Turkey',
        countryCode: 'TR',
        placeType: 'Country',
        placeTypeCode: 12,
        parentWoeid: 1,
        url: 'http://where.yahooapis.com/v1/place/23424969',
      },
      has_next_page: false,
      next_cursor: '',
    };
    const { client: fixture, requests } = fixtureClient(example);

    const response: XTwitterScraper.X.XGetTrendsHistoryResponse = await fixture.x.getTrendsHistory({
      country: 'TR',
      cursor: '2026-10-14T00:00:00.000Z~1791979200000',
    });

    expect(requests).toEqual([
      'GET https://xquik.test/api/v1/x/trends/history?country=TR&cursor=2026-10-14T00%3A00%3A00.000Z~1791979200000',
    ]);
    expect(response).toEqual(example);
  });
});
