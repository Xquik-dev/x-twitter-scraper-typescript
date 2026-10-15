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

describe('resource events', () => {
  test('retrieve', async () => {
    const responsePromise = client.events.retrieve('id');
    const rawResponse = await responsePromise.asResponse();
    expect(rawResponse).toBeInstanceOf(Response);
    const response = await responsePromise;
    expect(response).not.toBeInstanceOf(Response);
    const dataAndResponse = await responsePromise.withResponse();
    expect(dataAndResponse.data).toBe(response);
    expect(dataAndResponse.response).toBe(rawResponse);
  });

  test('list', async () => {
    const responsePromise = client.events.list();
    const rawResponse = await responsePromise.asResponse();
    expect(rawResponse).toBeInstanceOf(Response);
    const response = await responsePromise;
    expect(response).not.toBeInstanceOf(Response);
    const dataAndResponse = await responsePromise.withResponse();
    expect(dataAndResponse.data).toBe(response);
    expect(dataAndResponse.response).toBe(rawResponse);
  });

  test('list: request options and params are passed correctly', async () => {
    await expect(
      client.events.list(
        {
          cursor: 'cursor',
          eventType: 'tweet.new',
          keywordMonitorId: 'keywordMonitorId',
          limit: 1,
          monitorId: 'monitorId',
        },
        { path: '/_stainless_unknown_path' },
      ),
    ).rejects.toThrow(XTwitterScraper.NotFoundError);
  });

  test('stream', async () => {
    const responsePromise = client.events.stream();
    const rawResponse = await responsePromise.asResponse();
    expect(rawResponse).toBeInstanceOf(Response);
    const response = await responsePromise;
    expect(response).not.toBeInstanceOf(Response);
    const dataAndResponse = await responsePromise.withResponse();
    expect(dataAndResponse.data).toBe(response);
    expect(dataAndResponse.response).toBe(rawResponse);
  });

  test('stream: request options and params are passed correctly', async () => {
    await expect(
      client.events.stream({ 'Last-Event-ID': '42' }, { path: '/_stainless_unknown_path' }),
    ).rejects.toThrow(XTwitterScraper.NotFoundError);
  });

  test('retrieve: returns a follower event with the follow time', async () => {
    const example: XTwitterScraper.EventDetail = {
      id: '42',
      type: 'follower.added',
      username: 'elonmusk',
      monitorId: '7',
      monitorType: 'account',
      occurredAt: '2025-01-15T12:00:00Z',
      data: { id: '2244994945', followedAt: '2026-10-13T02:36:54.961Z', followedAtExact: true },
    };
    const { client: fixture, requests } = fixtureClient(example);

    const response: XTwitterScraper.EventDetail = await fixture.events.retrieve('42');

    expect(requests).toEqual(['GET https://xquik.test/api/v1/events/42']);
    expect(response).toEqual(example);
  });

  test('list: filters by a follow event type and returns removals & count changes', async () => {
    const example: XTwitterScraper.EventListResponse = {
      events: [
        {
          id: '43',
          type: 'follower.removed',
          username: 'elonmusk',
          monitorId: '7',
          monitorType: 'account',
          occurredAt: '2025-01-15T12:00:00Z',
          data: { id: '2244994945', reason: 'unfollowed' },
        },
        {
          id: '44',
          type: 'profile.followers.changed',
          username: 'elonmusk',
          monitorId: '7',
          monitorType: 'account',
          occurredAt: '2025-01-15T12:00:00Z',
          data: {
            field: 'followers',
            userId: '44196397',
            username: 'elonmusk',
            previous: 1003,
            current: 1000,
            change: -3,
          },
        },
      ],
      hasMore: false,
    };
    const { client: fixture, requests } = fixtureClient(example);

    const response: XTwitterScraper.EventListResponse = await fixture.events.list({
      eventType: 'follower.removed',
    });

    expect(requests).toEqual(['GET https://xquik.test/api/v1/events?eventType=follower.removed']);
    expect(response).toEqual(example);
  });
});
