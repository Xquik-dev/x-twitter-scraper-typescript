// SPDX-FileCopyrightText: 2026 Xquik contributors
//
// SPDX-License-Identifier: Apache-2.0

import XTwitterScraper from 'x-twitter-scraper';
import { fixtureClient } from '../fixture-client';

const row: XTwitterScraper.ActivityLogRow = {
  time: '2026-10-28T20:22:13.481Z',
  category: 'monitor_change',
  type: 'pause',
  activity: 'Account monitor for @elonmusk paused',
  status: 'completed',
  source: 'elonmusk',
  target: '',
  results: '',
  credits: 1000,
  details: '',
  id: 'naF3xqHLWDTs',
  link: '',
};

const record: XTwitterScraper.ActivityRecord = {
  object: 'activity',
  id: 'naF3xqHLWDTs',
  kind: 'monitor_change',
  type: 'pause',
  status: 'completed',
  url: 'https://dashboard.xquik.com/activity/naF3xqHLWDTs',
  requestId: '9f2c1d7e4b8a4c55a1e0d3b2c6f7a8e9',
  timestamps: { createdAt: '2026-10-28T20:22:13.481Z' },
  request: {
    method: 'PATCH',
    path: '/api/v1/monitors/42',
    httpStatus: 200,
    durationMs: 37,
    ipAddress: '203.0.113.9',
    userAgent: 'my-agent/1.0',
    at: '2026-10-28T20:22:13.519Z',
  },
  caller: {
    authMethod: 'api_key',
    apiKey: { name: 'Production', prefix: 'xq_ab12' },
    oauthClient: null,
  },
  charge: null,
  details: { monitorKind: 'account', monitorId: '42', subjectQuery: null, surface: 'rest' },
  related: [
    {
      id: 'Q7wErTyUiOpA',
      type: 'create',
      status: 'completed',
      createdAt: '2026-10-21T09:12:40.002Z',
      url: 'https://dashboard.xquik.com/activity/Q7wErTyUiOpA',
    },
  ],
};

describe('resource activity', () => {
  test('list: sends the filters and returns the rows', async () => {
    const { client, requests } = fixtureClient([row]);

    const rows: XTwitterScraper.ActivityListResponse = await client.activity.list({
      category: 'monitors',
      limit: 50,
    });

    expect(requests).toEqual(['GET https://xquik.test/api/v1/activity?category=monitors&limit=50']);
    expect(rows).toEqual([row]);
  });

  test('retrieve: returns the activity record', async () => {
    const { client, requests } = fixtureClient(record);

    const response: XTwitterScraper.ActivityRecord = await client.activity.retrieve('naF3xqHLWDTs');

    expect(requests).toEqual(['GET https://xquik.test/api/v1/activity/naF3xqHLWDTs']);
    expect(response).toEqual(record);
  });

  test('export: sends the format and returns the raw file', async () => {
    const { client, requests, sent } = fixtureClient([row]);

    const response = await client.activity.export({ format: 'csv', status: 'failed,running' });

    expect(requests).toEqual(['GET https://xquik.test/api/v1/activity?format=csv&status=failed%2Crunning']);
    expect(sent[0]?.headers.get('accept')).toBe('application/octet-stream');
    expect(response).toBeInstanceOf(Response);
    expect(await response.json()).toEqual([row]);
  });
});
