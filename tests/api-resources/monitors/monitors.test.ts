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

describe('resource monitors', () => {
  test('create: only required params', async () => {
    const responsePromise = client.monitors.create({
      eventTypes: ['tweet.new', 'tweet.reply'],
      username: 'elonmusk',
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
    const response = await client.monitors.create({
      eventTypes: ['tweet.new', 'tweet.reply'],
      username: 'elonmusk',
      name: 'Launch watch',
    });
  });

  test('retrieve', async () => {
    const responsePromise = client.monitors.retrieve('id');
    const rawResponse = await responsePromise.asResponse();
    expect(rawResponse).toBeInstanceOf(Response);
    const response = await responsePromise;
    expect(response).not.toBeInstanceOf(Response);
    const dataAndResponse = await responsePromise.withResponse();
    expect(dataAndResponse.data).toBe(response);
    expect(dataAndResponse.response).toBe(rawResponse);
  });

  test('update', async () => {
    const responsePromise = client.monitors.update('id', {});
    const rawResponse = await responsePromise.asResponse();
    expect(rawResponse).toBeInstanceOf(Response);
    const response = await responsePromise;
    expect(response).not.toBeInstanceOf(Response);
    const dataAndResponse = await responsePromise.withResponse();
    expect(dataAndResponse.data).toBe(response);
    expect(dataAndResponse.response).toBe(rawResponse);
  });

  test('list', async () => {
    const responsePromise = client.monitors.list();
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
      client.monitors.list({ cursor: 'cursor', limit: 1 }, { path: '/_stainless_unknown_path' }),
    ).rejects.toThrow(XTwitterScraper.NotFoundError);
  });

  test('deactivate', async () => {
    const responsePromise = client.monitors.deactivate('id');
    const rawResponse = await responsePromise.asResponse();
    expect(rawResponse).toBeInstanceOf(Response);
    const response = await responsePromise;
    expect(response).not.toBeInstanceOf(Response);
    const dataAndResponse = await responsePromise.withResponse();
    expect(dataAndResponse.data).toBe(response);
    expect(dataAndResponse.response).toBe(rawResponse);
  });

  test('create: sends the follow and count event types', async () => {
    const { client: fixture, sent } = fixtureClient({});

    await fixture.monitors.create({
      eventTypes: [
        'follower.added',
        'follower.removed',
        'profile.followers.changed',
        'profile.following.changed',
      ],
      username: 'elonmusk',
    });

    expect(await sent[0]?.json()).toEqual({
      eventTypes: [
        'follower.added',
        'follower.removed',
        'profile.followers.changed',
        'profile.following.changed',
      ],
      username: 'elonmusk',
    });
  });

  test('retrieve: returns a monitor paused for a low balance', async () => {
    const example: XTwitterScraper.Monitor = {
      id: '42',
      username: 'elonmusk',
      xUserId: '1234567890',
      eventTypes: ['tweet.new', 'tweet.reply'],
      isActive: false,
      createdAt: '2025-01-15T12:00:00Z',
      nextBillingAt: '2025-01-15T13:00:00Z',
      pausedAt: '2025-01-15T12:00:00Z',
      pausedReason: 'insufficient_credits',
    };
    const { client: fixture, requests } = fixtureClient(example);

    const response: XTwitterScraper.Monitor = await fixture.monitors.retrieve('42');

    expect(requests).toEqual(['GET https://xquik.test/api/v1/monitors/42']);
    expect(response).toEqual(example);
  });
});
