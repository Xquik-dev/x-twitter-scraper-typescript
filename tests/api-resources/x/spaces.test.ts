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

describe('resource spaces', () => {
  test('retrieve', async () => {
    const responsePromise = client.x.spaces.retrieve('id');
    const rawResponse = await responsePromise.asResponse();
    expect(rawResponse).toBeInstanceOf(Response);
    const response = await responsePromise;
    expect(response).not.toBeInstanceOf(Response);
    const dataAndResponse = await responsePromise.withResponse();
    expect(dataAndResponse.data).toBe(response);
    expect(dataAndResponse.response).toBe(rawResponse);
  });

  test('retrieve: request options and params are passed correctly', async () => {
    await expect(
      client.x.spaces.retrieve(
        'id',
        { fields: 'id,text,author.username', omit: 'entities,media' },
        { path: '/_stainless_unknown_path' },
      ),
    ).rejects.toThrow(XTwitterScraper.NotFoundError);
  });

  test('retrieveReplay', async () => {
    const responsePromise = client.x.spaces.retrieveReplay('id');
    const rawResponse = await responsePromise.asResponse();
    expect(rawResponse).toBeInstanceOf(Response);
    const response = await responsePromise;
    expect(response).not.toBeInstanceOf(Response);
    const dataAndResponse = await responsePromise.withResponse();
    expect(dataAndResponse.data).toBe(response);
    expect(dataAndResponse.response).toBe(rawResponse);
  });

  test('retrieveReplay: request options and params are passed correctly', async () => {
    await expect(
      client.x.spaces.retrieveReplay(
        'id',
        { fields: 'id,text,author.username', omit: 'entities,media' },
        { path: '/_stainless_unknown_path' },
      ),
    ).rejects.toThrow(XTwitterScraper.NotFoundError);
  });

  test('search: only required params', async () => {
    const responsePromise = client.x.spaces.search({ q: 'from:solana' });
    const rawResponse = await responsePromise.asResponse();
    expect(rawResponse).toBeInstanceOf(Response);
    const response = await responsePromise;
    expect(response).not.toBeInstanceOf(Response);
    const dataAndResponse = await responsePromise.withResponse();
    expect(dataAndResponse.data).toBe(response);
    expect(dataAndResponse.response).toBe(rawResponse);
  });

  test('search: required and optional params', async () => {
    const response = await client.x.spaces.search({
      q: 'from:solana',
      cursor: 'cursor',
      fields: 'id,text,author.username',
      omit: 'entities,media',
      pageSize: 1,
      queryType: 'Latest',
    });
  });

  test.each(['Live', 'Upcoming'] as const)(
    'search: sends queryType %s and returns the Spaces',
    async (queryType) => {
      const example: XTwitterScraper.X.SpaceSearchResponse = {
        spaces: [
          {
            id: '1OGwblLjnQMKB',
            title: 'Extending the Network to the Edge',
            state: 'Ended',
            startedAt: '2026-03-11T17:00:26.227Z',
            endedAt: '2026-03-11T17:49:29.190Z',
            totalLiveListeners: 841,
            totalReplayWatched: 609,
            admins: [{ id: '951329744804392960', username: 'solana', name: 'Solana' }],
            speakers: [],
            listeners: [],
          },
        ],
        has_next_page: true,
        next_cursor: 'DAACCgACGRElMJcAAA',
      };
      const { client: fixture, requests } = fixtureClient(example);

      const response: XTwitterScraper.X.SpaceSearchResponse = await fixture.x.spaces.search({
        q: 'Network',
        queryType,
      });

      expect(requests).toEqual([
        `GET https://xquik.test/api/v1/x/spaces/search?q=Network&queryType=${queryType}`,
      ]);
      expect(response).toEqual(example);
    },
  );
});
