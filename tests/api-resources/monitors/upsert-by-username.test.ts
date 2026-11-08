// SPDX-FileCopyrightText: 2026 Xquik contributors
//
// SPDX-License-Identifier: Apache-2.0

import type { MonitorUpsertByUsernameParams } from 'x-twitter-scraper/resources/monitors/monitors';
import { fixtureClient } from '../../fixture-client';

const monitor = {
  created: true,
  id: '42',
  username: 'elonmusk',
  xUserId: '1234567890',
  name: 'Launch watch',
  eventTypes: ['tweet.new', 'tweet.reply'],
  isActive: true,
  createdAt: '2025-01-15T12:00:00Z',
  nextBillingAt: '2025-01-15T12:00:00Z',
};

const bodies: Array<MonitorUpsertByUsernameParams> = [
  { eventTypes: ['tweet.new'] },
  { eventTypes: ['tweet.new'], name: 'Launch watch' },
  { eventTypes: ['tweet.new'], name: null },
];

describe('monitors.upsertByUsername', () => {
  test.each(bodies)('puts %j and reads created', async (body) => {
    const { client, requests, sent } = fixtureClient(monitor);

    const response = await client.monitors.upsertByUsername('elonmusk', body);

    expect(requests).toEqual(['PUT https://xquik.test/api/v1/monitors/username/elonmusk']);
    expect(await sent[0]?.json()).toEqual(body);
    expect(response.created).toBe(true);
    expect(response.id).toBe('42');
    expect(response.xUserId).toBe('1234567890');
  });
});

describe('x.media.download', () => {
  test('returns the posts it had no time to read', async () => {
    const { client } = fixtureClient({ unprocessedTweetIds: ['8'] });

    const response = await client.x.media.download({ tweetIds: ['7', '8'] });

    expect(response.unprocessedTweetIds).toEqual(['8']);
  });
});
