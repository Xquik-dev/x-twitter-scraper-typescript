// SPDX-FileCopyrightText: 2026 Xquik contributors
//
// SPDX-License-Identifier: Apache-2.0

import XTwitterScraper from 'x-twitter-scraper';
import { fixtureClient } from '../../fixture-client';

const monitor: XTwitterScraper.Monitors.PostMonitor = {
  id: '31',
  name: 'Launch post',
  postId: '2104984505677430978',
  postUrl: 'https://x.com/xquik/status/2104984505677430978',
  authorId: '1661816432185823232',
  authorUsername: 'xquik',
  authorName: 'Xquik',
  authorAvatarUrl: 'https://pbs.twimg.com/profile_images/1/xquik_normal.jpg',
  authorVerified: 'blue',
  media: [{ kind: 'photo', url: 'https://pbs.twimg.com/media/GxPhoto.jpg' }],
  text: 'We shipped post monitors.',
  postedAt: '2026-09-29T17:19:49.000Z',
  eventTypes: ['post.reply.new', 'post.quote.new', 'post.likes.changed'],
  isActive: true,
  createdAt: '2025-01-15T12:00:00Z',
  nextBillingAt: '2026-10-22T12:00:00Z',
  baseline: {
    at: '2026-10-22T11:00:00Z',
    views: null,
    likes: 1873,
    retweets: 40,
    replies: 12,
    quotes: 3,
    bookmarks: 9,
  },
  pausedReason: 'x_post_deleted',
  pausedAt: '2026-10-22T12:00:00Z',
  metrics: {
    views: {
      current: 1885,
      gain: 12,
    },
    likes: {
      current: 1885,
      gain: 12,
    },
    retweets: {
      current: 1885,
      gain: 12,
    },
    replies: {
      current: 1885,
      gain: 12,
    },
    quotes: {
      current: 1885,
      gain: 12,
    },
    bookmarks: {
      current: 1885,
      gain: 12,
    },
  },
};

describe('resource posts', () => {
  test('create sends the post, label & event types and returns the monitor', async () => {
    const { client, requests, sent } = fixtureClient(monitor);

    const response = await client.monitors.posts.create({
      post: 'https://x.com/xquik/status/2104984505677430978',
      name: 'Launch post',
      eventTypes: ['post.reply.new', 'post.likes.changed'],
    });

    expect(requests).toEqual(['POST https://xquik.test/api/v1/monitors/posts']);
    expect(await sent[0]!.json()).toEqual({
      post: 'https://x.com/xquik/status/2104984505677430978',
      name: 'Launch post',
      eventTypes: ['post.reply.new', 'post.likes.changed'],
    });
    expect(response).toEqual(monitor);
    expect(response.metrics.views.current).toBe(1885);
    expect(response.pausedReason).toBe('x_post_deleted');
  });

  test('retrieve reads 1 monitor', async () => {
    const { client, requests } = fixtureClient(monitor);

    const response = await client.monitors.posts.retrieve('31');

    expect(requests).toEqual(['GET https://xquik.test/api/v1/monitors/posts/31']);
    expect(response.postId).toBe('2104984505677430978');
  });

  test('update sends null to remove the label', async () => {
    const { client, requests, sent } = fixtureClient(monitor);

    const response = await client.monitors.posts.update('31', { isActive: false, name: null });

    expect(requests).toEqual(['PATCH https://xquik.test/api/v1/monitors/posts/31']);
    expect(await sent[0]!.json()).toEqual({ isActive: false, name: null });
    expect(response.id).toBe('31');
  });

  test('list passes the cursor & limit', async () => {
    const page: XTwitterScraper.Monitors.PostListResponse = {
      monitors: [monitor],
      total: 1,
      hasMore: true,
      nextCursor: 'abc123',
    };
    const { client, requests } = fixtureClient(page);

    const response = await client.monitors.posts.list({ cursor: 'abc123', limit: 20 });

    expect(requests).toEqual(['GET https://xquik.test/api/v1/monitors/posts?cursor=abc123&limit=20']);
    expect(response).toEqual(page);
  });

  test('delete returns the status URL to poll', async () => {
    const deletion: XTwitterScraper.Monitors.PostDeleteResponse = {
      deletionStatus: 'deleting',
      statusUrl: '/api/v1/monitors/posts/31',
      success: true,
    };
    const { client, requests } = fixtureClient(deletion);

    const response = await client.monitors.posts.delete('31');

    expect(requests).toEqual(['DELETE https://xquik.test/api/v1/monitors/posts/31']);
    expect(response.statusUrl).toBe('/api/v1/monitors/posts/31');
  });

  test('retrieveMetrics passes hours and returns hourly buckets', async () => {
    const metrics: XTwitterScraper.Monitors.PostMonitorMetrics = {
      hours: 12,
      buckets: [
        {
          at: '2026-10-22T11:00:00.000Z',
          metrics: {
            views: {
              value: 541600,
              gain: 500,
            },
            likes: {
              value: 1890,
              gain: 5,
            },
            retweets: {
              value: 112,
              gain: 0,
            },
            replies: {
              value: 86,
              gain: 1,
            },
            quotes: {
              value: 87,
              gain: 0,
            },
            bookmarks: {
              value: 471,
              gain: 1,
            },
          },
        },
      ],
    };
    const { client, requests } = fixtureClient(metrics);

    const response = await client.monitors.posts.retrieveMetrics('31', { hours: 12 });

    expect(requests).toEqual(['GET https://xquik.test/api/v1/monitors/posts/31/metrics?hours=12']);
    expect(response.buckets[0]!.metrics.views).toEqual({ value: 541600, gain: 500 });
  });

  test('events filter by post monitor & carry the post', async () => {
    const page = {
      events: [
        {
          id: '9001',
          type: 'post.reply.new',
          monitorId: '31',
          monitorType: 'post',
          monitorName: 'Launch post',
          occurredAt: '2026-10-22T11:05:00.000Z',
          postId: '2104984505677430978',
          postUrl: 'https://x.com/xquik/status/2104984505677430978',
          authorId: '1661816432185823232',
          authorUsername: 'xquik',
          data: {
            replyId: '2104990000000000000',
          },
        },
      ],
      hasMore: false,
    };
    const { client, requests } = fixtureClient(page);

    const response = await client.events.list({ postMonitorId: '31' });

    expect(requests).toEqual(['GET https://xquik.test/api/v1/events?postMonitorId=31']);
    expect(response.events[0]).toMatchObject({
      monitorType: 'post',
      type: 'post.reply.new',
      postId: '2104984505677430978',
      authorUsername: 'xquik',
    });
  });
});
