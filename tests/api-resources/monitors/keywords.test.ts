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

describe('resource keywords', () => {
  test('create: only required params', async () => {
    const responsePromise = client.monitors.keywords.create({
      eventTypes: ['tweet.new'],
      query: 'xquik OR "x api"',
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
    const response = await client.monitors.keywords.create({
      eventTypes: ['tweet.new'],
      query: 'xquik OR "x api"',
      name: 'Launch mentions',
    });
  });

  test('retrieve', async () => {
    const responsePromise = client.monitors.keywords.retrieve('id');
    const rawResponse = await responsePromise.asResponse();
    expect(rawResponse).toBeInstanceOf(Response);
    const response = await responsePromise;
    expect(response).not.toBeInstanceOf(Response);
    const dataAndResponse = await responsePromise.withResponse();
    expect(dataAndResponse.data).toBe(response);
    expect(dataAndResponse.response).toBe(rawResponse);
  });

  test('update', async () => {
    const responsePromise = client.monitors.keywords.update('id', {});
    const rawResponse = await responsePromise.asResponse();
    expect(rawResponse).toBeInstanceOf(Response);
    const response = await responsePromise;
    expect(response).not.toBeInstanceOf(Response);
    const dataAndResponse = await responsePromise.withResponse();
    expect(dataAndResponse.data).toBe(response);
    expect(dataAndResponse.response).toBe(rawResponse);
  });

  test('list', async () => {
    const responsePromise = client.monitors.keywords.list();
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
      client.monitors.keywords.list({ cursor: 'cursor', limit: 1 }, { path: '/_stainless_unknown_path' }),
    ).rejects.toThrow(XTwitterScraper.NotFoundError);
  });

  test('deactivate', async () => {
    const responsePromise = client.monitors.keywords.deactivate('id');
    const rawResponse = await responsePromise.asResponse();
    expect(rawResponse).toBeInstanceOf(Response);
    const response = await responsePromise;
    expect(response).not.toBeInstanceOf(Response);
    const dataAndResponse = await responsePromise.withResponse();
    expect(dataAndResponse.data).toBe(response);
    expect(dataAndResponse.response).toBe(rawResponse);
  });

  test('retrieve: returns why Xquik paused the keyword monitor', async () => {
    const example: XTwitterScraper.Monitors.KeywordRetrieveResponse = {
      id: '21',
      query: 'xquik OR "x api"',
      eventTypes: ['tweet.new'],
      isActive: false,
      createdAt: '2025-01-15T12:00:00Z',
      nextBillingAt: '2025-01-15T13:00:00Z',
      pausedAt: '2025-01-15T13:00:00Z',
      pausedReason: 'insufficient_credits',
    };
    const { client: fixture, requests } = fixtureClient(example);

    const response: XTwitterScraper.Monitors.KeywordRetrieveResponse =
      await fixture.monitors.keywords.retrieve('21');

    expect(requests).toEqual(['GET https://xquik.test/api/v1/monitors/keywords/21']);
    expect(response).toEqual(example);
  });
});
