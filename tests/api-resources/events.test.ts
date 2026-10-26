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

  test('stream sends lookBack & include as query & the last event ID as a header', async () => {
    const { client: fixture, requests, sent } = fixtureClient({});

    await fixture.events.stream({ 'Last-Event-ID': '42', lookBack: true, include: 'post_metrics' });

    expect(requests).toEqual([
      'GET https://xquik.test/api/v1/events/stream?lookBack=true&include=post_metrics',
    ]);
    const [request] = sent;
    expect(request?.headers.get('Last-Event-ID')).toBe('42');
  });

  test('stream: request options and params are passed correctly', async () => {
    await expect(
      client.events.stream({ 'Last-Event-ID': '42' }, { path: '/_stainless_unknown_path' }),
    ).rejects.toThrow(XTwitterScraper.NotFoundError);
  });

  test('retrieve: returns a follower event with the follow time', async () => {
    const follow: XTwitterScraper.MonitorFollow = {
      id: '2244994945',
      followedAt: '2026-10-13T02:36:54.961Z',
      followedAtExact: true,
    };
    const example: XTwitterScraper.EventDetail = {
      id: '42',
      type: 'follower.added',
      username: 'elonmusk',
      monitorId: '7',
      monitorType: 'account',
      occurredAt: '2025-01-15T12:00:00Z',
      data: follow,
    };
    const { client: fixture, requests } = fixtureClient(example);

    const response: XTwitterScraper.EventDetail = await fixture.events.retrieve('42');

    expect(requests).toEqual(['GET https://xquik.test/api/v1/events/42']);
    expect(response).toEqual(example);
  });

  test('retrieve: returns embedded monitor post fields and legacy author fields', async () => {
    const retweeted: XTwitterScraper.Event.MonitorPost.RetweetedTweet = {
      id: '2',
      bookmarkCount: 0,
      likeCount: 0,
      quoteCount: 0,
      replyCount: 0,
      retweetCount: 0,
      text: 'Just launched!',
      viewCount: 0,
      createdAt: '2025-01-15T12:00:00Z',
      entities: { hashtags: [{ text: 'Artemis' }] },
      author: {
        id: '11348282',
        name: 'NASA',
        username: 'NASA',
        rawVerified: true,
        userName: 'NASA',
      },
      parentTweet: {
        id: '3',
        bookmarkCount: 0,
        likeCount: 0,
        quoteCount: 0,
        replyCount: 0,
        retweetCount: 0,
        text: 'Launch preparation',
        viewCount: 0,
        custom: 'preserved',
      },
    };
    const quoted: XTwitterScraper.Event.MonitorPost.QuotedTweet = retweeted;
    const post: XTwitterScraper.EventDetail.MonitorPost = {
      id: '1',
      bookmarkCount: 0,
      likeCount: 0,
      quoteCount: 0,
      replyCount: 0,
      retweetCount: 0,
      text: 'Launch update',
      viewCount: 0,
      quoted_tweet: quoted,
      retweeted_tweet: retweeted,
    };
    const example: XTwitterScraper.EventDetail = {
      id: '42',
      type: 'tweet.new',
      username: 'NASA',
      monitorId: '7',
      monitorType: 'account',
      occurredAt: '2025-01-15T12:00:00Z',
      data: post,
    };
    const { client: fixture } = fixtureClient(example);

    const response: XTwitterScraper.EventDetail = await fixture.events.retrieve('42');
    const data = response.data as XTwitterScraper.EventDetail.MonitorPost;
    const createdAt: string | undefined = data.retweeted_tweet?.createdAt;

    expect(response).toEqual(example);
    expect(createdAt).toBe('2025-01-15T12:00:00Z');
    expect(data.retweeted_tweet?.entities?.hashtags?.[0]?.text).toBe('Artemis');
    expect(data.retweeted_tweet?.author?.userName).toBe('NASA');
    expect(data.retweeted_tweet?.parentTweet?.['custom']).toBe('preserved');
    expect(data.quoted_tweet?.entities?.hashtags?.[0]?.text).toBe('Artemis');
    expect(data.quoted_tweet?.author?.rawVerified).toBe(true);
  });

  test('list: filters by a follow event type and returns removals & count changes', async () => {
    const removal: XTwitterScraper.MonitorFollow = { id: '2244994945', reason: 'unfollowed' };
    const countChange: XTwitterScraper.Event.MonitorProfileChange = {
      field: 'followers',
      userId: '44196397',
      username: 'elonmusk',
      previous: 1003,
      current: 1000,
      change: -3,
    };
    const example: XTwitterScraper.EventListResponse = {
      events: [
        {
          id: '43',
          type: 'follower.removed',
          username: 'elonmusk',
          monitorId: '7',
          monitorType: 'account',
          occurredAt: '2025-01-15T12:00:00Z',
          data: removal,
        },
        {
          id: '44',
          type: 'profile.followers.changed',
          username: 'elonmusk',
          monitorId: '7',
          monitorType: 'account',
          occurredAt: '2025-01-15T12:00:00Z',
          data: countChange,
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
